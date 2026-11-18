'use client'

import { useEffect, useRef, useState } from 'react'

type Options = {
  /** Fraction of the element that must be visible before it counts. */
  threshold?: number
  /** Shrinks the viewport so elements trigger slightly before the true edge. */
  rootMargin?: string
}

/**
 * Fires once when an element first scrolls into view, then stops observing.
 *
 * One-shot on purpose: re-animating an element every time it re-enters the
 * viewport is distracting when scrolling back up.
 *
 * Note there's no `prefers-reduced-motion` branch here: globals.css already
 * pins `.reveal` and `.curtain` to their final state under that media query,
 * so the observer can run either way and CSS decides whether anything moves.
 */
export function useInView<T extends HTMLElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -12% 0px',
}: Options = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Absent IntersectionObserver, reveal everything on the next frame rather
    // than leaving the page permanently blank.
    if (typeof IntersectionObserver === 'undefined') {
      const frame = requestAnimationFrame(() => setInView(true))
      return () => cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, inView }
}
