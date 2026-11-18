'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { cardTops } from '@/lib/deck'
import {
  isSmoothScrollPaused,
  registerSmoothScroll,
  scrollToTarget,
  scrollToY,
} from '@/lib/smooth-scroll'

/** Width at or above which the project slides are a screen tall and can snap. */
const SLIDE_BREAKPOINT = 880

/**
 * Smooth scrolling, with the safeguards that decide whether it reads as premium
 * or as a site fighting you.
 *
 * Smooth scroll earns its reputation when it is slow, when it hijacks input, or
 * when it runs where it isn't wanted. Four rules avoid all three:
 *
 * 1. Off entirely under `prefers-reduced-motion`. Scroll smoothing is a
 *    classic vestibular trigger, and unlike a decorative reveal there is no
 *    "reduced" version of it worth shipping.
 * 2. Off on touch. Native momentum scrolling is tuned by the OS and beats
 *    anything JavaScript emulates; `syncTouch` is the single biggest source of
 *    "this site feels broken on my phone".
 * 3. Short. `lerp: 0.09` settles in roughly 250ms: perceptible on a trackpad,
 *    which already applies its own momentum, without the floaty lag people
 *    associate with smooth scroll. That comes from durations near a second.
 *    Lower values feel slower; below about 0.04 it starts to fight you.
 * 4. Nothing else is intercepted. Keyboard scrolling, scrollbar dragging,
 *    find-in-page and focus scrolling all keep working, because Lenis moves the
 *    real scroll position instead of transforming a wrapper. That also keeps
 *    the CSS scroll-timeline animations in sync: they read the same
 *    `document.scrollingElement` Lenis is driving.
 */
