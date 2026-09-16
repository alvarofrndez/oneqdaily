'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AnswerForm({ questionId }: { questionId: string }) {
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    // We'll call the server action via fetch? Actually we need to use the action attribute.
    // We'll handle via a form submission.
    // We'll rely on the form's action.
    // For now, we'll just call a function that uses fetch to the action endpoint.
    // But we have a server action; we can call it directly if we import it?
    // Server actions cannot be imported in client components? Actually they can be imported as a function that returns a promise.
    // We'll import submitAnswer from './actions' and call it.
    // However, submitAnswer expects FormData, not plain object.
    // We'll create a FormData object.
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
        {user ? (
          <>
            <span className="text-sm text-gray-500">Logged in as:</span>
            <span className="font-medium">{user.email}</span>
          </>
        ) : (
          <span className="text-sm text-gray-500">Posting as anonymous</span>
        )}
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