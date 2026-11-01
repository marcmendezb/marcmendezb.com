import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { site } from '@/content/site'

export const alt = `${site.name} | ${site.role}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * The card that renders when this link is pasted into LinkedIn, Slack or
 * WhatsApp — which, for a job search, is most of how it will actually be seen.
 *
 * Generated at build time, so it costs nothing at request time and works
 * identically under `output: 'export'`.
 */
export default async function OpenGraphImage() {
  const { hiring } = site

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
        <div>Marketer</div>
        <div>who builds</div>
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
        <div>{`${hiring.currentLocation.split(',')[0]} → ${hiring.targetLocation.split(',')[0]}`}</div>
        <div style={{ color: '#d8d8d6' }}>|</div>
        <div>Available</div>
        <div style={{ color: '#d8d8d6' }}>|</div>
        <div>EU citizen</div>
      </div>
    </div>,
    { ...size },
  )
}
