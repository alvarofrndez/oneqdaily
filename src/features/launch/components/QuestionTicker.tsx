'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Shuffle } from 'lucide-react';

import styles from './QuestionTicker.module.scss';

const TYPE_DELAY = 42;
const ERASE_DELAY = 18;
const HOLD_DELAY = 2600;
const REDUCED_MOTION_DELAY = 5000;

type Props = {
  questions: string[];
};

export default function QuestionTicker({ questions }: Props) {
  const t = useTranslations('Launch');

  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState('');

  const current = questions[index] ?? '';

  const next = useCallback(() => {
    setIndex((previous) => (previous + 1) % Math.max(questions.length, 1));
  }, [questions.length]);

  useEffect(() => {
    if (!current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Sin animación de escritura: mostramos la pregunta completa y rotamos.
    if (prefersReducedMotion) {
      setTyped(current);
      const timer = window.setTimeout(next, REDUCED_MOTION_DELAY);
      return () => window.clearTimeout(timer);
    }

    let length = 0;
    let timer: number;

    const erase = () => {
      length -= 1;
      setTyped(current.slice(0, length));

      if (length > 0) {
        timer = window.setTimeout(erase, ERASE_DELAY);
      } else {
        next();
      }
    };

    const type = () => {
      length += 1;
      setTyped(current.slice(0, length));

      timer = window.setTimeout(
        length < current.length ? type : erase,
        length < current.length ? TYPE_DELAY : HOLD_DELAY
      );
    };

    setTyped('');
    timer = window.setTimeout(type, TYPE_DELAY);

    return () => window.clearTimeout(timer);
  }, [current, next]);

  if (questions.length === 0) return null;

  return (
    <div className={styles.ticker}>
      <div className={styles.labelRow}>
        <p className={styles.label}>{t('tickerLabel')}</p>
        <p className={styles.hint}>{t('tickerHint')}</p>
      </div>

      <p className={styles.question}>
        <span className="sr-only">{current}</span>

        <span className={styles.text} aria-hidden="true">
          {typed}
          <span className={styles.caret} />
        </span>
      </p>

      <div className={styles.footer}>
        <div className={styles.dots} role="presentation" aria-hidden="true">
          {questions.map((question, dotIndex) => (
            <span
              key={question}
              className={`${styles.dot} ${dotIndex === index ? styles.dotActive : ''}`}
            />
          ))}
        </div>

        <button type="button" className={styles.next} onClick={next}>
          <Shuffle size={14} strokeWidth={1.8} aria-hidden="true" />
          <span>{t('nextQuestion')}</span>
        </button>
      </div>
    </div>
  );
}