'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

import { getTodayQuestion } from '../queries';
import type { Question } from '../types';

import AnswerList from './AnswerList';
import AnswerForm from './AnswerForm';

import styles from './DailyQuestion.module.scss';

export default function DailyQuestion() {
  const t = useTranslations('Questions.DailyQuestion');

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isAnswersExpanded, setIsAnswersExpanded] = useState(true);

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
      
      const diffSec = Math.floor((nextDay.getTime() - now.getTime()) / 1000);
      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
      
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

  const toggleAnswers = () => {
    setIsAnswersExpanded((prev) => !prev);
  };

  if (loading) return <p>{t('loading')}</p>;
  if (!question) return <p>{t('noQuestion')}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.questionCard}>
        <div className={styles.questionCardHeader}>
          <p className={styles.nextQuestion}>
            {t('nextQuestionIn')}
            <span className={styles.timeLeft}>{timeLeft}</span>
          </p>
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
          <h3 className={styles.title}>{t('answersTitle')}</h3>
          
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