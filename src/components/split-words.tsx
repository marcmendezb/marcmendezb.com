type Props = {
  text: string
  /**
   * Offset for the stagger counter, so a headline split across two lines keeps
   * one continuous sequence instead of restarting per line.
   */
  start?: number
  /**
   * `mask` wraps each word in an overflow-hidden box so it can rise into place.
   * `plain` leaves the words in normal flow, for effects that only touch colour.
   */
  variant?: 'mask' | 'plain'
  /** Total word count across all lines — drives the scroll-fill ranges. */
  total?: number
}

/**
 * Splits a string into per-word spans carrying their index as a CSS variable.
 *
 * Word-level rather than line-level: a line rising as one block reads as a
 * slide, whereas words arriving in sequence reads as typesetting. It's the
 * difference between motion applied to text and motion that belongs to it.
 *
 * Rendered on the server — no layout thrash, no flash of unsplit text, and it
 * costs no JavaScript.
 *
 * Accessibility: the spans are `aria-hidden` and the caller puts the full
 * string in `aria-label`, so assistive tech reads one clean sentence instead of
 * a stack of fragments.
 */
export function SplitWords({
  text,
  start = 0,
  variant = 'mask',
  total,
}: Props) {
  const words = text.split(' ')

  return (
    <>
      {words.map((word, index) => {
        const i = start + index
        const style = {
          '--i': i,
          ...(total ? { '--n': total } : {}),
        } as React.CSSProperties

        return (
          // The literal space between spans keeps natural word wrapping and
          // normal inter-word spacing; a flex/gap layout would break both.
          <span key={`${word}-${i}`} aria-hidden="true">
            {variant === 'mask' ? (
              // `--i` goes on `.word`, the element whose animation-delay reads
              // it, not on the mask wrapper. `--i` is registered with
              // `inherits: false`, so a value set on the parent would never
              // reach the child and every word would land on delay 0.
              <span className="word-mask">
                <span className="word" style={style}>
                  {word}
                </span>
              </span>
            ) : (
              <span className="word-ink" style={style}>
                {word}
              </span>
            )}
            {index < words.length - 1 ? ' ' : null}
          </span>
        )
      })}
    </>
  )
}
