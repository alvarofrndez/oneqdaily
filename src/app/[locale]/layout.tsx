import type {Metadata} from 'next';
import { DM_Sans, Fraunces, DM_Mono } from 'next/font/google';
import '@/src/components/editor/style.css';
import '@/src/styles/globals.css';
import styles from './layout.module.scss'
import {getLocale, getMessages, getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import Providers from '@/src/components/providers';
import Header from '@/src/components/header';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getProfile } from '@/src/features/auth/queries';

const dmSans = DM_Sans({ variable: '--font-sans', subsets: ['latin'], });
const fraunces = Fraunces({ variable: '--font-heading', subsets: ['latin'], });
const dmMono = DM_Mono({ variable: '--font-mono', subsets: ['latin'], weight: ['400', '500'], });

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata');
  return {
    title: t('title'),
    description: t('description'),
  };
}

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
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${dmSans.variable} ${fraunces.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body>
        <Providers messages={messages} locale={locale} user={user} profile={profile}>
          <div className={styles.container}>
            <Header />
            <main className={styles.main}>
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}