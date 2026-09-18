'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { UserContext, ProfileContext } from './providers';
import { signOut } from '@/src/features/auth/actions';
import ThemeToggle from './theme-toggle';

export default function UserMenu() {
  const t = useTranslations('UserMenu');
  const user = useContext(UserContext);
  const profile = useContext(ProfileContext);
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <ThemeToggle />
        <Link href="/login" className="hover:underline">{t('login')}</Link>
        <Link href="/signup" className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700">
          {t('signup')}
        </Link>
      </div>
    );
  }

  const displayName = profile?.username || user.email;

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="text-sm font-medium">
        {displayName}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-md border bg-white shadow-lg dark:bg-gray-800 z-10">
          <ThemeToggle />
          <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}>
            {t('profile')}
          </Link>
          <Link href="/questions/answered" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setOpen(false)}>
            {t('answeredQuestions')}
          </Link>
          <form action={signOut}>
            <button type="submit" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
              {t('logout')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}