import { notFound } from 'next/navigation'
import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { Disciplines } from '@/components/disciplines'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Nav } from '@/components/nav'
import { SmoothScroll } from '@/components/smooth-scroll'
import { Work } from '@/components/work'
import { getProjects } from '@/content/projects'
import { isLocale } from '@/i18n/locales'

const skipLinkLabel = {
  en: 'Skip to content',
  de: 'Zum Inhalt springen',
  es: 'Saltar al contenido',
}

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale: rawLocale } = await params
  if (!isLocale(rawLocale)) notFound()
  const locale = rawLocale

  return (
    <>
      {/* First tab stop on the page: lets a keyboard or screen-reader user jump
          past the navigation instead of tabbing through it on every visit. */}
      <a href="#main" className="skip-link">
        {skipLinkLabel[locale]}
      </a>

      <SmoothScroll />

      {/* Only what the Work dropdown shows, not the projects themselves: the
          nav is a client component, and handing it the full entries would ship
          every description to the browser for a list of names. */}
      <Nav
        locale={locale}
        projects={getProjects(locale).map(({ title, shorthand }) => ({
          title,
          shorthand,
        }))}
      />

      {/* The brand marks bleed past the right edge, which adds ~230px of
          horizontal scroll. Clipped here rather than on <html>: the root's
          overflow is supposed to propagate to the viewport, but with the marks
          being absolutely positioned and rotated it did not, and the page still
          scrolled sideways.

          `clip` rather than `hidden`, so this never becomes a scroll container
          and pull the document scroller out from under the CSS scroll timelines
          that drive most of the page's motion. */}
      <main id="main" className="overflow-x-clip">
        <Hero locale={locale} />
        <Disciplines locale={locale} />
        <Work locale={locale} />
        <About locale={locale} />
        <Contact locale={locale} />
      </main>

      <Footer locale={locale} />
    </>
  )
}
