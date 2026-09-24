'use client';

import {
  ChevronDown,
  LogIn,
  LogOut,
  Monitor,
  Palette,
  UserPlus,
  UserRound,
} from 'lucide-react';
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
  const [themeOpen, setThemeOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const themeMenuRef = useRef<HTMLDivElement>(null);
  const themeTriggerRef = useRef<HTMLButtonElement>(null);

  const panelId = useId();
  const themePanelId = useId();

  useEffect(() => {
    if (!open && !themeOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        open &&
        !containerRef.current?.contains(target)
      ) {
        setOpen(false);
      }

      if (
        themeOpen &&
        !themeMenuRef.current?.contains(target)
      ) {
        setThemeOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (open) {
        setOpen(false);
        triggerRef.current?.focus();
      }

      if (themeOpen) {
        setThemeOpen(false);
        themeTriggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, themeOpen]);

  if (!user) {
    return (
      <div className={styles.auth}>
        <div
          ref={themeMenuRef}
          className={styles.themeMenu}
        >
          <button
            ref={themeTriggerRef}
            type="button"
            className={styles.themeTrigger}
            aria-label={t('theme')}
            aria-haspopup="dialog"
            aria-expanded={themeOpen}
            aria-controls={themePanelId}
            onClick={() => setThemeOpen((value) => !value)}
          >
            <Palette
              size={17}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>

          {themeOpen && (
            <div
              id={themePanelId}
              className={styles.themePanel}
              role="dialog"
              aria-label={t('theme')}
            >
              <ThemeToggle />
            </div>
          )}
        </div>

        <Link
          href="/login"
          className={styles.login}
        >
          <LogIn
            size={16}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <span>{t('login')}</span>
        </Link>

        <Link
          href="/signup"
          className={styles.signup}
        >
          <UserPlus
            size={16}
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <span>{t('signup')}</span>
        </Link>
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
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        className={styles.trigger}
      >
        <span className={styles.avatar}>
          <UserRound
            size={15}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </span>

        <span className={styles.triggerName}>
          {displayName}
        </span>

        <ChevronDown
          size={15}
          strokeWidth={2}
          aria-hidden="true"
          className={styles.chevron}
        />
      </button>

      {open && (
        <div
          id={panelId}
          className={styles.panel}
          role="menu"
        >
          <div className={styles.account}>
            <div className={styles.accountInfo}>
              <span className={styles.accountName}>
                {displayName}
              </span>

              <span className={styles.email}>
                {user.email}
              </span>
            </div>
          </div>

          <div role="separator" className={styles.divider} />

          <Link
            href="/profile"
            className={styles.item}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span>{t('profile')}</span>
          </Link>

          <Link
            href="/questions/answered"
            className={styles.item}
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            <span>{t('answeredQuestions')}</span>
          </Link>

          <div role="separator" className={styles.divider} />

          <div className={styles.themeRow}>
            <div className={styles.themeLabel}>
              <span>{t('theme')}</span>
            </div>

            <ThemeToggle />
          </div>

          <div role="separator" className={styles.divider} />

          <form action={signOut} onSubmit={() => setOpen(false)}>
            <button
              type="submit"
              className={`${styles.item} ${styles.logout}`}
            >
              <span>{t('logout')}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}