export function SmoothScroll() {
  /**
   * Clean links: the address bar never shows a fragment.
   *
   * Every in-page link keeps its `href="#work"` in the markup. That is what
   * makes it a link rather than a div with a handler: it is announced as one,
   * it works with the keyboard, it opens in a new tab on a modified click, and
   * it still scrolls if the JavaScript never arrives. What changes is that the
   * default navigation is cancelled, so the browser never writes `#work` into
   * the URL; the scroll is performed here instead.
   *
   * Ahead of the early returns below: this has to run whether or not smooth
   * scrolling is switched on.
   */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Anything the browser should own: opening in a new tab or window, a
      // middle click, or a handler upstream that already dealt with it.
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return

      const link = (event.target as Element | null)?.closest('a')
      const href = link?.getAttribute('href')
      if (!href || !href.startsWith('#') || href === '#') return

      const target = document.getElementById(decodeURIComponent(href.slice(1)))
      if (!target) return

      event.preventDefault()

      /* Focus follows the scroll. Cancelling the navigation also cancels the
         one useful thing a fragment does for assistive tech: it moves the
         focus. Without this the next Tab continues from the link in the nav,
         so a keyboard user is scrolled to Contact and then tabbed back into
         the header. `preventScroll` because the scroll is ours to do.

         The tabindex is removed on blur so the section does not stay in a
         state no markup asked for. */
      target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
      target.addEventListener(
        'blur',
        () => target.removeAttribute('tabindex'),
        {
          once: true,
        },
      )

      /* One frame late, and deliberately. A link inside the mobile menu closes
         the panel through React state, and until that render commits the body
         still carries `overflow: hidden` and the scroll goes nowhere. A click
         is a discrete event, so React has flushed the update and its effects
         before the next frame runs. */
      requestAnimationFrame(() => {
        /* Work opens on the first project, not on the heading above it.
        
           "See the work" that lands you on the words "Selected work" has
           answered a question nobody asked: the heading is a label for the
           section, and the thing the link is offering is the project under it.
           Every route into the section gets this: the hero button, the nav,
           the mobile menu and the footer index all point at `#work`, so the
           rule lives here, once, rather than in four `href`s that would have to
           be kept in step.

           `cardTops()` rather than the card's own position, for the reason that
           function exists: the cards are sticky and report where they are
           painted rather than where they belong. Focus still goes to the
           section, which is the landmark the link names. */
        const firstCard =
          document.querySelector<HTMLElement>('#work [data-snap]')
        if (target.id !== 'work' || !firstCard) {
          scrollToTarget(target)
          return
        }

        /* Two ways to the same card, because the card is two different things
           either side of 880px.
        
           With the deck running it is pinned to the top of the screen and its
           measured position is a lie, so the arithmetic in `cardTops` is the
           only thing that knows where it belongs, and it belongs flush to the
           top, under the header, exactly where a wheel gesture would leave it.
        
           Below that the cards are ordinary blocks in a column, nothing is
           pinned, and flush to the top is wrong: the header is 80px of fixed
           chrome and the card's own top padding is 60, so aiming at the top of
           the card put the photograph under the header. `scrollToTarget`
           already honours the `scroll-padding-top` that reserves the header,
           and with nothing pinned it can be trusted to measure. */
        if (window.matchMedia(`(min-width: ${SLIDE_BREAKPOINT}px)`).matches) {
          const top = cardTops()[0]
          if (top !== undefined) {
            scrollToY(top)
            return
          }
        }
        scrollToTarget(firstCard)
      })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  /* Land at the top on every load, and strip any fragment that arrives with
     the URL rather than honouring it. Two things the site already asks for
     point the same way: it should open at the top on a refresh, and the bar
     should never show a `#`. Honouring an inbound fragment would contradict
     both, and nothing on the page writes one for anybody to arrive with.

     The `hashchange` listener covers the path the load-time strip cannot: a
     fragment arriving on a URL the browser treats as the same document (a
     pasted `/#work` while the page is already open, or a back button after
     one) changes the address without reloading anything, so no mount runs.
     There the browser has already jumped to the section; the scroll is left
     alone and only the address is cleaned. */
  useEffect(() => {
    const strip = () => {
      if (!window.location.hash) return
      history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }

    strip()
    window.scrollTo(0, 0)

    window.addEventListener('hashchange', strip)
    return () => window.removeEventListener('hashchange', strip)
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    )
    // `hover: none` is the reliable touch signal; checking for a coarse pointer
    // alone catches hybrids like a Surface with a mouse attached.
    const isTouch = window.matchMedia('(hover: none)')

    if (prefersReducedMotion.matches || isTouch.matches) return

    const lenis = new Lenis({
      // Lenis runs its own rAF loop, so there's no second one to keep in step.
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      // Off: the click handler above cancels anchor navigation and calls
      // Lenis itself, so leaving this on would give one click two scrolls.
      anchors: false,
    })

    // Lenis keeps its own copy of the scroll position; without this it can
    // ease back to wherever the page was before the reload. Unconditional now
    // that a fragment is never honoured on load.
    lenis.scrollTo(0, { immediate: true })

    registerSmoothScroll(lenis)

    /* The project deck: one gesture, one card.
     *
     * Lenis ships a Snap with a `lock` mode that is meant to do exactly this,
     * and it skipped cards on a fast scroll. The reason is when it decides: it
     * runs off a debounced scroll event, so by the time it picks a target the
     * momentum has already carried the page past the next card and the "next"
     * one is two along. Dropping the debounce does not fix it either, because
     * the momentum is still in flight.
     *
     * So the decision moves to the front of the gesture instead of the end of
     * it. The first wheel event is read while the page is still parked on a
     * card, the neighbour in that direction is chosen, and every remaining
     * event of that gesture (including the long inertia tail a trackpad
     * throws off) is swallowed. The distance travelled stops depending on how
     * hard the flick was.
     *
     * Swallowing has to end on a clock, not on silence. A trackpad drag never
     * falls silent while a finger is moving, so waiting for quiet locked the
     * deck for as long as someone kept scrolling: one card, then nothing.
     *
     * Only the wheel is taken over. Keyboard scrolling, find-in-page, the
     * scrollbar and the in-page links all still move the deck normally, and on
     * touch and under reduced motion none of this exists because Lenis itself
     * is never constructed.
     */
    const desktop = window.matchMedia(`(min-width: ${SLIDE_BREAKPOINT}px)`)

    /** How long a card takes to travel, in seconds. */
    const TRAVEL_S = 0.75
    /** Nothing is dealt until the card in flight has landed, in ms. Just over
        the travel above, so a card is always on its mark before the next one
        can start. */
    const SETTLE_MS = 820
    /** Silence this long ends a gesture, in ms.
    
        The same number as the floor above, and for a reason rather than a
        coincidence: you cannot have reacted to a card that has not landed yet,
        so anything arriving before it lands belongs to the gesture that is
        already running, whatever the gap. Picking a smaller number means
        guessing where a slow turn stops being one turn, and every guess was
        wrong: at 190ms an ordinary turn dealt three cards, at 350ms a lazy one
        still dealt two. There is nothing to guess here. */
    const QUIET_MS = SETTLE_MS
    /** Unbroken input this long deals the next card without the gesture having
        to end, in ms. This is the cost of chaining, and it is the one number
        here that is a matter of taste rather than of physics: at 1500 a second
        card took real effort to reach, which was too much. A second of
        unbroken input is about five notches of a wheel turned at an ordinary
        speed: more than any flick produces, less than a chore. Without this
        path at all, a long drag would deal one card and then freeze the deck
        for as long as the finger kept moving, which is a bug this has had
        before. */
    const SUSTAIN_MS = 1000
    /** Ignore a card we are already sitting on, in px. */
    const TOLERANCE = 8

    /* Three clocks, because there are three different questions.
    
       "Has the last card landed?" is a floor and nothing beats it. "Is this a
       new push or the same turn still going?" is answered by silence, which is
       the only thing that actually distinguishes them: not the gap between two
       events, which is the same whether a wheel is turning slowly or being
       nudged twice. "Has this one gesture gone on long enough to earn another
       card?" is answered by its total length.
    
       A single timestamp could not express this. It either let an ordinary turn
       deal three cards, or it capped a long drag at one and froze the deck. */
    let dealtAt = 0
    let lastEventAt = 0
    let gestureStart = 0
    /** The card being travelled to, so a push arriving mid-flight chains from
        the destination rather than from wherever the page happens to be.
        Unreachable while the floor stands above the travel time, and kept
        because it is the correct general form: lower the floor under 750ms and
        this is what stops a chained push recomputing the card already in
        flight. */
    let heading: number | null = null

    const topsOf = () => (desktop.matches ? cardTops() : [])

    const onWheel = (event: WheelEvent) => {
      // Pinch-to-zoom arrives as a wheel event with ctrl held.
      if (event.ctrlKey) return

      /* A dialog is open over the page. Not `preventDefault`: the overlay has
         already locked the body, so the wheel does nothing on its own; this is
         only here to stop the deck dealing cards underneath something nobody
         can see past. */
      if (isSmoothScrollPaused()) return

      const tops = topsOf()
      if (tops.length === 0) return

      const y = lenis.scroll
      const reach = window.innerHeight * 0.6
      const first = tops[0] ?? 0
      const last = tops[tops.length - 1] ?? 0
      if (y < first - reach || y > last + reach) return

      const direction = Math.sign(event.deltaY)
      if (direction === 0) return

      const now = performance.now()

      /* Where one gesture ends and the next begins. Anything arriving within
         QUIET_MS of the last event belongs to the gesture already running,
         however long that has been going. */
      const opensGesture = now - lastEventAt > QUIET_MS
      if (opensGesture) gestureStart = now
      lastEventAt = now

      const landed = now - dealtAt >= SETTLE_MS
      const insisted = now - gestureStart >= SUSTAIN_MS

      /* One card per gesture. The exception is a gesture that will not stop:
         after SUSTAIN_MS of unbroken input it earns the next card and starts
         counting again, which is what keeps a long drag moving instead of
         leaving the deck stuck under a finger that is still going. */
      if (!landed || !(opensGesture || insisted)) {
        event.preventDefault()
        event.stopImmediatePropagation()
        return
      }

      /* Chain from the card in flight when there is one, so a push landing
         mid-travel advances past the destination instead of recomputing the
         card already being travelled to. */
      const index =
        heading !== null
          ? heading + direction
          : direction > 0
            ? tops.findIndex((top) => top > y + TOLERANCE)
            : tops.reduce(
                (found, top, i) => (top < y - TOLERANCE ? i : found),
                -1,
              )

      // Nothing ahead in that direction: the deck is done, let the page go.
      if (index < 0 || index >= tops.length) return
      const destination = tops[index]
      if (destination === undefined) return

      event.preventDefault()
      event.stopImmediatePropagation()
      heading = index
      dealtAt = now
      // A gesture that earned this one by sheer persistence has to earn the
      // next the same way, from here rather than from where it began.
      if (insisted) gestureStart = now

      lenis.scrollTo(destination, {
        duration: TRAVEL_S,
        // Ease-out-quart. It leaves quickly and arrives slowly, which is what
        // makes a card read as settling rather than stopping dead.
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        /* `lock` stops the reader's own scrolling for the length of the trip.
           `force` is what lets this call happen at all while that is true:
           Lenis drops any `scrollTo` while it is locked unless forced, so
           without it a second push during a card's travel was computed
           correctly, handed over, and silently discarded. */
        lock: true,
        force: true,
        onComplete: () => {
          heading = null
        },
      })
    }

    /* Capture phase, so this runs before Lenis's own wheel handler and can call
       off the normal scroll entirely when the deck is driving. */
    window.addEventListener('wheel', onWheel, { passive: false, capture: true })

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true })
      registerSmoothScroll(null)
      lenis.destroy()
    }
  }, [])

  return null
}
