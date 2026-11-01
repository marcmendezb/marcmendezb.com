'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Route } from '@/components/route'
import { site } from '@/content/site'
import { pauseSmoothScroll, resumeSmoothScroll } from '@/lib/smooth-scroll'

/** Width in px below which the pill is swapped for the burger menu. */
const MOBILE_BREAKPOINT = 880

/** Height of the header rail. Mirrors `--nav-h` in globals.css. */
const NAV_HEIGHT = 80

export function Nav() {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [overHero, setOverHero] = useState(true)

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const highlightRef = useRef<HTMLSpanElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)

  // Hovering previews a section without committing; falling back to the
  // scroll-spy result when the pointer leaves.
  const targetIndex = hoverIndex ?? (activeIndex >= 0 ? activeIndex : null)

  // --- Sliding highlight ----------------------------------------------------

  // Written straight to the DOM rather than held in state. Measuring layout and
  // then setting state would schedule a second render on every hover, and the
  // highlight is pure presentation — React has no reason to know its position.
  const measure = useCallback(() => {
    const bar = highlightRef.current
    if (!bar) return

    const element = targetIndex === null ? null : linkRefs.current[targetIndex]
    if (!element) {
      bar.style.opacity = '0'
      return
    }

    bar.style.opacity = '1'
    bar.style.width = `${element.offsetWidth}px`
    bar.style.transform = `translateX(${element.offsetLeft}px)`
  }, [targetIndex])

  useEffect(() => {
    measure()
  }, [measure])

  // Font loading and viewport changes both shift the link positions, so
  // re-measure rather than trusting the first read.
  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  // --- Scroll spy -----------------------------------------------------------

  useEffect(() => {
    const sections = site.nav.map((item) =>
      document.getElementById(item.section),
    )
    const hero = document.getElementById('hero')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          if (entry.target === hero) {
            setActiveIndex(-1)
            continue
          }
          const index = sections.indexOf(entry.target as HTMLElement)
          if (index >= 0) setActiveIndex(index)
        }
      },
      // A thin band across the middle of the viewport: a section becomes
      // active once it reaches the centre, not when it first peeks in.
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    for (const section of sections) if (section) observer.observe(section)
    if (hero) observer.observe(hero)

    return () => observer.disconnect()
  }, [])

  /* The call to action drops its pill while it is over the hero, because the
     hero's right half is a photograph and a white pill sitting on it looked
     like a sticker. Past the hero it takes the same pill as the nav beside it.

     A dedicated observer rather than reusing the scroll spy above: that one
     fires on a band across the middle of the viewport, which is the right
     question for "which section am I reading" and the wrong one for "is there
     still a photograph under the header". Shrinking the root by the header
     height asks exactly the second one — the hero stops intersecting the moment
     its bottom edge passes under the header. */
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return

    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(Boolean(entry?.isIntersecting)),
      { rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px` },
    )
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  // --- Mobile overlay: scroll lock, Escape, focus management ----------------

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    burgerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // The body lock alone doesn't stop Lenis, which drives window.scrollTo from
    // its own loop and would keep scrolling the page behind the overlay.
    pauseSmoothScroll()

    // Move focus into the overlay so the next Tab stays inside it.
    const focusables = () =>
      Array.from(
        overlayRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? [],
      )

    focusables()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        return
      }

      if (event.key !== 'Tab') return

      // Wrap focus at both ends so tabbing can't escape to the page behind.
      const items = focusables()
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      resumeSmoothScroll()
    }
  }, [menuOpen, closeMenu])

  // Resizing up to desktop while the overlay is open would otherwise leave the
  // page scroll-locked behind an invisible layer.
  useEffect(() => {
    if (!menuOpen) return
    const query = window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px)`)
    const onChange = () => query.matches && setMenuOpen(false)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [menuOpen])

  return (
    <>
      {/* No bar. The header is a transparent rail carrying three floating
          pills, each with its own surface, so nothing is drawn across the page
          and the content simply passes underneath them. It stays put: the
          pills are small enough not to be in the way, and navigation that
          moves on its own is one more thing to think about. */}
      <header
        aria-label="Primary"
        className={[
          // Sits above the overlay (z-55), not below it. `position: fixed` plus
          // a z-index makes this header its own stacking context, so a higher
          // z-index on the burger inside it counts for nothing — the whole
          // header has to win, or the close button vanishes behind the open
          // menu. (The original HTML had this exact bug.)
          'px-edge fixed inset-x-0 top-0 z-60 flex items-center justify-between',
          'h-nav',
        ].join(' ')}
      >
        {/* The mark is a soft gradient and the rest of the page is hairlines and
            grotesque type, so it earns its place by staying small: at 22px it
            reads as a coloured dot beside the name rather than as a second
            visual system competing with the one on the page. */}
        <a
          href="#hero"
          className="nav-pill z-10 flex items-center gap-2.5 py-2 pr-4 pl-2 text-[15px] font-semibold tracking-tight whitespace-nowrap"
        >
          <Image
            src="/brand/logo-96.png"
            alt=""
            width={22}
            height={22}
            priority
            className="size-[22px] shrink-0"
          />
          {site.name}
        </a>

        {/* Nav and call to action travel together on the right. Centred, the
            nav sat over the middle of the hero photograph with the button
            marooned in the far corner; grouped, the header reads as a name on
            one side and the controls on the other. */}
        <div className="flex items-center gap-2.5">
          {/* Desktop pill. `relative` because the sliding highlight inside is
            positioned against it — it used to get that for free from the
            absolute centring this replaces. */}
          <nav
            aria-label="Sections"
            className="nav-pill relative hidden items-center gap-0.5 p-[5px] min-[880px]:flex"
          >
            <span
              ref={highlightRef}
              aria-hidden="true"
              className="pill-highlight"
            />
            {site.nav.map((item, index) => {
              const isActive = activeIndex === index
              // Whether the pill is currently sitting under this link — by hover
              // or by scroll position. The original keyed the white text off the
              // active section alone, so hovering any other link slid the dark
              // pill under still-dark text and the label became unreadable.
              const isFilled = targetIndex === index
              return (
                <a
                  key={item.section}
                  href={`#${item.section}`}
                  ref={(node) => {
                    linkRefs.current[index] = node
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onFocus={() => setHoverIndex(index)}
                  onBlur={() => setHoverIndex(null)}
                  // Semantics stay tied to the section you're actually in, not to
                  // wherever the pointer happens to be.
                  aria-current={isActive ? 'true' : undefined}
                  data-filled={isFilled}
                  className="ease-brand data-[filled=true]:text-on-accent relative z-10 block rounded-full px-[18px] py-1.5 text-sm font-medium transition-colors duration-300"
                >
                  <span className="swap-mask">
                    <span className="swap-track">
                      <span>{item.label}</span>
                      {/* Duplicate exists only to slide into view on hover. */}
                      <span aria-hidden="true">{item.label}</span>
                    </span>
                  </span>
                </a>
              )
            })}
          </nav>

          {/* `data-ghost` is read by the CSS, which takes the pill's surface
            away over the photograph and sets the stroke and label white. That
            is the only difference between the two states: the hover is the same
            fill either side of the hero. */}
          <a
            href="#contact"
            data-ghost={overHero}
            className="nav-pill nav-cta wipe-fill ease-brand hover:border-accent z-10 hidden px-[18px] py-2.5 text-sm font-medium whitespace-nowrap min-[880px]:block"
          >
            Get in touch
          </a>

          <button
            ref={burgerRef}
            type="button"
            onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="nav-pill ease-brand hover:text-accent px-[18px] py-2.5 text-sm font-medium min-[880px]:hidden"
          >
            {/* A word, not two stacked lines. The burger was the one piece of
              chrome here that was a borrowed icon, and this header already
              speaks in labelled pills: the desktop nav is words in a pill, so
              the mobile control is the same object with one word in it. The
              label rides the masked swap the nav links use, so opening the menu
              rolls "Menu" up and "Close" into its place.

              WCAG 2.5.3: the visible word is a substring of the aria-label
              above ("Menu" in "Open menu"), so speech input still reaches it. */}
            <span className="swap-mask">
              <span className="swap-track" data-open={menuOpen}>
                <span>Menu</span>
                {/* Both copies are always in the DOM; the aria-label says which
                  action the button performs, so this one is not announced. */}
                <span aria-hidden="true">Close</span>
              </span>
            </span>
          </button>
        </div>
      </header>

      {/* Fullscreen mobile overlay.
          `inert` while closed keeps its links out of the tab order and hides
          them from assistive tech — the clip-path alone would not. */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-open={menuOpen}
        inert={!menuOpen}
        className="overlay bg-surface fixed inset-0 z-55 overflow-y-auto overscroll-contain min-[880px]:hidden"
      >
        {/* The same mark that sits behind the hero and the About section. A
            blank white panel is the one screen on the site that looked like it
            came from somewhere else; carrying the mark across means the menu
            reads as the page continuing rather than as a layer on top of it. */}
        <div aria-hidden="true" className="brand-mark brand-mark--menu">
          <div className="brand-mark-parallax">
            <div className="brand-mark-float">
              <div className="brand-mark-spin">
                <Image
                  src="/brand/marcmendez-logo.png"
                  alt=""
                  fill
                  sizes="130vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* min-h-svh, not min-h-full: on iOS the address bar collapses as you
            scroll and `100%` of a fixed layer is measured against the larger
            viewport, which leaves the bottom row sitting under the browser
            chrome. The safe-area inset covers the home indicator. */}
        <div className="px-edge pt-nav relative z-10 flex min-h-svh flex-col pb-[max(22px,env(safe-area-inset-bottom))]">
          {/* my-auto, not a top margin: the free space splits evenly above and
              below the links instead of all of it pooling under them. With the
              rules and arrows gone there is nothing else holding the middle of
              the panel together. */}
          <nav aria-label="Mobile" className="my-auto flex flex-col py-[4vh]">
            {site.nav.map((item, index) => (
              <a
                key={item.section}
                href={`#${item.section}`}
                onClick={() => setMenuOpen(false)}
                aria-current={activeIndex === index ? 'true' : undefined}
                // `--i` is registered with `inherits: false`, so it has to be
                // set on the element whose own rule reads it. Setting it on the
                // <nav> and reading it here gives every row a delay of 0s.
                style={{ '--i': index } as React.CSSProperties}
                className="menu-in menu-row"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* mt-auto pins this to the bottom on a tall phone and lets it sit
              directly under the links on a short one, instead of the fixed
              three-row grid that left a third of the screen empty. */}
          <div className="mt-auto pt-[clamp(30px,7vh,68px)]">
            <p
              style={{ '--i': 3 } as React.CSSProperties}
              className="menu-in text-mute text-[11px] tracking-[0.14em] uppercase"
            >
              Direct
            </p>
            <a
              href={`mailto:${site.email}`}
              onClick={() => setMenuOpen(false)}
              style={{ '--i': 4 } as React.CSSProperties}
              className="menu-in underline-sweep ease-brand hover:text-accent mt-2.5 block w-fit text-[clamp(1.05rem,4.8vw,1.45rem)] font-medium transition-colors duration-300"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/\s/g, '')}`}
              onClick={() => setMenuOpen(false)}
              style={{ '--i': 5 } as React.CSSProperties}
              className="menu-in text-mute ease-brand hover:text-accent mt-2 block w-fit text-[15px] transition-colors duration-300"
            >
              {site.phone}
            </a>

            <p
              style={{ '--i': 6 } as React.CSSProperties}
              className="menu-in border-hair text-mute mt-[clamp(26px,5vh,44px)] flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-5 text-sm"
            >
              <Route
                from={site.hiring.currentLocation.split(',')[0] ?? ''}
                to={site.hiring.targetLocation.split(',')[0] ?? ''}
              />
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="status-mark">
                  <Image
                    src="/brand/logo-96.png"
                    alt=""
                    width={12}
                    height={12}
                    className="status-spin size-3"
                  />
                </span>
                Available
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
