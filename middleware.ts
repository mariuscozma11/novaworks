
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Negotiator from 'negotiator';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import { i18n } from './lib/i18n';

function getLocale(request: NextRequest): string {
  // Get locale from cookie if it exists
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && i18n.locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // Get Accept-Language header
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator to get languages from Accept-Language header
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Match against supported locales
  try {
    return matchLocale(languages, i18n.locales, i18n.defaultLocale);
  } catch {
    return i18n.defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Store locale preference in cookie
    const response = NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
    response.cookies.set('NEXT_LOCALE', locale, { maxAge: 31536000 }); // 1 year
    return response;
  }

  // Extract locale from pathname
  const locale = pathname.split('/')[1];

  // Update cookie if locale in URL differs from cookie
  if (locale && i18n.locales.includes(locale as any)) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', locale, { maxAge: 31536000 });
    return response;
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc.)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};
