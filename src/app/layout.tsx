import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { site } from '@/content/site'
import { reportPlaceholders } from '@/lib/config-check'
import {
  buildPersonSchema,
  buildWebSiteSchema,
  buildWorkSchema,
  serialiseSchema,
} from '@/lib/structured-data'
import './globals.css'

/**
 * Inter, self-hosted by next/font — no request to Google, no layout shift.
 * Exposed as a CSS variable that globals.css folds into `--font-sans`, ahead of
 * the Helvetica fallback stack.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const title = `${site.name} | ${site.role}`

export const metadata: Metadata = {
  // Makes every relative URL below (OG images, canonical) absolute.
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  keywords: [
    'fullstack developer',
    'frontend developer',
    'product designer',
    'React developer Zürich',
    'Next.js developer Switzerland',
    'web developer Zürich',
    site.name,
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'profile',
    locale: 'en_GB',
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    firstName: 'Marc',
    lastName: 'Mendez',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Matches the one surface in globals.css so the browser chrome on mobile
  // blends into the page instead of banding against it. A single value, with
  // no media variants: the site has one palette and renders light on a device
  // set to dark, so offering a dark theme colour here would tint the chrome to
  // a background the page never paints.
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Prints a checklist to the dev server terminal while anything is still on a
  // placeholder value. No-op in production.
  reportPlaceholders()

  const schema = [buildPersonSchema(), buildWebSiteSchema(), buildWorkSchema()]

  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface text-ink antialiased">
        {/* Scroll reveals start at opacity 0 and are switched on by an
            IntersectionObserver. Without this fallback, a visitor with
            JavaScript disabled or blocked gets a page whose About and Contact
            sections are simply blank, which, on a site whose whole job is to
            get someone to contact you, is the worst possible failure mode. */}
        <noscript>
          <style>{`
            .reveal, .curtain { opacity: 1 !important; transform: none !important; }
            .curtain::after { display: none !important; }
            .curtain img, .curtain .placeholder-fill { transform: none !important; }
            .roadmap-line, .roadmap-node { transform: none !important; }
            .roadmap-fill, .roadmap-node-fill { opacity: 1 !important; transform: scaleX(1) !important; }
          `}</style>
        </noscript>

        {/* Runs during parse, before the browser gets to restore the previous
            scroll position on a refresh, and before it acts on a fragment in
            the URL. A React effect is too late for either: hydration happens
            after both, so the page visibly jumps.

            The fragment strip in particular has to be here. Removed from an
            effect instead, the browser has already begun its own smooth scroll
            towards the section by the time the effect resets the page to the
            top; the two fight, and Lenis then adopts whatever position that
            left behind as its target — reliably 96px down the page, which is
            neither the top nor the section. Removing the fragment before the
            browser reads it means that scroll is never started.

            SmoothScroll keeps a `hashchange` listener for the other route in:
            a fragment arriving on a document that is already open, which never
            reaches this script. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history)history.scrollRestoration='manual';" +
              "if(location.hash)history.replaceState(null,'',location.pathname+location.search)",
          }}
        />

        {children}

        {/* Rendered on the server into the initial HTML, so crawlers that don't
            execute JavaScript still see it. */}
        <script
          type="application/ld+json"
          // Content comes from local, typed config — not user input — and is
          // escaped by serialiseSchema before it reaches the DOM.
          dangerouslySetInnerHTML={{ __html: serialiseSchema(schema) }}
        />
      </body>
    </html>
  )
}
