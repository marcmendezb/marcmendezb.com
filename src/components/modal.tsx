'use client'

import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { pauseSmoothScroll, resumeSmoothScroll } from '@/lib/smooth-scroll'

type Props = {
  open: boolean
  onClose: () => void
  /** Names the dialog for assistive tech. There is no visible heading inside. */
  label: string
  /** Accessible name for the close button. */
  closeLabel?: string
  children: React.ReactNode
}

/**
 * A dialog over the page: the obligations, without the contents.
 *
 * Everything here is the part of a modal that is easy to get wrong and
 * invisible when it is right: the page behind it stops scrolling, focus goes
 * in and cannot leave, Escape closes it, and focus returns to whatever opened
 * it. The caller supplies only what is inside.
 *
 * `overflow: hidden` on the body is not enough on its own. Lenis drives
 * `window.scrollTo` from its own loop and will happily keep scrolling the page
 * underneath an overlay, so it is stopped as well.
 *
 * Rendered into `<body>`, so the fixed positioning cannot be captured by a
 * transformed ancestor further up the tree, and there are several on this
 * page, between the parallax frames and the sticky cards.
 *
 * Note for whoever comes next: the carousel's lightbox is an older, separate
 * implementation of this same thing, written before there were two of them. It
 * works and it is verified, so it was left alone rather than refactored in a
 * change about something else. If a third modal ever appears, fold that one in
 * here first.
 */
export function Modal({
  open,
  onClose,
  label,
  closeLabel = 'Close',
  children,
}: Props) {
  /* The dialog itself, not the box inside it: the close button sits outside
     that box, and a trap that searched only the contents would have found
     nothing to hold on a dialog whose only control is the close. */
  const dialogRef = useRef<HTMLDivElement>(null)
  /* What had focus when this opened. Captured on the way in rather than passed
     down, so the caller does not have to hold a ref to its own trigger. */
  const openerRef = useRef<HTMLElement | null>(null)

  const close = useCallback(() => {
    onClose()
    openerRef.current?.focus()
  }, [onClose])

  useEffect(() => {
    if (!open) return

    openerRef.current = document.activeElement as HTMLElement | null

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    pauseSmoothScroll()

    const focusables = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )

    focusables()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab') return

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
  }, [open, close])

  if (!open) return null

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="lightbox"
      onClick={(event) => {
        // The backdrop closes it; a click on anything inside does not.
        if (event.target === event.currentTarget) close()
      }}
    >
      <button
        type="button"
        onClick={close}
        aria-label={closeLabel}
        className="lightbox-close"
      >
        <CloseIcon />
      </button>
      <div className="lightbox-figure">{children}</div>
    </div>,
    document.body,
  )
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
    >
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  )
}
