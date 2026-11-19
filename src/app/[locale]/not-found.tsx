'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { defaultLocale, isLocale, type Locale } from '@/i18n/locales'

/**
 * `not-found.js` accepts no props, not even in a dynamic segment: the thrown
 * `notFound()` unmounts before this segment's own `params` would resolve.
 * The documented way around that is a Client Component reading the locale
 * back out of the URL with `usePathname()`, so this is one rather than the
 * Server Component the rest of the tree favours.
 */
const copy: Record<Locale, { title: string; cta: string }> = {
  en: { title: "This page doesn't exist.", cta: 'Back home' },
  de: { title: 'Diese Seite existiert nicht.', cta: 'Zur Startseite' },
  es: { title: 'Esta página no existe.', cta: 'Volver al inicio' },
}

export default function LocaleNotFound() {
  const pathname = usePathname()
  const segment = pathname.split('/')[1] ?? ''
  const locale = isLocale(segment) ? segment : defaultLocale
  const t = copy[locale]

  return (
    <main className="px-edge flex min-h-svh flex-col justify-center">
      <p className="text-mute text-sm">404</p>
      <h1 className="mt-3 max-w-[14ch] text-[clamp(2.2rem,7vw,4.5rem)] leading-[1] font-semibold tracking-[-0.035em]">
        {t.title}
      </h1>
      <Link
        href={`/${locale}`}
        className="wipe-fill border-ink ease-brand hover:border-accent hover:text-on-accent mt-8 inline-block w-fit rounded-full border px-[22px] py-3 text-sm font-medium transition-colors duration-300"
      >
        {t.cta}
      </Link>
    </main>
  )
}
