'use client';

import {Moon, Sun} from 'lucide-react';
import {useTheme} from './theme-provider';

export default function ThemeToggle() {
  const {theme, setTheme} = useTheme();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-label="Use light theme"
        className={`rounded-md p-2 ${
          theme === 'light'
            ? 'bg-gray-200 dark:bg-gray-700'
            : ''
        }`}
      >
        <Sun size={18} />
      </button>

      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-label="Use dark theme"
        className={`rounded-md p-2 ${
          theme === 'dark'
            ? 'bg-gray-200 dark:bg-gray-700'
            : ''
        }`}
      >
        <Moon size={18} />
      </button>
    </div>
  );
}