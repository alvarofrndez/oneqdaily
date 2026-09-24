import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';

import { LOGO_ACCENT_COLOR } from '@/lib/logo';

import styles from './loader.module.scss';

type Props = {
  variant?: 'inline' | 'page' | 'screen';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
};

/**
 * Tu logo (logo.ts) rasterizado en una rejilla de 19×23 puntos.
 * . = punto de fondo · # = cuerpo del logo · @ = acento (naranja)
 *
 * Si cambias el logo, hay que regenerar esta matriz.
 */
const LOGO_GRID = [
  '...................',
  '.......@.####......',
  '......@@#######....',
  '.....#@@#...###....',
  '....##@@.....###...',
  '..####.@......##...',
  '.####.........##...',
  '..####........##...',
  '.....#.......##....',
  '.............##....',
  '............##.....',
  '............##.....',
  '............##.....',
  '............##.....',
  '............##.....',
  '.........#########.',
  '........##########.',
  '........##......##.',
  '.........##.....##.',
  '.........###...##..',
  '..........#######..',
  '............###....',
  '...................',
] as const;

const COLS = LOGO_GRID[0].length;
const CENTER_X = (COLS - 1) / 2;
const CENTER_Y = (LOGO_GRID.length - 1) / 2;

const DOTS = LOGO_GRID.flatMap((row, y) =>
  Array.from(row, (char, x) => ({
    key: `${x}-${y}`,
    kind: char === '@' ? 'accent' : char === '#' ? 'main' : 'bg',
    distance: Number(Math.hypot(x - CENTER_X, y - CENTER_Y).toFixed(2)),
  }))
);

export default function Loader({
  variant = 'inline',
  size = 'md',
  showLabel = false,
}: Props) {
  const t = useTranslations('Loader');

  return (
    <div
      role="status"
      aria-live="polite"
      className={`${styles.loader} ${styles[variant]} ${styles[size]}`}
      style={{ '--accent-color': LOGO_ACCENT_COLOR } as CSSProperties}
    >
      <div className={styles.grid} aria-hidden="true">
        {DOTS.map(({ key, kind, distance }) => (
          <span
            key={key}
            className={`${styles.dot} ${
              kind === 'main' ? styles.main : kind === 'accent' ? styles.accent : ''
            }`}
            style={{ '--distance': distance } as CSSProperties}
          />
        ))}
      </div>

      {showLabel ? (
        <span className={styles.label}>{t('loading')}</span>
      ) : (
        <span className={styles.srOnly}>{t('loading')}</span>
      )}
    </div>
  );
}