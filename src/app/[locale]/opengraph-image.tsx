import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'
import { getSite } from '@/content/site'
import { isLocale, locales, type Locale } from '@/i18n/locales'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The two-word headline, echoing the one in Hero. "Marketer" stays an English
 * loanword in German and Spanish too, the same call as "MarTech" in
 * `site.ts`: it's shorter and more recognisable than a literal translation,
 * and it keeps the punchy two-word shape the headline depends on.
 */
const headline: Record<Locale, readonly [string, string]> = {
  en: ['Developer.', 'Marketer.'],
  de: ['Entwickler.', 'Marketer.'],
  es: ['Desarrollador.', 'Marketer.'],
}

const available: Record<Locale, string> = {
  en: 'Available',
  de: 'Verfügbar',
  es: 'Disponible',
}

const euCitizen: Record<Locale, string> = {
  en: 'EU citizen',
  de: 'EU-Bürger',
  es: 'Ciudadano UE',
}

/**
 * The card that renders when this link is pasted into LinkedIn, Slack or
 * WhatsApp, which, for a job search, is most of how it will actually be seen.
 *
 * Generated at build time, so it costs nothing at request time and works
 * identically under `output: 'export'`.
 */
export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale

  const site = getSite(locale)
  const { hiring } = site
  const [line1, line2] = headline[locale]

  // Read from disk and inline as a data URI: Satori has no network and no
  // notion of the site's own origin at build time, so a `/brand/...` path would
  // simply not resolve.
  const logo = await readFile(join(process.cwd(), 'public/brand/logo-96.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#ffffff',
        color: '#0a0a0a',
        padding: 72,
        // ImageResponse ships Noto Sans by default; naming the Helvetica
        // stack first keeps it consistent with the site where available.
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* Satori renders plain <img>; next/image has no meaning here. */}
        <img src={logoSrc} width={44} height={44} alt="" />
        <div style={{ fontSize: 26, color: '#8a8a8a' }}>{site.name}</div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: 92,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 1.02,
        }}
      >
        <div>{line1}</div>
        <div>{line2}</div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          fontSize: 26,
          color: '#8a8a8a',
        }}
      >
        {/* Single text nodes on purpose: Satori requires an explicit
                `display` on any element with more than one child, and JSX
                interpolation splits these into several text nodes. */}
        <div>{hiring.currentLocation.split(',')[0]}</div>
        <div style={{ color: '#d8d8d6' }}>|</div>
        <div>{available[locale]}</div>
        <div style={{ color: '#d8d8d6' }}>|</div>
        <div>{euCitizen[locale]}</div>
      </div>
    </div>,
    { ...size },
  )
}
