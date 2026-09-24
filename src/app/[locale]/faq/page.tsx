import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

import styles from '@/src/styles/content-page.module.scss';

type FaqItem = { question: string; answer: string };
type FaqCategory = { title: string; items: FaqItem[] };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('FaqPage.meta');
  return { title: t('title'), description: t('description') };
}

export default async function FaqPage() {
  const t = await getTranslations('FaqPage');
  const categories = t.raw('categories') as FaqCategory[];

  const allItems = categories.flatMap((category) => category.items);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allItems.map((item) => ({
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
        // eslint-disable-next-line react/no-danger
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
          <p className={styles.eyebrow}>{t('hero.eyebrow')}</p>
          <h1 className={styles.title}>{t('hero.title')}</h1>
          <p className={styles.subtitle}>{t('hero.subtitle')}</p>
        </section>

        {categories.map((category) => (
          <section
            key={category.title}
            className={styles.section}
            aria-labelledby={`faq-${category.title}`}
          >
            <div className={styles.faqGroup}>
              <h2 id={`faq-${category.title}`} className={styles.faqCategory}>
                {category.title}
              </h2>

              <div className={styles.faqList}>
                {category.items.map((item) => (
                  <details key={item.question} className={styles.faqItem}>
                    <summary className={styles.faqQuestion}>{item.question}</summary>
                    <p className={styles.faqAnswer}>{item.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        ))}

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