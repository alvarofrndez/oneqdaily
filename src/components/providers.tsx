'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from './theme-provider';
import { ServerClockProvider } from './server-clock';
import { createContext } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/src/features/auth/types';

export const UserContext = createContext<User | null>(null);
export const ProfileContext = createContext<Profile | null>(null);

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
  user: User | null;
  profile: Profile | null;
  serverNow: number;
};

export default function Providers({ children, locale, messages, user, profile, serverNow }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ServerClockProvider serverNow={serverNow}>
        <ThemeProvider>
          <UserContext.Provider value={user}>
            <ProfileContext.Provider value={profile}>
              {children}
            </ProfileContext.Provider>
          </UserContext.Provider>
        </ThemeProvider>
      </ServerClockProvider>
    </NextIntlClientProvider>
  );
}