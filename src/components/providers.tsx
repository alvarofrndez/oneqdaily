'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from './theme-provider';
import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';

export const UserContext = createContext<User | null>(null);

type ProvidersProps = {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, unknown>;
  user: User | null;
};

export default function Providers({
  children,
  locale,
  messages,
  user,
}: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <UserContext.Provider value={user}>
          {children}
        </UserContext.Provider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}