import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import {
  ArrowLeft,
} from 'lucide-react';

import { getAllQuestions } from '@/src/features/questions/queries';

import styles from './page.module.scss';

type Step = { title: string; description: string };
type Feature = { title: string; description: string };
type FaqItem = { question: string; answer: string };


export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('About.meta');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage() {
  const t = await getTranslations('About');

  const questions = await getAllQuestions();
  const totalQuestions = questions.length;

  const introParagraphs = t.raw('intro.paragraphs') as string[];
  const steps = t.raw('howItWorks.steps') as Step[];
  const philosophyParagraphs = t.raw('philosophy.paragraphs') as string[];
  const privacyParagraphs = t.raw('privacy.paragraphs') as string[];
  const features = t.raw('features.items') as Feature[];
  const communityParagraphs = t.raw('community.paragraphs') as string[];
  const faqItems = t.raw('faq.items') as FaqItem[];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className={styles.container}>
        <div className={styles.topNav}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={15} strokeWidth={1.8} aria-hidden="true" />
            <span>{t('backHome')}</span>
          </Link>
        </div>

        <section className={styles.hero}>
          <h1 className={styles.title}>{t('hero.title')}</h1>
          <p className={styles.subtitle}>{t('hero.subtitle')}</p>

          <div className={styles.heroActions}>
            <Link href="/" className={styles.ctaPrimary}>
              {t('hero.ctaPrimary')}
            </Link>
            <Link href="/questions" className={styles.ctaSecondary}>
              {t('hero.ctaSecondary')}
            </Link>
          </div>

          {totalQuestions > 0 && (
            <p className={styles.stat}>
              {t('hero.stat', { count: totalQuestions })}
            </p>
          )}
        </section>

        <section className={styles.section} aria-labelledby="about-intro-title">
          <h2 id="about-intro-title" className={styles.sectionTitle}>
            {t('intro.title')}
          </h2>
          {introParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        {/* Cómo funciona */}
        <section className={styles.section} aria-labelledby="about-how-title">
          <h2 id="about-how-title" className={styles.sectionTitle}>
            {t('howItWorks.title')}
          </h2>
          <p className={styles.lead}>{t('howItWorks.lead')}</p>

          <ol className={styles.stepsGrid}>
            {steps.map((step, index) => (
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

        {/* Filosofía */}
        <section className={styles.section} aria-labelledby="about-philosophy-title">
          <h2 id="about-philosophy-title" className={styles.sectionTitle}>
            {t('philosophy.title')}
          </h2>
          {philosophyParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="about-privacy-title">
          <h2 id="about-privacy-title" className={styles.sectionTitle}>
            {t('privacy.title')}
          </h2>
          {privacyParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="about-features-title">
          <h2 id="about-features-title" className={styles.sectionTitle}>
            {t('features.title')}
          </h2>

          <ul className={styles.featuresGrid}>
            {features.map((feature, index) => {

              return (
                <li key={feature.title} className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="about-community-title">
          <h2 id="about-community-title" className={styles.sectionTitle}>
            {t('community.title')}
          </h2>
          {communityParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="about-faq-title">
          <h2 id="about-faq-title" className={styles.sectionTitle}>
            {t('faq.title')}
          </h2>

          <div className={styles.faqList}>
            {faqItems.map((item) => (
              <details key={item.question} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>
                  {item.question}
                </summary>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </details>
            ))}
          </div>
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