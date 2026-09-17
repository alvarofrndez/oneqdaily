'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getTodayQuestion } from '../queries';
import type { Question } from '../types';
import AnswerList from './AnswerList';
import AnswerForm from './AnswerForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export default function DailyQuestion() {
  const t = useTranslations('Questions.DailyQuestion');
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  async function fetchQuestion() {
    const q = await getTodayQuestion();
    setQuestion(q);
    setLoading(false);
  }

  useEffect(() => { fetchQuestion(); }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      const diffSec = Math.floor((nextDay.getTime() - now.getTime()) / 1000);
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      if (diffSec <= 0) {
        setQuestion(null);
        setLoading(true);
        fetchQuestion();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>{t('loading')}</p>;
  if (!question) return <p>{t('noQuestion')}</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <p className="text-sm text-muted-foreground">
            {t('nextQuestionIn')} <span className="font-mono">{timeLeft}</span>
          </p>
          <CardTitle className="text-3xl">{question.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <AnswerForm questionId={question.id} />
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">{t('answersTitle')}</h2>
        <AnswerList questionId={question.id} />
      </div>
    </div>
  );
}