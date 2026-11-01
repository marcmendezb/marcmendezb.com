import { About } from '@/components/about'
import { Contact } from '@/components/contact'
import { Disciplines } from '@/components/disciplines'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Nav } from '@/components/nav'
import { SmoothScroll } from '@/components/smooth-scroll'
import { Work } from '@/components/work'

export default function Home() {
  return (
    <>
      {/* First tab stop on the page: lets a keyboard or screen-reader user jump
          past the navigation instead of tabbing through it on every visit. */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <SmoothScroll />

      <Nav />

      {/* The brand marks bleed past the right edge, which adds ~230px of
          horizontal scroll. Clipped here rather than on <html>: the root's
          overflow is supposed to propagate to the viewport, but with the marks
          being absolutely positioned and rotated it did not, and the page still
          scrolled sideways.

          `clip` rather than `hidden`, so this never becomes a scroll container
          and pull the document scroller out from under the CSS scroll timelines
          that drive most of the page's motion. */}
      <main id="main" className="overflow-x-clip">
        <Hero />
        <Disciplines />
        <Work />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
