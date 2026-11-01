/**
 * "Barcelona → Zürich", with the arrow drawn rather than typed.
 *
 * One component so the relocation reads identically everywhere it appears: the
 * hero status line, the mobile menu and the About heading. A typed arrow
 * character renders differently in every font and sits on a different baseline
 * than the text around it; a 16px path does not.
 *
 * `currentColor`, so it belongs to whatever text it sits in instead of pulling
 * the accent into three more places.
 */
export function Route({ from, to }: { from: string; to: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {from}
      {/* The arrow is decorative once it's a drawing, so the relationship
          between the two places is spelled out for screen readers. */}
      <span className="sr-only">to</span>
      <svg aria-hidden="true" viewBox="0 0 16 10" className="route">
        <path d="M0 5h12.5M9.5 1.8 13 5l-3.5 3.2" />
      </svg>
      {to}
    </span>
  )
}
