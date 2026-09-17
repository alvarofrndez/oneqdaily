'use client';

import { useState, useContext } from 'react';
import { submitAnswer } from '@/src/features/questions/actions';
import { UserContext } from '@/src/components/providers';
import type { User } from '@supabase/supabase-js';

export default function AnswerForm({ questionId }: { questionId: string }) {
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const user = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append('questionId', questionId);
    formData.append('answerText', answer);

    try {
      const result = await submitAnswer(formData);
      if (result.error) {
        alert(result.error);
      } else {
        setAnswer('');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="answer" className="block text-sm font-medium mb-2">
          Your answer:
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Share your thoughts..."
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={4}
          disabled={submitting}
        />
      </div>
      <div className="flex items-center space-x-3">
        {!user ? (
          <span className="text-sm text-gray-500">Posting as anonymous</span>
        ) : null}
      </div>
      <button
        type="submit"
        disabled={submitting || !answer.trim()}
        className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {submitting ? 'Submitting...' : 'Submit Answer'}
      </button>
    </form>
  );
}