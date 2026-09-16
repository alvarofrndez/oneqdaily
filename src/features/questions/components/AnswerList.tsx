'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Answer } from '../types';

export default function AnswerList({ questionId }: { questionId: string }) {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnswers() {
      const { data, error } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', questionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching answers:', error);
        return;
      }

      setAnswers(data as Answer[]);
      setLoading(false);
    }

    fetchAnswers();
  }, [questionId]);

  if (loading) return <p>Loading answers...</p>;

  return (
    <div className="space-y-4">
      {answers.length === 0 ? (
        <p className="text-center text-gray-500">No answers yet. Be the first to respond!</p>
      ) : (
        answers.map((answer) => (
          <div key={answer.id} className="border p-4 rounded-lg">
            <p className="text-gray-700">{answer.answer_text}</p>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              {answer.user_id ? (
                <span>Answered by a user</span>
              ) : (
                <span>Anonymous</span>
              )}
              <span className="ml-4">
                {new Date(answer.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}