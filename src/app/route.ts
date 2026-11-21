import { type NextRequest } from 'next/server'
import { defaultLocale, isLocale, type Locale } from '@/i18n/locales'

/**
 * `/` redirects to a locale-prefixed URL, decided from the browser's own
 * `Accept-Language` header.
 *
 * Browser language rather than IP geolocation, on purpose: it needs no
 * third-party service, and a browser set to German is a far more direct
 * signal of "show this person German" than a guess from which country an IP
 * range happens to be registered to. No cookie, no stored preference: the
 * language switcher in the header is the one source of truth once a visitor
 * has picked a locale, and its choice lives in the URL that results.
 *
 * A route handler rather than a proxy (middleware): `/` is the only path that
 * needs deciding, every other one is already locale-prefixed by the time a
 * link points at it, and a plain route runs on any host without the
 * middleware support that some adapters still treat as experimental.
 */
export const dynamic = 'force-dynamic'

function localeFromHeader(header: string | null): Locale {
  if (!header) return defaultLocale

  // "de-CH,de;q=0.9,en;q=0.8" → ["de", "de", "en"], in preference order.
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

export function GET(request: NextRequest) {
  const locale = localeFromHeader(request.headers.get('accept-language'))

  // The trailing slash matches `trailingSlash: true` in next.config.ts, so the
  // visitor lands on the page in one hop rather than two.
  return new Response(null, {
    status: 307,
    headers: {
      Location: new URL(`/${locale}/`, request.url).toString(),
      // The answer depends on the header, so no cache may hand one visitor's
      // language to the next.
      Vary: 'Accept-Language',
      'Cache-Control': 'private, no-store',
    },
  })
}
