import { getTranslations } from 'next-intl/server';

import DotFieldBackground from '@/src/features/launch/components/DotFieldBackground';
import QuestionTicker from '@/src/features/launch/components/QuestionTicker';
import LaunchCountdown from '@/src/features/launch/components/LaunchCountdown';

import styles from './page.module.scss';

function getLaunchTime(): number | null {
  const time = Date.parse(process.env.LAUNCH_DATE ?? '');
  return Number.isNaN(time) ? null : time;
}

export default async function LaunchPage() {
  const t = await getTranslations('Launch');
  const questions = t.raw('questions') as string[];

  return (
    <main className={styles.container}>
      <DotFieldBackground />

      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{t('eyebrow')}</p>
        </header>

        <h1 className={styles.title}>{t('title')}</h1>

        <p className={styles.description}>{t('description')}</p>

        <QuestionTicker questions={questions} />

        <LaunchCountdown target={getLaunchTime()} />

        <div className={styles.divider} />

        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span>{t('status')}</span>
        </div>
      </div>
    </main>
  );
}