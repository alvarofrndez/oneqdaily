'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useTheme } from './theme-provider';
import styles from './theme-toggle.module.scss';

const options = [
  {
    value: 'light',
    icon: Sun,
  },
  {
    value: 'system',
    icon: Monitor,
  },
  {
    value: 'dark',
    icon: Moon,
  },
] as const;

export default function ThemeToggle() {
  const t = useTranslations('ThemeToggle');
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label={t('label')}
      className={styles.group}
    >
      {options.map(({ value, icon: Icon }) => {
        const active = theme === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-label={t(value)}
            aria-pressed={active}
            className={`${styles.option} ${
              active ? styles.active : ''
            }`}
          >
            <Icon
              size={15}
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}