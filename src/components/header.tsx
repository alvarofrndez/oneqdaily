import Link from 'next/link';
import { useTranslations } from 'next-intl';
import UserMenu from './user-menu';
import styles from './header.module.scss'

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/" className={styles.logo}>logo</Link>
      </div>
      <div className={styles.actions}>
        <div className={styles.routes}>
          <Link href="/questions" className={styles.route}>
            {t('questions')}
          </Link>
        </div>
        <div className={styles.menu}>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}