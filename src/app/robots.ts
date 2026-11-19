import type { MetadataRoute } from 'next'
import { getSite } from '@/content/site'

export default function robots(): MetadataRoute.Robots {
  const site = getSite('en')

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}
