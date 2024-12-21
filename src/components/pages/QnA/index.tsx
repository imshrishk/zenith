import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../common/Button';
import { QuestionCard } from './QuestionCard';
import { AskQuestionForm } from './AskQuestionForm';
import { useAuth } from '../../../hooks/useAuth';
import { getQuestions, createQuestion, likeQuestion, unlikeQuestion, addAnswer } from '../../../services/qnaService';
import type { Question } from '../../../types/firebase';
import { trackUserEngagement } from '../../../services/analyticsService';

export const QnAPage = () => {
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmitQuestion = async (data: { question: string; content: string }) => {
    if (!user) return;
    try {
      await createQuestion(
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL || '',
        data.question,
        data.content
      );
      trackUserEngagement('create', 'question');
      setIsAskingQuestion(false);
      const updatedQuestions = await getQuestions();
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Questions & Answers</h1>
        {user && (
          <Button onClick={() => setIsAskingQuestion(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ask Question
          </Button>
        )}
      </div>

      {isAskingQuestion ? (
        <AskQuestionForm
          onSubmit={handleSubmitQuestion}
          onCancel={() => setIsAskingQuestion(false)}
        />
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              {...question}
              currentUser={user}
              onLike={async () => {
                if (!user) return;
                try {
                  if (question.likes.includes(user.uid)) {
                    await unlikeQuestion(question.id, user.uid);
                  } else {
                    await likeQuestion(question.id, user.uid);
                  }
                  trackUserEngagement('like', 'question');
                  const updatedQuestions = await getQuestions();
                  setQuestions(updatedQuestions);
                } catch (error) {
                  console.error('Error updating like:', error);
                }
              }}
              onAnswer={async (content: string) => {
                if (!user) return;
                try {
                  await addAnswer(
                    question.id,
                    user.uid,
                    user.displayName || 'Anonymous',
                    user.photoURL || '',
                    content
                  );
                  trackUserEngagement('answer', 'question');
                  const updatedQuestions = await getQuestions();
                  setQuestions(updatedQuestions);
                } catch (error) {
                  console.error('Error adding answer:', error);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};