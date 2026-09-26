import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import DailyQuestion from '@/src/features/questions/components/DailyQuestion'
import styles from './page.module.scss'
import { buildMetadata } from '@/lib/seo/metadata';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld';
import { JsonLd } from '@/src/components/JsonLd';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Metadata');

  return buildMetadata({
    locale,
    path: '/',
    title: t('title'),
    description: t('description'),
    useAbsoluteTitle: true,
  });
}

export default function Home() {
  return (
    <div className={styles.container}>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <DailyQuestion />
    </div>
  );
}