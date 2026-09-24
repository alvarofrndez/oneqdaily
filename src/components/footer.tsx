import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './footer.module.scss';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/src/features/auth/types';

interface FooterProps {
  user: User | null;
  profile?: Profile | null;
}

export default function Footer({ user, profile }: FooterProps) {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();
  
  const isAuthenticated = !!user;

  const columns = [
    {
      title: t('columns.product.title'),
      links: [
        { href: '/', label: t('columns.product.home') },
        { href: '/questions', label: t('columns.product.questions') },
        { href: '/questions/answered', label: t('columns.product.answered'), isPrivate: true },
      ],
    },
    {
      title: t('columns.company.title'),
      links: [
        { href: '/about', label: t('columns.company.about') },
        { href: '/how-it-works', label: t('columns.company.howItWorks') },
        { href: '/faq', label: t('columns.company.faq') },
      ],
    },
    {
      title: t('columns.legal.title'),
      links: [
        { href: '/privacy', label: t('columns.legal.privacy') },
        { href: '/terms', label: t('columns.legal.terms') },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandBlock}>
          <span className={styles.logo}>{t('brand.name')}</span>
          <p className={styles.tagline}>{t('brand.tagline')}</p>
        </div>

        <nav className={styles.columns} aria-label={t('navigationLabel')}>
          {columns.map((column) => (
            <div key={column.title} className={styles.column}>
              <h3 className={styles.columnTitle}>{column.title}</h3>
              <ul className={styles.columnList}>
                {column.links.map((link) => {
                  
                  if (link.isPrivate && !isAuthenticated) {
                    return null;
                  }

                  return (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.columnLink}>
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          {t('copyright', { year })}
        </p>
      </div>
    </footer>
  );
}