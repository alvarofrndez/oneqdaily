'use client';

import { useState, useEffect } from 'react';
import { getTodayQuestion } from './queries';
import type { Question } from './types';
import { submitAnswer } from './actions';
import { AnswerList } from './AnswerList';
import { AnswerForm } from './AnswerForm';

export default async function DailyQuestion() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch the question on the server (this runs during server rendering)
  // Actually, we need to fetch in a server component; we can't use useState/useEffect in server component.
  // So we need to make this a client component and fetch in useEffect, or we make it a server component and fetch directly.
  // Let's change approach: make this a server component that fetches the question and passes props to client children.
  // We'll rewrite.

  // For now, we'll keep as client component and fetch in useEffect.
  // This will cause an extra roundtrip but is acceptable for MVP.

  useEffect(() => {
    async function fetchQuestion() {
      const q = await getTodayQuestion();
      setQuestion(q);
      setLoading(false);
    }
    fetchQuestion();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!question) return <p>No question available.</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{question.text}</h1>
      <div className="mb-6">
        <AnswerForm questionId={question.id} />
      </div>
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-4">Answers</h2>
        <AnswerList questionId={question.id} />
      </div>
    </div>
  );
}