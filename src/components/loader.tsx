import { useTranslations } from 'next-intl';
import styles from './loader.module.scss';

type Props = {
  variant?: 'inline' | 'page' | 'screen';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  glyph?: string;
};

export default function Loader({
  variant = 'inline',
  size = 'md',
  showLabel = false,
  glyph = '?',
}: Props) {
  const t = useTranslations('Loader');

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${styles.loader} ${styles[variant]} ${styles[size]}`}
    >
      <span aria-hidden className={styles.glyph}>
        {glyph}
        <span className={styles.fill}>{glyph}</span>
      </span>

      {showLabel ? (
        <span className={styles.label}>{t('loading')}</span>
      ) : (
        <span className="sr-only">{t('loading')}</span>
      )}
    </div>
  );
}