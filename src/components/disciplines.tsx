import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SplitWords } from '@/components/split-words'
import { ToolPills } from '@/components/tool-pills'
import { getDisciplines } from '@/content/projects'
import type { Locale } from '@/i18n/locales'
import { toolkitLabel } from '@/lib/toolkit-label'

const title: Record<Locale, string> = {
  en: 'What I do',
  de: 'Was ich mache',
  es: 'Qué hago',
}

const meta: Record<Locale, string> = {
  en: 'Two disciplines, one way of working',
  de: 'Zwei Disziplinen, eine Arbeitsweise',
  es: 'Dos disciplinas, una forma de trabajar',
}

/**
 * The two disciplines, as a numbered-feeling list rather than a card grid.
 *
 * Cards would be the reflex here and the wrong answer: two boxes side by side
 * read as a comparison, inviting a reader to decide which one is "more him".
 * A sequence separated by hairlines reads as two parts of one practice
 * instead, and it matches the grid the rest of the page is built on.
 */
export function Disciplines({ locale }: { locale: Locale }) {
  const disciplines = getDisciplines(locale)

  return (
    <section
      id="disciplines"
      aria-labelledby="disciplines-heading"
      className="px-edge pb-[clamp(40px,8vh,90px)]"
    >
      <SectionHeading
        id="disciplines-heading"
        title={title[locale]}
        meta={meta[locale]}
        rule={false}
      />

      <div>
        {disciplines.map((discipline) => (
          <Reveal
            key={discipline.name}
            // The name column is capped rather than given an equal fraction:
            // at 1fr it opened a dead gap the width of the body copy.
            className="reveal border-hair grid grid-cols-1 gap-x-[clamp(20px,4vw,56px)] gap-y-4 border-t py-[clamp(28px,4vw,48px)] first:border-t-0 first:pt-0 min-[880px]:grid-cols-[auto_minmax(160px,0.55fr)_1.45fr]"
          >
            {/* A hairline tick rather than 01 / 02. Numbering implied a
                sequence and a ranking that aren't there: the two run in
                parallel and feed each other. The rule is the same device the
                section dividers and the roadmap use, so it anchors the row
                without asserting anything. */}
            <span
              aria-hidden="true"
              className="bg-hair mt-4 block h-px w-6 min-[880px]:w-10"
            />

            <div>
              {/* Same word-by-word reveal as the About and Contact lines, but
                  settling on ink: the accent stays reserved for the two lines
                  that carry the argument. */}
              {/* The two names carry the accent; their claims stay ink, so
                  the colour marks the discipline rather than the whole block. */}
              <h3
                data-pace="slow"
                aria-label={discipline.name}
                className="ink-line text-[clamp(1.4rem,2.6vw,2rem)] font-semibold tracking-[-0.02em]"
              >
                <SplitWords
                  text={discipline.name}
                  variant="plain"
                  total={discipline.name.split(' ').length}
                />
              </h3>
              <p data-tone="ink" className="ink-line mt-1.5 text-[15px]">
                {/* A <p> can't take aria-label, so the clean sentence goes in a
                    visually-hidden copy instead. */}
                <span className="sr-only">
                  &ldquo;{discipline.claim}&rdquo;
                </span>
                <span aria-hidden="true">&ldquo;</span>
                <SplitWords
                  text={discipline.claim}
                  variant="plain"
                  total={discipline.claim.split(' ').length}
                />
                <span aria-hidden="true">&rdquo;</span>
              </p>
            </div>

            <div>
              <p className="text-soft max-w-[46ch]">{discipline.body}</p>
              <ToolPills
                tools={discipline.tools}
                label={toolkitLabel(discipline.name, locale)}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
