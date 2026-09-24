'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Lock } from 'lucide-react';

import styles from './LaunchCountdown.module.scss';

type Props = {
  /** Timestamp (ms) del lanzamiento. Si es null, no se renderiza nada. */
  target: number | null;
};

const UNITS = ['days', 'hours', 'minutes', 'seconds'] as const;

function splitTime(milliseconds: number) {
  const total = Math.floor(milliseconds / 1000);

  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export default function LaunchCountdown({ target }: Props) {
  const t = useTranslations('Launch.countdown');

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (target === null) return null;

  const remaining = now === null ? null : Math.max(0, target - now);

  if (remaining === 0) {
    return <p className={styles.done}>{t('done')}</p>;
  }

  const parts = remaining === null ? null : splitTime(remaining);

  return (
    <div className={styles.countdown}>
      <p className={styles.label}>
        <span>{t('label')}</span>
      </p>

      <div className={styles.units} role="timer" aria-live="off">
        {UNITS.map((unit) => {
          const value = parts ? String(parts[unit]).padStart(2, '0') : '--';

          return (
            <div key={unit} className={styles.unit}>
              <span key={value} className={styles.value}>
                {value}
              </span>
              <span className={styles.unitLabel}>{t(unit)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}