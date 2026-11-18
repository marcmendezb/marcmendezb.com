import type Lenis from 'lenis'

/**
 * The active Lenis instance, if smooth scrolling is running at all.
 *
 * A module singleton rather than context: exactly one instance can exist, it
 * has no render output, and the only consumers are imperative (pause the page
 * while the mobile menu is open). Context would add a provider and a re-render
 * path for something React never needs to know about.
 */
let instance: Lenis | null = null

/* Whether something has asked the page to hold still.
 
   Lenis already knows it is stopped, and that was not enough. The deck's wheel
   handler moves cards with `force: true`, which exists so a second push during
   a card's travel is not dropped, and `force` is precisely the flag that
   overrides `isStopped`. So an overlay could freeze the page and the wheel
   would still deal cards underneath it. The handler needs to ask a question
   Lenis does not answer: not "are you stopped" but "has anyone asked you to
   be". */
let paused = false

export function registerSmoothScroll(lenis: Lenis | null) {
  instance = lenis
}

/**
 * Freeze the page behind an overlay.
 *
 * `overflow: hidden` on the body is not enough on its own: Lenis drives
 * `window.scrollTo` from its own loop and will happily keep scrolling
 * underneath a locked body. Both have to be told to stop.
 *
 * No-ops when smooth scrolling is off (touch, reduced motion), which is exactly
 * the behaviour we want: the body lock alone handles those cases.
 */
export function pauseSmoothScroll() {
  paused = true
  instance?.stop()
}

export function resumeSmoothScroll() {
  paused = false
  instance?.start()
}

/** True while an overlay is holding the page still. Read by the deck. */
export function isSmoothScrollPaused() {
  return paused
}

/**
 * Scroll to an absolute position, easing if smooth scrolling is running.
 *
 * Takes a number rather than an element on purpose: its callers are dealing
 * with sticky cards, whose measured position is not where they belong, so they
 * do that arithmetic themselves and hand over the answer.
 */
export function scrollToY(y: number, duration = 0.85) {
  if (instance) {
    // A deliberate scroll is a resume: the mobile menu stops Lenis and then
    // closes on the very click that asks for this.
    paused = false
    instance.start()
    instance.scrollTo(y, {
      duration,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      // `force`, or an arrow pressed while a card is already travelling is
      // dropped: Lenis ignores `scrollTo` while it is locked by an earlier one.
      lock: true,
      force: true,
    })
    return
  }
  window.scrollTo({ top: y, behavior: 'smooth' })
}

/**
 * Scroll to a section the way an anchor click would, minus the anchor.
 *
 * Neither branch passes an offset. `scroll-padding-top` in globals.css already
 * reserves the height of the fixed nav, and both Lenis and `scrollIntoView`
 * honour it: adding it again here landed every section 128px down instead
 * of 64.
 *
 * `start()` before scrolling because the mobile menu stops Lenis while it is
 * open, and a link inside that menu is clicked before React has finished
 * closing it. Without this the scroll is handed to an instance that is still
 * frozen and quietly dropped.
 */
export function scrollToTarget(target: HTMLElement) {
  if (instance) {
    paused = false
    instance.start()
    instance.scrollTo(target)
    return
  }
  // Touch and reduced-motion never construct a Lenis instance. The CSS decides
  // whether this one eases or jumps: `scroll-behavior` is smooth by default and
  // forced to auto under prefers-reduced-motion.
  target.scrollIntoView({ block: 'start' })
}
