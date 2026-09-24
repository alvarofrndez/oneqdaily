import Link from 'next/link';
import { MessageCircleQuestion } from 'lucide-react';
import { useTranslations } from 'next-intl';

import UserMenu from './user-menu';
import styles from './header.module.scss';

export default function Header() {
  const t = useTranslations('Header');

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/" className={styles.logo} aria-label="Home">
          logo
        </Link>
      </div>

      <div className={styles.actions}>
        <nav className={styles.navigation} aria-label="Main navigation">
          <Link href="/questions" className={styles.route}>
            <span className={styles.routeLabel}>
              {t('questions')}
            </span>
          </Link>
        </nav>

        <div className={styles.menu}>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}