'use client';

import { useContext, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { UserContext, ProfileContext } from './providers';
import { signOut } from '@/src/features/auth/actions';
import ThemeToggle from './theme-toggle';
import styles from './user-menu.module.scss';

export default function UserMenu() {
  const t = useTranslations('UserMenu');
  const user = useContext(UserContext);
  const profile = useContext(ProfileContext);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  if (!user) {
    return (
      <div className={styles.auth}>
        <ThemeToggle />
        <Link href="/login" className={styles.login}>{t('login')}</Link>
        <Link href="/signup" className={styles.signup}>{t('signup')}</Link>
      </div>
    );
  }

  const displayName = profile?.username || user.email;

  return (
    <div ref={containerRef} className={styles.menu}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={styles.trigger}
      >
        {displayName}
      </button>

      {open && (
        <div id={panelId} className={styles.panel}>
          <span className={styles.email}>{user.email}</span>
          <div role="separator" className={styles.divider} />

          <Link href="/profile" className={styles.item} onClick={() => setOpen(false)}>
            {t('profile')}
          </Link>
          <Link href="/questions/answered" className={styles.item} onClick={() => setOpen(false)}>
            {t('answeredQuestions')}
          </Link>

          <div role="separator" className={styles.divider} />
          <div className={styles.themeRow}>
            <span className={styles.themeLabel}>{t('theme')}</span>
            <ThemeToggle />
          </div>

          <div role="separator" className={styles.divider} />
          <form action={signOut}>
            <button type="submit" className={styles.item}>
              {t('logout')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}