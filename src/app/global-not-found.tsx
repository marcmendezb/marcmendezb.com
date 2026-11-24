import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NotFoundView } from '@/components/not-found-view'
import { getSite } from '@/content/site'
import { locales } from '@/i18n/locales'
import './globals.css'

/**
 * Every missing address lands here, in its own language.
 *
 * The site's only layout is `app/[locale]/layout.tsx`, a dynamic segment, so
 * there is no root layout for a plain `not-found.tsx` to render inside. This
 * file bypasses layouts altogether, which is why it brings its own `<html>`,
 * the global stylesheet and the font.
 *
 * One page per language, all three in one static document, and a few lines of
 * inline script that show the one the address asks for. The per-language
 * routes this replaced (`[locale]/[...missing]` throwing `notFound()`) were
 * rendered on demand, and Next.js answered those with an empty error document
 * and left the 404 to be drawn by JavaScript after load. This document is
 * prerendered: the server sends the finished page with a real 404 status, the
 * script picks the language before the first paint, and with the JavaScript
 * off the English version shows, as for any address that names no language.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const name = getSite('en').name

export const metadata: Metadata = {
  title: `Page not found | ${name}`,
  robots: { index: false, follow: false },
}

/* Runs during parse, ahead of the content, so the right language is the first
   one painted. Also sets `lang` and the title, which the static document can
   only hold one of. */
const pickLanguage = [
  'var m=/^\\/(en|de|es)(\\/|$)/.exec(location.pathname),l=m?m[1]:"en",d=document.documentElement;',
  'd.setAttribute("data-nf",l);d.lang=l==="de"?"de-CH":l;',
  `var t={en:"Page not found",de:"Seite nicht gefunden",es:"Página no encontrada"}[l]+" | ${name}";`,
  // Hydration writes the static English title back, so hold this one.
  'document.title=t;new MutationObserver(function(){if(document.title!==t)document.title=t})',
  '.observe(document.head,{childList:true,subtree:true,characterData:true});',
].join('')

/* After the content: the header's language links keep the missing path, so
   switching language shows the same 404 in another language instead of
   leaving it. They are the links with an `hreflang` pointing at a bare
   locale; set before hydration, and React leaves an attribute it rendered
   identically alone. */
const keepPath = [
  'var r=location.pathname.replace(/^\\/(en|de|es)(?=\\/|$)/,"").replace(/^\\/+|\\/+$/g,"");',
  'if(r)document.querySelectorAll("a[hreflang]").forEach(function(a){var m=/^\\/(en|de|es)\\/$/.exec(a.getAttribute("href")||"");if(m)a.setAttribute("href","/"+m[1]+"/"+r+"/")});',
].join('')

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: pickLanguage }} />
        {locales.map((locale) => (
          <NotFoundView key={locale} locale={locale} />
        ))}
        <script dangerouslySetInnerHTML={{ __html: keepPath }} />
      </body>
    </html>
  )
}
