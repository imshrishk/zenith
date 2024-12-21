import React, { useState } from 'react';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { Button } from '../../common/Button';
import { formatDistanceToNow } from 'date-fns';
import type { User } from 'firebase/auth';
import type { Question } from '../../../types/firebase';

interface QuestionCardProps extends Question {
  currentUser: User | null;
  onLike: () => Promise<void>;
  onAnswer: (content: string) => Promise<void>;
}

export const QuestionCard = ({
  question,
  content,
  authorName,
  authorPhoto,
  createdAt,
  likes,
  answers,
  currentUser,
  onLike,
  onAnswer,
}: QuestionCardProps) => {
  const [isAnswering, setIsAnswering] = useState(false);
  const [answerContent, setAnswerContent] = useState('');

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAnswer(answerContent);
    setAnswerContent('');
    setIsAnswering(false);
  };

  const formattedDate = formatDistanceToNow(createdAt.toDate(), {
    addSuffix: true,
  });

  const isLiked = currentUser && likes.includes(currentUser.uid);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <img
          src={authorPhoto || '/default-avatar.png'}
          alt={authorName}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="text-xl font-semibold">{question}</h3>
          <div className="text-sm text-gray-500">
            <span>{authorName}</span>
            <span className="mx-2">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{content}</p>

      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            disabled={!currentUser}
          >
            <ThumbsUp
              className={`h-4 w-4 mr-1 ${
                isLiked ? 'fill-blue-500 text-blue-500' : ''
              }`}
            />
            {likes.length}
          </Button>
          <div className="flex items-center">
            <MessageCircle className="h-4 w-4 mr-1" />
            {answers.length}
          </div>
        </div>
        {currentUser && (
          <Button
            variant="outline"
            onClick={() => setIsAnswering(!isAnswering)}
          >
            Answer
          </Button>
        )}
      </div>

      {isAnswering && (
        <form onSubmit={handleSubmitAnswer} className="mb-6">
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            rows={4}
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="Write your answer..."
            required
          />
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsAnswering(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Answer</Button>
          </div>
        </form>
      )}

      {answers.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-lg">Answers</h4>
          {answers.map((answer) => (
            <div key={answer.id} className="border-t pt-4">
              <div className="flex items-center mb-2">
                <img
                  src={answer.authorPhoto || '/default-avatar.png'}
                  alt={answer.authorName}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <span className="font-medium">{answer.authorName}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {formatDistanceToNow(answer.createdAt.toDate(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">{answer.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};