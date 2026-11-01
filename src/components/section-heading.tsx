import { Reveal } from '@/components/reveal'

type Props = {
  title: string
  /** Short right-aligned note — a count, a location, a status. */
  meta?: React.ReactNode
  /** Ties the section's `aria-labelledby` to this heading. */
  id: string
  /**
   * The hairline above the heading that separates it from the section before.
   *
   * Off for the first one. The hero ends in a photograph that bleeds off the
   * top and right of the screen, and a rule drawn straight underneath it read
   * as a caption boxing the picture in rather than as the start of a new
   * section.
   */
  rule?: boolean
}

export function SectionHeading({ title, meta, id, rule = true }: Props) {
  return (
    // `rule-draw` paints an ink hairline over the static border and wipes it
    // left to right as the heading arrives, so the section announces itself
    // with the same gesture the underlines and the progress bar use.
    <Reveal
      className={`reveal flex flex-col items-start gap-1.5 pt-[clamp(60px,10vh,120px)] pb-[clamp(28px,4vh,48px)] min-[640px]:flex-row min-[640px]:items-baseline min-[640px]:justify-between min-[640px]:gap-6 ${
        rule ? 'rule-draw border-hair border-t' : ''
      }`}
    >
      <h2
        id={id}
        className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.02em]"
      >
        {title}
      </h2>
      {/* Beside the title where there is room for it, and on its own line
          where there isn't. Held next to a two-word heading on a 390px screen
          it ran straight off the right edge: "6 projects | products, client
          work and R&D" lost its last three words, and `shrink-0` is what kept
          it from wrapping out of trouble. */}
      {meta ? (
        <p className="text-mute text-sm min-[640px]:shrink-0">{meta}</p>
      ) : null}
    </Reveal>
  )
}
