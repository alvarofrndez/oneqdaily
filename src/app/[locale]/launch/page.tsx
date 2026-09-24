import { getTranslations } from 'next-intl/server';

import styles from './page.module.scss';
import Image from 'next/image';

export default async function LaunchPage() {
  const t = await getTranslations('Launch');

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            {t('eyebrow')}
          </p>
        </header>
       

        <h1 className={styles.title}>
          {t('title')}
        </h1>

        <p className={styles.description}>
          {t('description')}
        </p>

        <div className={styles.divider} />

        <div className={styles.status}>
          <span className={styles.statusDot} />

          <span>
            {t('status')}
          </span>
        </div>
      </div>
    </main>
  );
}