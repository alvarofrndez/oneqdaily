'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

import { useServerDateKey } from '@/src/components/server-clock';
import { getTodayQuestion } from '../queries';
import type { Question } from '../types';

import AnswerList from './AnswerList';
import AnswerForm from './AnswerForm';

import styles from './DailyQuestion.module.scss';
import Loader from '@/src/components/loader';

export default function DailyQuestion() {
  const t = useTranslations('Questions.DailyQuestion');

  const [question, setQuestion] = useState<Question | null>(null);
  const [questionDay, setQuestionDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnswersExpanded, setIsAnswersExpanded] = useState(false);

  const todayKey = useServerDateKey();

  useEffect(() => {
    if (todayKey === null || todayKey === questionDay) return;

    let active = true;
    setLoading(true);

    getTodayQuestion().then((today) => {
      if (!active) return;

      setQuestion(today);
      setQuestionDay(todayKey);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [todayKey, questionDay]);

  const toggleAnswers = () => {
    setIsAnswersExpanded((prev) => !prev);
  };

  if (loading) return <Loader variant="screen" />;
  if (!question) return <p>{t('noQuestion')}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.questionCard}>
        <div className={styles.questionCardHeader}>
          <h2 className={styles.question}>{question.text}</h2>
        </div>

        <div className={styles.questionCardContent}>
          <AnswerForm questionId={question.id} />
        </div>
      </div>

      <div className={styles.answersContainer}>
        <div
          className={styles.answersContainerTitle}
          onClick={toggleAnswers}
        >
          <h1 className={styles.title}>{t('answersTitle')}</h1>

          <ChevronRight
            size={18}
            className={`${styles.toggle} ${isAnswersExpanded ? styles.expandedToggle : ''}`}
          />
        </div>

        <div className={`${styles.answersWrapper} ${isAnswersExpanded ? styles.expandedWrapper : ''}`}>
          <div className={styles.answersInner}>
            <AnswerList questionId={question.id} />
          </div>
        </div>
      </div>
    </div>
  );
}