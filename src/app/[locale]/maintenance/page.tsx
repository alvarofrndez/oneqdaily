import { getTranslations } from 'next-intl/server';
import styles from './page.module.scss';

export default async function MaintenancePage() {
  const t = await getTranslations('Maintenance');

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>
          {t('eyebrow')}
        </p>

        <h1 className={styles.title}>
          {t('title')}
        </h1>

        <p className={styles.description}>
          {t('description')}
        </p>

        <div className={styles.divider} />

        <p className={styles.status}>
          <span className={styles.statusDot} />
          {t('status')}
        </p>
      </div>
    </section>
  );
}