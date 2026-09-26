import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

import styles from '@/src/styles/content-page.module.scss';
import { buildMetadata } from '@/lib/seo/metadata';
import { faqPageJsonLd, webPageJsonLd } from '@/lib/seo/json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/breadcrumb-data';
import { SITE_URL } from '@/lib/seo/config';
import { JsonLd } from '@/src/components/JsonLd';

type FaqItem = { question: string; answer: string };
type FaqCategory = { title: string; items: FaqItem[] };

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('FaqPage.meta');

  return buildMetadata({
    locale,
    path: '/faq',
    title: t('title'),
    description: t('description'),
  });
}

export default async function FaqPage() {
  const locale = await getLocale();
  const t = await getTranslations('FaqPage');
  const tMeta = await getTranslations('FaqPage.meta');

  const webPage = webPageJsonLd({
    name: tMeta('title'),
    description: tMeta('description'),
    url: `${SITE_URL}/${locale}/faq`,
  });

  const breadcrumbs = await buildBreadcrumbJsonLd(locale, '/faq');

  const categories = t.raw('categories') as FaqCategory[];

  const allItems = categories.flatMap((category) => category.items);

  const faqJsonLd = faqPageJsonLd(allItems);

  return (
    <main className={styles.page}>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={webPage} />
      <JsonLd data={breadcrumbs} />

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