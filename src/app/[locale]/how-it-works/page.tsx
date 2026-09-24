import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

import styles from '@/src/styles/content-page.module.scss';

type Step = { title: string; description: string };
type TimelineItem = { time: string; title: string; description: string };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('HowItWorksPage.meta');
  return { title: t('title'), description: t('description') };
}

export default async function HowItWorksPage() {
  const t = await getTranslations('HowItWorksPage');

  const lifecycleSteps = t.raw('lifecycle.steps') as Step[];
  const answeringSteps = t.raw('answering.steps') as Step[];
  const timeline = t.raw('timeline.items') as TimelineItem[];
  const likesParagraphs = t.raw('likes.paragraphs') as string[];
  const archiveParagraphs = t.raw('archive.paragraphs') as string[];
  const accountsParagraphs = t.raw('accounts.paragraphs') as string[];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topNav}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={15} strokeWidth={1.8} aria-hidden="true" />
            <span>{t('backHome')}</span>
          </Link>
        </div>

        <section className={styles.hero}>
          <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
          <h1 className={styles.title}>{t('hero.title')}</h1>
          <p className={styles.subtitle}>{t('hero.subtitle')}</p>
        </section>

        <section className={styles.section} aria-labelledby="how-lifecycle-title">
          <h2 id="how-lifecycle-title" className={styles.sectionTitle}>
            {t('lifecycle.title')}
          </h2>
          <p className={styles.lead}>{t('lifecycle.lead')}</p>

          <ol className={styles.stepsGrid}>
            {lifecycleSteps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="how-timeline-title">
          <h2 id="how-timeline-title" className={styles.sectionTitle}>
            {t('timeline.title')}
          </h2>
          <p className={styles.lead}>{t('timeline.lead')}</p>

          <ol className={styles.timeline}>
            {timeline.map((item) => (
              <li key={item.time} className={styles.timelineItem}>
                <span className={styles.timelineTime}>{item.time}</span>
                <h3 className={styles.timelineTitle}>{item.title}</h3>
                <p className={styles.timelineDescription}>{item.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="how-answering-title">
          <h2 id="how-answering-title" className={styles.sectionTitle}>
            {t('answering.title')}
          </h2>
          <p className={styles.lead}>{t('answering.lead')}</p>

          <ol className={styles.stepsGrid}>
            {answeringSteps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="how-likes-title">
          <h2 id="how-likes-title" className={styles.sectionTitle}>
            {t('likes.title')}
          </h2>
          {likesParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="how-archive-title">
          <h2 id="how-archive-title" className={styles.sectionTitle}>
            {t('archive.title')}
          </h2>
          {archiveParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="how-accounts-title">
          <h2 id="how-accounts-title" className={styles.sectionTitle}>
            {t('accounts.title')}
          </h2>
          {accountsParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>{t('cta.title')}</h2>
          <p className={styles.ctaSubtitle}>{t('cta.subtitle')}</p>
          <Link href="/" className={styles.ctaButton}>
            {t('cta.button')}
          </Link>
        </section>
      </div>
    </main>
  );
}