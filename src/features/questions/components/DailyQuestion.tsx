'use client';

import { useState, useEffect } from 'react';
import { getTodayQuestion } from '../queries';
import type { Question } from '../types';
import { submitAnswer } from '../actions';
import AnswerList from './AnswerList';
import AnswerForm from './AnswerForm';

export default function DailyQuestion() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  async function fetchQuestion() {
    const q = await getTodayQuestion();
    setQuestion(q);
    setLoading(false);
  }

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      const diffMs = nextDay.getTime() - now.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
      if (diffSec <= 0) {
        // Reset to fetch new question for the new day
        setQuestion(null);
        setLoading(true);
        fetchQuestion();
      }
    };
    tick(); // immediate call
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!question) return <p>No question available.</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-4 text-sm text-gray-500">
        Next question in: <span className="font-mono">{timeLeft}</span>
      </div>
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