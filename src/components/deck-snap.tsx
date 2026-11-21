'use client'

import { useEffect } from 'react'

/**
 * Card-by-card scroll snapping for the work deck on a phone.
 *
 * Each project card fills the screen under the header with the next one
 * peeking from below, and the scroll should stop on a card rather than
 * coast past it: one swipe, one card. That is native CSS scroll snapping
 * (`scroll-snap-type: y mandatory` with `scroll-snap-stop: always`), which on
 * iOS is the only snapping that feels like the platform rather than a
 * correction applied after the fling.
 *
 * Mandatory snapping cannot stay on for the whole page, though: everywhere
 * outside the deck it would drag the page back to the nearest card. So it is
 * switched on only while the deck covers the screen, by a data attribute on
 * <html> that the CSS keys off. The deck has snap points either side of it
 * (the section heading above, the About section below) so a swipe out of the
 * first or last card lands somewhere real, and the attribute drops as soon
 * as it does.
 *
 * Touch only: on a desktop window narrowed below 880px Lenis owns the wheel,
 * and the two would fight. Off while a description is open, so the open text
 * scrolls freely.
 */
export function DeckSnap() {
  useEffect(() => {
    const phone = window.matchMedia('(max-width: 879.98px) and (hover: none)')
    const root = document.documentElement
    let frame = 0
    let lastY = window.scrollY

    const update = () => {
      frame = 0
      const list = document.querySelector<HTMLElement>('#work .deck-list')
      if (!list || !phone.matches) {
        delete root.dataset.deckSnap
        return
      }

      const nav =
        parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 80
      const viewport = window.innerHeight

      // The last card (the confidential one) runs taller than a phone screen,
      // so it gets a second snap point at its foot; on a screen tall enough to
      // hold it, that point would sit above its own start, so it is only
      // armed when the card actually overflows.
      const last = list.lastElementChild as HTMLElement | null
      if (last)
        last.toggleAttribute('data-tall', last.offsetHeight > viewport - nav)

      const r = list.getBoundingClientRect()
      const open = list.querySelector('[data-expanded="true"]') !== null
      const y = window.scrollY
      const direction = Math.sign(y - lastY)
      lastY = y

      // When to snap depends on which way the page is going.
      //
      // Heading down into the deck it switches on early, once the deck has
      // taken half the screen: switched on only when the first card reached
      // the header, a flick's momentum was already past it and the deck
      // opened on the second card.
      //
      // Heading up it holds only while the first card is still under the
      // header, so a swipe up out of the deck is free at once instead of
      // being pulled back onto the first card.
      //
      // At either end the deck has to reach the foot of the screen, so a
      // swipe down out of the last card leaves it.
      const reachesFoot = r.bottom >= viewport - 2
      const entered =
        direction > 0
          ? r.top <= viewport * 0.55
          : direction < 0
            ? r.top <= nav + 2
            : root.dataset.deckSnap !== undefined
      const snap = !open && reachesFoot && entered

      if (snap) root.dataset.deckSnap = ''
      else delete root.dataset.deckSnap
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Opening or closing a description changes whether snapping should run.
    document.addEventListener('click', schedule)
    phone.addEventListener('change', schedule)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('click', schedule)
      phone.removeEventListener('change', schedule)
      delete root.dataset.deckSnap
    }
  }, [])

  return null
}
