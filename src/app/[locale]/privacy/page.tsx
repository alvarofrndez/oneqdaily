import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

import styles from '@/src/styles/content-page.module.scss';

type DataRow = { key: string; value: string };
type Clause = string;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Privacy.meta');
  return { title: t('title'), description: t('description') };
}

export default async function PrivacyPage() {
  const t = await getTranslations('Privacy');

  const dataCollected = t.raw('dataCollected.rows') as DataRow[];
  const usesList = t.raw('uses.items') as string[];
  const rightsList = t.raw('rights.items') as string[];
  const thirdPartiesList = t.raw('thirdParties.items') as string[];
  const changesParagraphs = t.raw('changes.paragraphs') as string[];

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
          <p className={styles.meta}>{t('hero.lastUpdated')}</p>
        </section>

        <section className={styles.section} aria-labelledby="privacy-intro-title">
          <h2 id="privacy-intro-title" className={styles.sectionTitle}>
            {t('intro.title')}
          </h2>
          <p className={styles.paragraph}>{t('intro.paragraph')}</p>
        </section>

        <section className={styles.section} aria-labelledby="privacy-data-title">
          <h2 id="privacy-data-title" className={styles.sectionTitle}>
            {t('dataCollected.title')}
          </h2>
          <p className={styles.lead}>{t('dataCollected.lead')}</p>

          <div className={styles.dataTable}>
            {dataCollected.map((row) => (
              <div key={row.key} className={styles.dataRow}>
                <span className={styles.dataKey}>{row.key}</span>
                <span className={styles.dataValue}>{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="privacy-uses-title">
          <h2 id="privacy-uses-title" className={styles.sectionTitle}>
            {t('uses.title')}
          </h2>
          <p className={styles.lead}>{t('uses.lead')}</p>
          <ul className={styles.bulletList}>
            {usesList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="privacy-visibility-title">
          <h2 id="privacy-visibility-title" className={styles.sectionTitle}>
            {t('visibility.title')}
          </h2>
          <p className={styles.paragraph}>{t('visibility.paragraph')}</p>
          <div className={styles.note}>{t('visibility.note')}</div>
        </section>

        <section className={styles.section} aria-labelledby="privacy-cookies-title">
          <h2 id="privacy-cookies-title" className={styles.sectionTitle}>
            {t('cookies.title')}
          </h2>
          <p className={styles.paragraph}>{t('cookies.paragraph')}</p>
        </section>

        <section className={styles.section} aria-labelledby="privacy-third-parties-title">
          <h2 id="privacy-third-parties-title" className={styles.sectionTitle}>
            {t('thirdParties.title')}
          </h2>
          <p className={styles.lead}>{t('thirdParties.lead')}</p>
          <ul className={styles.bulletList}>
            {thirdPartiesList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="privacy-retention-title">
          <h2 id="privacy-retention-title" className={styles.sectionTitle}>
            {t('retention.title')}
          </h2>
          <p className={styles.paragraph}>{t('retention.paragraph')}</p>
        </section>

        <section className={styles.section} aria-labelledby="privacy-rights-title">
          <h2 id="privacy-rights-title" className={styles.sectionTitle}>
            {t('rights.title')}
          </h2>
          <p className={styles.lead}>{t('rights.lead')}</p>
          <ul className={styles.bulletList}>
            {rightsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="privacy-minors-title">
          <h2 id="privacy-minors-title" className={styles.sectionTitle}>
            {t('minors.title')}
          </h2>
          <p className={styles.paragraph}>{t('minors.paragraph')}</p>
        </section>

        <section className={styles.section} aria-labelledby="privacy-changes-title">
          <h2 id="privacy-changes-title" className={styles.sectionTitle}>
            {t('changes.title')}
          </h2>
          {changesParagraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}
        </section>

        <section className={styles.section} aria-labelledby="privacy-contact-title">
          <h2 id="privacy-contact-title" className={styles.sectionTitle}>
            {t('contact.title')}
          </h2>
          <p className={styles.paragraph}>{t('contact.paragraph')}</p>
        </section>
      </div>
    </main>
  );
}