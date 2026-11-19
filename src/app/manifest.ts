import type { MetadataRoute } from 'next'
import { getSite } from '@/content/site'

/**
 * One manifest for the whole origin, not one per locale: a PWA install
 * prompt is a property of the site, not of a path, and `manifest.(js|ts)`
 * must live at the app root to be picked up at all. English, to match
 * `reportPlaceholders()`'s own English-only check.
 */
export default function manifest(): MetadataRoute.Manifest {
  const site = getSite('en')

  return {
    name: `${site.name} | ${site.role}`,
    short_name: site.name,
    description: site.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2438e0',
    icons: [
      {
        // Points at the copy in `public/` rather than at the `app/icon.png`
        // route, whose URL carries a build hash that this file can't know.
        src: '/brand/icon-256.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
  }
}
