'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Share2, Check } from 'lucide-react';

import styles from './SocialActions.module.scss';

const X_URL = process.env.NEXT_PUBLIC_X_URL ?? 'https://x.com/oneqdaily';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oneqdaily.com';

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L0.9 2h7.4l5 6.7L18.9 2zm-1.3 18h2L6.5 4H4.4l13.2 16z" />
    </svg>
  );
}

export default function SocialActions() {
  const t = useTranslations('Launch.social');
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = { title: 'One question daily', text: t('shareText'), url: SITE_URL };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Cancelado por el usuario, no hacemos nada.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(SITE_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard no disponible.
    }
  };

  return (
    <div className={styles.social}>
      <a href={X_URL} target="_blank" rel="noopener noreferrer" className={styles.follow}>
        <XIcon />
        <span>{t('follow')}</span>
      </a>

      <button type="button" onClick={handleShare} className={styles.share}>
        {copied ? (
          <Check size={14} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Share2 size={14} strokeWidth={1.8} aria-hidden="true" />
        )}
        <span>{copied ? t('copied') : t('shareLabel')}</span>
      </button>
    </div>
  );
}