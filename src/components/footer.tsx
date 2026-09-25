import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Github } from 'lucide-react';
import styles from './footer.module.scss';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/src/features/auth/types';

interface FooterProps {
  user: User | null;
  profile?: Profile | null;
}

const X_URL = process.env.NEXT_PUBLIC_X_URL ?? 'https://x.com/oneqdaily';

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L0.9 2h7.4l5 6.7L18.9 2zm-1.3 18h2L6.5 4H4.4l13.2 16z" />
    </svg>
  );
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

  const socialLinks = [
    { href: X_URL, label: t('social.x'), icon: <XIcon /> }
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandBlock}>
          <span className={styles.logo}>{t('brand.name')}</span>
          <p className={styles.tagline}>{t('brand.tagline')}</p>

          <div className={styles.social} aria-label={t('social.label')}>
            {socialLinks.map((social) => (
              
              <a 
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
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
  )
}