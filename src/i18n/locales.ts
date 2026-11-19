/**
 * The three locales this site ships, and nothing locale-specific beyond the
 * list itself — components read `Locale` as a plain union, not as an object
 * they import from here.
 */
export const locales = ['en', 'de', 'es'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value)

/** `<html lang>` and the OG/JSON-LD locale tag, not a display label. */
export const localeTag: Record<Locale, string> = {
  en: 'en',
  de: 'de-CH',
  es: 'es',
}

/** What the switcher shows for each option, always in that language itself. */
export const localeLabel: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
}
