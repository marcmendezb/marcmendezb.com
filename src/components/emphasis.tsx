import { emphasisSegments } from '@/lib/emphasis'

/**
 * Renders a content string with its emphasis markers resolved.
 *
 * `font-medium` and a step up in colour, not `font-bold`. The paragraph around
 * it is set in `--soft`, so moving a phrase to `--ink` already separates it;
 * adding 100 of weight on top is enough to catch the eye on a second pass and
 * not enough to be read as shouting. At 600 against 400 the marked phrases
 * stopped being emphasis and became the sentence, with the rest as commentary.
 *
 * `<strong>`, so the emphasis is in the markup rather than only in the CSS: a
 * screen reader can convey it, and it survives the stylesheet not loading.
 */
export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {emphasisSegments(text).map((segment, index) =>
        segment.tone === 'plain' ? (
          segment.text
        ) : (
          <strong
            // Index keys: this list is derived from a constant string and is
            // never reordered, inserted into or removed from.
            key={index}
            className={
              segment.tone === 'accent'
                ? // A coloured phrase reads as one object, so it is not left
                  // to break across two lines. Only ever a few words, so
                  // holding it together cannot push a column out of shape.
                  'text-accent font-medium whitespace-nowrap'
                : 'text-ink font-medium'
            }
          >
            {segment.text}
          </strong>
        ),
      )}
    </>
  )
}
