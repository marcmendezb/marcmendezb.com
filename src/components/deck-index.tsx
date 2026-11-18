'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cardTops } from '@/lib/deck'
import { scrollToY } from '@/lib/smooth-scroll'

type Entry = {
  /** Project name, as it appears on the card. */
  title: string
  /** Three words at most, so the list can be read rather than decoded. */
  shorthand: string
}

type Props = {
  projects: readonly Entry[]
}

/** How long the menu waits before closing, so the pointer can cross the gap. */
const CLOSE_DELAY_MS = 140

/**
 * Where you are in the project deck, and three ways to move through it.
 *
 * Each card fills the viewport, so from inside one there is no way to tell
 * whether it is the second or the fifth, and the heading that said "6 projects"
 * scrolled away several cards ago.
 *
 * Fixed rather than sitting inside a card, and low rather than anywhere else:
 * the photograph in each card is inset vertically, so the strip along the
 * bottom of the screen is the one band that is empty on every card whichever
 * side the image is on — which is also why it can sit dead centre without ever
 * landing on an image, and so never has to fight for contrast.
 *
 * Desktop only — below 880px the cards are not a deck at all: nothing pins,
 * nothing snaps, and a floating badge would just cover the page.
 */
export function DeckIndex({ projects }: Props) {
  const total = projects.length
  const [active, setActive] = useState<number | null>(null)
  const [inDeck, setInDeck] = useState(false)
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(0)
  const rootRef = useRef<HTMLDivElement>(null)

  /* Which card is current. A band across the middle of the viewport: a card
     takes over when it reaches the centre, not when it first appears at the
     edge. While one rides up over the one pinned beneath it both cross that
     line at once, so the highest index wins — the one painted on top is the
     one being read. */
  useEffect(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('#work [data-snap]'),
    )
    if (cards.length === 0) return

    const crossing = new Set<number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = Number(entry.target.getAttribute('data-index'))
          if (entry.isIntersecting) crossing.add(index)
          else crossing.delete(index)
        }
        setActive(crossing.size > 0 ? Math.max(...crossing) : null)
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )

    for (const card of cards) observer.observe(card)
    return () => observer.disconnect()
  }, [])

  /* Whether the deck is still worth annotating, watched separately from which
     card is current, because the two want different answers. Tied to the cards
     alone the badge outstayed its welcome: the last card is a screen tall, so
     it went on crossing the middle line for most of a screen after you had
     started reading whatever came next.

     The band sits along the bottom of the viewport, which is the end that
     decides when to let go: the stack stops touching it as soon as its last
     edge rises past roughly the lower fifth, so the badge leaves within about
     200px of the final card instead of a thousand. Putting the band near the
     top does the opposite — the stack keeps reaching it until it has left the
     screen entirely. */
  useEffect(() => {
    const wrapper =
      document.querySelector<HTMLElement>('#work [data-snap]')?.parentElement
    if (!wrapper) return

    const observer = new IntersectionObserver(
      ([entry]) => setInDeck(Boolean(entry?.isIntersecting)),
      { rootMargin: '-80% 0px 0px 0px', threshold: 0 },
    )
    observer.observe(wrapper)
    return () => observer.disconnect()
  }, [])

  const go = useCallback((index: number) => {
    const tops = cardTops()
    const target = tops[index]
    if (target === undefined) return
    scrollToY(target)
  }, [])

  const visible = inDeck && active !== null
  const current = active ?? 0

  /* Derived, not synchronised. The menu has no business being open once the
     badge itself has gone, and an effect that pushed `setOpen(false)` whenever
     the badge left would be a second source of truth for the same fact — plus
     a cascading render every time the deck is entered or left. */
  const menuOpen = open && visible

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      rootRef.current?.querySelector<HTMLElement>('[data-switcher]')?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  /* Hover opens it, and a short grace period on the way out keeps it open
     while the pointer crosses from the button to the list. Focus opens it too:
     the list is the only place the project names are readable, and reaching it
     must not require a pointer. */
  const hold = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const release = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }

  const currentProject = projects[current]

  return (
    <div
      ref={rootRef}
      data-visible={visible}
      /* `inert` the moment it starts leaving, not when it finishes. The fade
         takes 450ms and `visibility` waits for it, which left a window where
         the badge was fully transparent and its controls were still in the tab
         order — a keyboard user could land on something nobody can see. */
      inert={!visible}
      className="deck-index nav-pill fixed bottom-[clamp(18px,3.2vh,34px)] z-40 hidden items-center gap-[clamp(10px,1vw,14px)] p-1.5 min-[880px]:flex"
    >
      {/* The name and the list are one object, and the only one that opens it.
          The handlers used to sit on the bar, so brushing the arrows on the way
          to the next card threw the whole list up over the photograph — the
          list belongs to the name, not to the bar, and a pointer that never
          went near the name never asked for it. Wrapping them also gives the
          list something to be positioned against that is the width of its own
          trigger. */}
      <div
        className="deck-switcher-wrap"
        onMouseEnter={hold}
        onMouseLeave={release}
        onFocusCapture={hold}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node))
            release()
        }}
      >
        <button
          type="button"
          data-switcher=""
          aria-expanded={menuOpen}
          aria-controls="deck-switcher"
          /* Named outright rather than by its contents. Each span here is a flex
           item, and flex items are blockified, so the name computed from the
           text came out as "Marqo , project 1 of 6" — the layout inserts a
           separator between blocks that no amount of punctuation in the markup
           can take back. The visible label still leads the spoken one, which is
           what WCAG 2.5.3 asks for. */
          aria-label={`${currentProject?.title ?? ''}, project ${
            current + 1
          } of ${total}. Choose a project`}
          onClick={() => setOpen((was) => !was)}
          className="deck-name"
        >
          <span className="text-[13px] font-medium whitespace-nowrap">
            {currentProject?.title ?? ''}
          </span>
          <Chevron open={menuOpen} />
        </button>
        {/* Upward, because the bar already sits at the foot of the screen.
          Rendered at all times rather than mounted on hover, so it has
          something to fade and so its width is measured once instead of
          reflowing the first time it is asked for. */}
        <div
          id="deck-switcher"
          data-open={menuOpen}
          inert={!menuOpen}
          className="deck-menu"
        >
          <ul>
            {projects.map((project, index) => (
              <li key={project.title}>
                <button
                  type="button"
                  className="deck-menu-item"
                  aria-label={`${project.title}, ${project.shorthand}`}
                  aria-current={index === current ? 'true' : undefined}
                  onClick={() => {
                    go(index)
                    setOpen(false)
                  }}
                >
                  <span className="deck-menu-title">{project.title}</span>
                  <span className="deck-menu-note">{project.shorthand}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <span aria-hidden="true" className="flex items-center gap-1.5">
        {projects.map((project, tick) => (
          <span
            key={project.title}
            className="deck-tick"
            data-on={tick === current}
          />
        ))}
      </span>

      <span className="bg-hair mx-0.5 h-5 w-px" aria-hidden="true" />

      <button
        type="button"
        className="deck-btn"
        aria-label="Previous project"
        disabled={current === 0}
        onClick={() => go(current - 1)}
      >
        <Arrow direction="left" />
      </button>
      <button
        type="button"
        className="deck-btn"
        aria-label="Next project"
        disabled={current === total - 1}
        onClick={() => go(current + 1)}
      >
        <Arrow direction="right" />
      </button>
    </div>
  )
}

/** The same 1px arrow the carousel controls use. */
function Arrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      style={direction === 'left' ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="11"
      height="11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
      className="deck-chevron"
      data-open={open}
    >
      <path d="M3.5 10 8 5.5l4.5 4.5" />
    </svg>
  )
}
