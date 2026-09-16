import { NextRequest } from 'next/server'
import { createMiddleware } from 'next-intl/middleware'

export default function middleware(req: NextRequest) {
  return createMiddleware({
    locales: ['en'],
    defaultLocale: 'en',
  })(req)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\.png).*)'],
}