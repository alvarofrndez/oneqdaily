import type {Metadata} from 'next';
import { DM_Sans, Fraunces, DM_Mono } from 'next/font/google';
import '@/src/styles/globals.css';
import '@/components/editor/style.css';
import styles from './layout.module.scss'
import {getLocale, getMessages, getTranslations} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import Providers from '@/src/components/providers';
import Header from '@/src/components/header';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getProfile } from '@/src/features/auth/queries';
import { SITE_MODE } from '@/config/site';
import Footer from '@/src/components/footer';
import { NextIntlClientProvider } from 'next-intl';
import Breadcrumbs from '@/src/components/breadcrumbs';
import { Analytics } from "@vercel/analytics/next"

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

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  if (SITE_MODE !== 'live') {
    return (
        <html
            lang={locale}
            suppressHydrationWarning
            className={`${dmSans.variable} ${fraunces.variable} ${dmMono.variable} h-full antialiased`}
        >
            <head>
                <link
                    rel="icon"
                    href="/logo-light.svg"
                    type="image/svg+xml"
                />
            </head>

            <body>
              <NextIntlClientProvider locale={locale} messages={messages}>
                {children}
              </NextIntlClientProvider>
              <Analytics />
            </body>
        </html>
    );
  }


  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = user ? await getProfile(user.id) : null;
  const serverNow = Date.now();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${dmSans.variable} ${fraunces.variable} ${dmMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="icon"
          href="/logo-light.svg"
          type="image/svg+xml"
        />
      </head>

      <body>
        <Providers
          messages={messages}
          locale={locale}
          user={user}
          profile={profile}
          serverNow={serverNow}
        >
          <div className={styles.container}>
            <Header />
            <Breadcrumbs />

            <main className={styles.main}>
              {children}
            </main>
            <Footer user={user} profile={profile} />
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}