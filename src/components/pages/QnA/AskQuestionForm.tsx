import React, { useState } from 'react';
import { Button } from '../../common/Button';

interface AskQuestionFormProps {
  onSubmit: (data: { question: string; content: string }) => void;
  onCancel: () => void;
}

export const AskQuestionForm = ({ onSubmit, onCancel }: AskQuestionFormProps) => {
  const [question, setQuestion] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ question, content });
    setQuestion('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
            Question Title
          </label>
          <input
            type="text"
            id="question"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to know about meditation?"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Question Details
          </label>
          <textarea
            id="content"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide more details about your question..."
            required
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Ask Question
        </Button>
      </div>
    </form>
  );
};