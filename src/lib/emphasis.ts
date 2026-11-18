/**
 * Two levels of emphasis inside a plain content string.
 *
 * The project descriptions are prose written in `src/content/projects.ts`, and
 * prose is edited as prose: splitting them into arrays of typed fragments would
 * make every future wording change a structural edit. So the markers live in
 * the sentence, in the one notation anybody who has written a README already
 * knows:
 *
 *   `**like this**`     bold, in ink. The claim inside the sentence.
 *   `***like this***`   bold, in the accent. The louder of the two, for a
 *                       phrase that should carry colour as well as weight.
 *
 * Markdown reads `***` as "more than `**`", which is exactly what it means
 * here, so there is nothing to learn and nothing to look up.
 *
 * Nothing uses the accent level at the moment. It is kept because it costs a
 * branch and the alternative is rebuilding it the next time one line wants to
 * carry colour.
 *
 * Deliberately not a Markdown parser. It handles two delimiters and leaves
 * everything else (asterisks in the middle of a word, `brand*`, a stray one)
 * as the literal text it is.
 */

export type EmphasisTone = 'plain' | 'strong' | 'accent'

export type EmphasisSegment = {
  text: string
  tone: EmphasisTone
}

/* `***` first, so the three-asterisk form is never read as `**` wrapping a
   lone asterisk. Non-greedy, so two marked phrases in one sentence stay two. */
const MARKED = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*/g

/** Splits a string into runs, each carrying the tone it should be set in. */
export function emphasisSegments(text: string): EmphasisSegment[] {
  const segments: EmphasisSegment[] = []
  // A fresh regex per call: `lastIndex` is state, and a module-level literal
  // shared between calls would start the second one wherever the first stopped.
  const pattern = new RegExp(MARKED.source, 'g')
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), tone: 'plain' })
    }
    const [, accent, strong] = match
    if (accent !== undefined) segments.push({ text: accent, tone: 'accent' })
    else if (strong !== undefined)
      segments.push({ text: strong, tone: 'strong' })
    cursor = match.index + match[0].length
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), tone: 'plain' })
  }
  return segments
}

/**
 * The same string with the markers taken out.
 *
 * The descriptions are read twice: once by the page, which sets the emphasis,
 * and once by `structured-data.ts`, which hands them to search engines as the
 * `description` of a CreativeWork. Asterisks have no meaning there: they would
 * simply be published, in a field nobody on the team ever looks at again.
 */
export function emphasisPlain(text: string): string {
  return text.replace(MARKED, (_, accent, strong) => accent ?? strong ?? '')
}
