import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import DotFieldBackground from '@/src/features/launch/components/DotFieldBackground';
import QuestionTicker from '@/src/features/launch/components/QuestionTicker';
import LaunchCountdown from '@/src/features/launch/components/LaunchCountdown';
import WaitlistForm from '@/src/features/launch/components/WaitlistForm';
import SocialActions from '@/src/features/launch/components/SocialActions';
import { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME, X_HANDLE } from '@/lib/seo/config';
import styles from './page.module.scss';


function getLaunchTime(): number | null {
  const time = Date.parse(process.env.LAUNCH_DATE ?? '');
  return Number.isNaN(time) ? null : time;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Launch.meta');
  const title = t('title');
  const description = t('description');

  return {
    title,
    description,
    alternates: { canonical: SITE_URL },
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: 'website',
      images: [{ url: DEFAULT_OG_IMAGE, width: 512, height: 512 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: X_HANDLE,
      images: [DEFAULT_OG_IMAGE],
    },
  };
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

        <p className={styles.tagline}>{t('tagline')}</p>

        <p className={styles.description}>{t('description')}</p>

        <LaunchCountdown target={getLaunchTime()} />

        <WaitlistForm />

        <QuestionTicker questions={questions} />

        <SocialActions />

        <div className={styles.divider} />

        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span>{t('status')}</span>
        </div>
      </div>
    </main>
  );
}