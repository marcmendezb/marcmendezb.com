import type { Locale } from '@/i18n/locales'

/**
 * Builds a tool list's accessible name from a discipline or project name,
 * e.g. "Marketing toolkit". Spanish takes "tools of X" rather than a literal
 * "X toolkit", which doesn't read naturally; German glues the English
 * loanword on with a hyphen, the way Swiss and German tech writing actually
 * does it.
 *
 * Lives outside `tool-pills.tsx` on purpose: that file is `'use client'`, and
 * a Server Component (`disciplines.tsx`, `work.tsx`) can't call a function
 * exported from a client module, only render it.
 */
export function toolkitLabel(name: string, locale: Locale): string {
  switch (locale) {
    case 'de':
      return `${name}-Toolkit`
    case 'es':
      return `Herramientas de ${name}`
    default:
      return `${name} toolkit`
  }
}
