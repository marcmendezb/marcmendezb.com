'use client'

import { useEffect, useRef, useState } from 'react'
import { Emphasis } from '@/components/emphasis'
import type { Locale } from '@/i18n/locales'

const more: Record<Locale, string> = {
  en: 'Read more',
  de: 'Weiterlesen',
  es: 'Leer más',
}

const less: Record<Locale, string> = {
  en: 'Show less',
  de: 'Weniger anzeigen',
  es: 'Ver menos',
}

/**
 * A project description that is clamped to a few lines on a phone and opens
 * in place.
 *
 * On a phone the work section is a deck of cards that pin under the header
 * while the next one rides over them, and a pinned card has to fit the
 * screen: anything below the fold of a pinned card is out of reach until the
 * card lets go. The full description does not fit alongside the gallery, so
 * it is clamped, and opening it also unpins the card (the CSS keys off
 * `data-expanded`) so the rest of it can be scrolled to like ordinary text.
 *
 * The toggle only renders when the clamp actually cut something. From 880px
 * the clamp does not apply and neither does the button.
 */
export function ExpandableText({
  text,
  locale,
  className = '',
}: {
  text: string
  locale: Locale
  className?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [clamped, setClamped] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      // Only meaningful while closed: open, nothing is cut by definition.
      if (el.dataset.expanded === 'true') return
      setClamped(el.scrollHeight - el.clientHeight > 1)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div data-expanded={expanded}>
      <p
        ref={ref}
        data-expanded={expanded}
        className={`expandable ${className}`}
      >
        <Emphasis text={text} />
      </p>
      {clamped || expanded ? (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((was) => !was)}
          className="expand-toggle ease-brand hover:text-accent mt-2 text-sm font-medium transition-colors duration-300 min-[880px]:hidden"
        >
          {expanded ? less[locale] : more[locale]}
        </button>
      ) : null}
    </div>
  )
}
