import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { defaultLocale, isLocale, type Locale } from '@/i18n/locales'

/**
 * Redirects `/` to a locale-prefixed URL, decided from the browser's own
 * `Accept-Language` header.
 *
 * Browser language rather than IP geolocation, on purpose: it needs no
 * third-party service, costs nothing at the edge, and a browser set to
 * German is a far more direct signal of "show this person German" than a
 * guess from which country an IP range happens to be registered to. No
 * cookie, no stored preference: the language switcher in the header is the
 * one source of truth once a visitor has picked a locale, and its choice
 * lives in the URL that results, not in state this file would have to agree
 * with.
 *
 * Only `/` is matched. Every other path is already locale-prefixed by the
 * time a link points at it, so there's nothing left for this to decide.
 */
function localeFromHeader(header: string | null): Locale {
  if (!header) return defaultLocale

  // "de-CH,de;q=0.9,en;q=0.8" → ["de-ch", "de", "en"], in preference order.
  // Only the primary subtag before any "-" is compared: a browser set to
  // "de-CH" should match "de" the same way one set to plain "de" does.
  const tags = header
    .split(',')
    .map((part) => part.split(';')[0]?.trim().toLowerCase().split('-')[0])

  for (const tag of tags) {
    if (tag && isLocale(tag)) return tag
  }

  return defaultLocale
}

export function proxy(request: NextRequest) {
  const locale = localeFromHeader(request.headers.get('accept-language'))
  const url = request.nextUrl.clone()
  // The trailing slash matches `trailingSlash: true` in next.config.ts. Redirecting
  // to `/${locale}` without it would just earn a second, needless redirect from
  // that same config on the next request.
  url.pathname = `/${locale}/`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: '/',
}
