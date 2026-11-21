'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
 * Always links to `/{locale}/`: every page on this site is the same one page,
 * so there's no sub-path to preserve across the switch.
 *
 * Plain anchors, not next/link, in both switchers: another language is
 * another document. A full load brings its own `<html lang>`, metadata and
 * structured data, and runs the layout's inline scroll script, which a
 * client-side transition renders without ever executing.
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
  const openedAt = useRef(0)
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
    if (!open) openedAt.current = performance.now()
    setOpen(true)
  }

  // On a touchscreen one tap is focus and click in a row: focus opens the
  // menu and the click that follows would toggle it shut again. A click
  // arriving right after something else opened it confirms, not toggles.
  const toggle = () => {
    if (open && performance.now() - openedAt.current < 400) return
    setOpen((was) => !was)
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
        onClick={toggle}
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
        className="locale-menu header-menu"
      >
        <ul>
          {locales.map((loc) => (
            <li key={loc}>
              <a
                href={`/${loc}/`}
                hrefLang={loc}
                lang={loc}
                aria-current={loc === locale ? 'true' : undefined}
                onClick={() => setOpen(false)}
                className="locale-menu-item"
              >
                <span className="locale-menu-title">{localeLabel[loc]}</span>
                <span className="locale-menu-note">{loc.toUpperCase()}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * The mobile menu's language control: all three languages at once, one tap
 * to switch.
 *
 * A dropdown is the wrong object inside a fullscreen menu. It hides three
 * options behind a fourth control on a screen with room to spare, and the
 * header's hover-and-focus mechanism does not translate to touch: the tap
 * focuses the trigger (opening it) and then clicks it (closing it again).
 *
 * So this is the header's nav pill instead: the same material, the same
 * accent fill marking the current one, sliding to the language you tap
 * while the next page loads. Names, not codes, each in its own language,
 * because "DE" asks a German speaker to decode something "Deutsch" just
 * says.
 */
export function LocaleSegmented({ locale }: { locale: Locale }) {
  // The fill moves on tap, before the route changes, so the press is answered
  // immediately rather than when the next page arrives.
  const [pending, setPending] = useState<Locale | null>(null)
  const selected = pending ?? locale

  return (
    <nav aria-label={switcherLabel[locale]}>
      <ul
        className="locale-seg"
        style={
          {
            '--seg': locales.indexOf(selected),
          } as React.CSSProperties
        }
      >
        <li aria-hidden="true" className="locale-seg-thumb" />
        {locales.map((loc) => (
          <li key={loc}>
            <a
              href={`/${loc}/`}
              hrefLang={loc}
              lang={loc}
              aria-current={loc === locale ? 'true' : undefined}
              data-selected={loc === selected}
              onClick={() => setPending(loc)}
              className="locale-seg-item"
            >
              {localeLabel[loc]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
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
