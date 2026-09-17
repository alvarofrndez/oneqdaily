// src/app/[locale]/layout.tsx
import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import '../globals.css';
import {getLocale, getMessages} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import Providers from '@/src/components/providers';
import Header from '@/src/components/header';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getProfile } from '@/src/features/auth/queries';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Daily Questions',
  description: 'A simple minimalist web app for daily questions',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const profile = user ? await getProfile(user.id) : null;

  return (
    <html lang={locale} suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers messages={messages} locale={locale} user={user} profile={profile}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}