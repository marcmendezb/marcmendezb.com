import type { MetadataRoute } from 'next'
import { getSite } from '@/content/site'
import { locales, localeTag } from '@/i18n/locales'

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite('en')

  // Trailing slash on every URL, matching `trailingSlash: true` in
  // next.config.ts: the canonical form the server actually serves at 200,
  // not the one that costs a crawler a 308 first.
  const languages = Object.fromEntries(
    locales.map((locale) => [localeTag[locale], `${site.url}/${locale}/`]),
  )

  return locales.map((locale) => ({
    url: `${site.url}/${locale}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
    alternates: { languages },
  }))
}
