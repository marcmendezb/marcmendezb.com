'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { locales, localeLabel, type Locale } from '@/i18n/locales'

/** How long the menu waits before closing, so the pointer can cross the gap. */
const CLOSE_DELAY_MS = 140

const switcherLabel: Record<Locale, string> = {
  en: 'Language',
  de: 'Sprache',
  es: 'Idioma',
}

const chooseLanguage: Record<Locale, string> = {
  en: 'Choose a language',
  de: 'Sprache wählen',
  es: 'Elegir un idioma',
}

/**
 * The current language code, and a hover-opened list of the other two.
 *
 * Deliberately the same mechanism as the project switcher on the work deck
 * (`deck-index.tsx`): a named trigger with a chevron, a menu that opens on
 * hover or focus with a short grace period on the way out so the pointer can
 * cross the gap, and Escape returning focus to the trigger. Two controls on
 * one page that do the same kind of thing (name the current one of several,
 * open a list to change it) should feel like the same control, not like two
 * different widgets that happen to sit near each other.
 *
 * Always links to `/{locale}`: every page on this site is the same one page,
 * so there's no sub-path to preserve across the switch.
 */
export function LocaleSwitcher({
  locale,
  ghost = false,
  className = '',
}: {
  locale: Locale
  /** Mirrors the header's `data-ghost`: transparent, white label, over the hero. */
  ghost?: boolean
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const closeTimer = useRef(0)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  // Hover opens it, and a short grace period on the way out keeps it open
  // while the pointer crosses from the trigger to the list. Focus opens it
  // too, so reaching it never requires a pointer.
  const hold = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const release = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY_MS)
  }

  return (
    <div
      className={`locale-switcher-wrap ${className}`}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocusCapture={hold}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          release()
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        data-switcher=""
        data-ghost={ghost}
        aria-expanded={open}
        aria-controls="locale-menu"
        aria-label={`${locale.toUpperCase()}. ${chooseLanguage[locale]}`}
        onClick={() => setOpen((was) => !was)}
        className="nav-pill locale-name"
      >
        <span className="text-sm font-medium">{locale.toUpperCase()}</span>
        <Chevron open={open} />
      </button>

      <div
        id="locale-menu"
        role="group"
        aria-label={switcherLabel[locale]}
        data-open={open}
        inert={!open}
        className="locale-menu"
      >
        <ul>
          {locales.map((loc) => (
            <li key={loc}>
              <Link
                href={`/${loc}`}
                hrefLang={loc}
                lang={loc}
                aria-current={loc === locale ? 'true' : undefined}
                onClick={() => setOpen(false)}
                className="locale-menu-item"
              >
                <span className="locale-menu-title">{localeLabel[loc]}</span>
                <span className="locale-menu-note">{loc.toUpperCase()}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/** The same chevron shape the deck switcher uses, rotated open. */
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
      className="locale-chevron"
      data-open={open}
    >
      <path d="M3.5 6 8 10.5 12.5 6" />
    </svg>
  )
}
