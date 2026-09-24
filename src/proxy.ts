import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

import { routing } from '@/i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { SITE_MODE } from '@/config/site';

const intlMiddleware = createMiddleware(routing);

function getLocaleFromPathname(pathname: string) {
  return (
    routing.locales.find(
      (locale) =>
        pathname === `/${locale}` ||
        pathname.startsWith(`/${locale}/`)
    ) ?? routing.defaultLocale
  );
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SITE_MODE === 'launch' || SITE_MODE === 'maintenance') {
    const locale = getLocaleFromPathname(pathname);

    const targetPath =
      SITE_MODE === 'launch'
        ? `/${locale}/launch`
        : `/${locale}/maintenance`;

    const isTargetPage =
      pathname === targetPath ||
      pathname === `${targetPath}/`;

    if (!isTargetPage) {
      const url = request.nextUrl.clone();
      url.pathname = targetPath;

      return NextResponse.rewrite(url);
    }
  }

  const response = intlMiddleware(request);

  return updateSession(request, response);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|auth|.*\\..*).*)',
};