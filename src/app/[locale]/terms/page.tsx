import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

import styles from '@/src/styles/content-page.module.scss';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Terms.meta');
  return { title: t('title'), description: t('description') };
}

export default async function TermsPage() {
  const t = await getTranslations('Terms');

  const acceptanceClauses = t.raw('acceptance.clauses') as string[];
  const accountClauses = t.raw('accounts.clauses') as string[];
  const contentClauses = t.raw('content.clauses') as string[];
  const prohibitedList = t.raw('content.prohibited') as string[];
  const terminationClauses = t.raw('termination.clauses') as string[];
  const liabilityClauses = t.raw('liability.clauses') as string[];

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

        <section className={styles.section} aria-labelledby="terms-acceptance-title">
          <h2 id="terms-acceptance-title" className={styles.sectionTitle}>
            {t('acceptance.title')}
          </h2>
          <ol className={styles.clauseList}>
            {acceptanceClauses.map((clause) => (
              <li key={clause} className={styles.clause}>
                {clause}
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="terms-service-title">
          <h2 id="terms-service-title" className={styles.sectionTitle}>
            {t('service.title')}
          </h2>
          <p className={styles.paragraph}>{t('service.paragraph')}</p>
        </section>

        <section className={styles.section} aria-labelledby="terms-accounts-title">
          <h2 id="terms-accounts-title" className={styles.sectionTitle}>
            {t('accounts.title')}
          </h2>
          <ol className={styles.clauseList}>
            {accountClauses.map((clause) => (
              <li key={clause} className={styles.clause}>
                {clause}
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="terms-content-title">
          <h2 id="terms-content-title" className={styles.sectionTitle}>
            {t('content.title')}
          </h2>
          <ol className={styles.clauseList}>
            {contentClauses.map((clause) => (
              <li key={clause} className={styles.clause}>
                {clause}
              </li>
            ))}
          </ol>

          <p className={styles.lead}>{t('content.prohibitedLead')}</p>
          <ul className={styles.bulletList}>
            {prohibitedList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="terms-visibility-title">
          <h2 id="terms-visibility-title" className={styles.sectionTitle}>
            {t('visibility.title')}
          </h2>
          <p className={styles.paragraph}>{t('visibility.paragraph')}</p>
        </section>

        <section className={styles.section} aria-labelledby="terms-ip-title">
          <h2 id="terms-ip-title" className={styles.sectionTitle}>
            {t('intellectualProperty.title')}
          </h2>
          <p className={styles.paragraph}>{t('intellectualProperty.paragraph')}</p>
        </section>

        <section className={styles.section} aria-labelledby="terms-termination-title">
          <h2 id="terms-termination-title" className={styles.sectionTitle}>
            {t('termination.title')}
          </h2>
          <ol className={styles.clauseList}>
            {terminationClauses.map((clause) => (
              <li key={clause} className={styles.clause}>
                {clause}
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="terms-liability-title">
          <h2 id="terms-liability-title" className={styles.sectionTitle}>
            {t('liability.title')}
          </h2>
          <ol className={styles.clauseList}>
            {liabilityClauses.map((clause) => (
              <li key={clause} className={styles.clause}>
                {clause}
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section} aria-labelledby="terms-law-title">
          <h2 id="terms-law-title" className={styles.sectionTitle}>
            {t('governingLaw.title')}
          </h2>
          <p className={styles.paragraph}>{t('governingLaw.paragraph')}</p>
        </section>

        <section className={styles.section} aria-labelledby="terms-changes-title">
          <h2 id="terms-changes-title" className={styles.sectionTitle}>
            {t('changes.title')}
          </h2>
          <p className={styles.paragraph}>{t('changes.paragraph')}</p>
        </section>

        <section className={styles.section} aria-labelledby="terms-contact-title">
          <h2 id="terms-contact-title" className={styles.sectionTitle}>
            {t('contact.title')}
          </h2>
          <p className={styles.paragraph}>{t('contact.paragraph')}</p>
        </section>
      </div>
    </main>
  );
}