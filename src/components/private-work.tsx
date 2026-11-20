import Image from 'next/image'
import { Fragment } from 'react'
import { Emphasis } from '@/components/emphasis'
import type { ConfidentialWork } from '@/content/projects'
import type { Locale } from '@/i18n/locales'

const withheld: Record<Locale, string> = {
  en: 'name withheld',
  de: 'Name vertraulich',
  es: 'nombre reservado',
}

/**
 * Pictograms: fine line drawings in white, at the weight of the panel's own
 * hairlines, with nothing behind them. Drawn for this card rather
 * than taken from an icon set, so the three share one stroke, one box and one
 * set of round joins, and each has a single solid detail (the selected panel,
 * the spark, the pointer) as its focal point.
 *
 * The strokes are `pathLength=1`, which is what lets each one draw itself in
 * from CSS without knowing how long the path really is.
 */
const glyphs: Record<ConfidentialWork['icon'], React.ReactNode> = {
  // A browser window with its modules laid out inside: one panel solid, as if
  // selected, so the glyph has a focal point rather than four equal boxes.
  platform: (
    <>
      <rect
        x="15"
        y="18"
        width="34"
        height="27"
        rx="5"
        pathLength={1}
        className="picto-line"
      />
      <path d="M15 25h34" pathLength={1} className="picto-line" />
      <circle cx="19.5" cy="21.5" r="1" className="picto-dot" />
      <circle cx="23" cy="21.5" r="1" className="picto-dot" />
      <rect
        x="19.5"
        y="29.5"
        width="11"
        height="6"
        rx="1.6"
        className="picto-fill"
      />
      <path d="M19.5 40.5h11" pathLength={1} className="picto-line" />
      <rect
        x="34"
        y="29.5"
        width="10.5"
        height="11"
        rx="1.6"
        pathLength={1}
        className="picto-line"
      />
    </>
  ),
  // An answer drawn from sources: a speech bubble, the lines of the reply,
  // and the four-point spark of the model writing it.
  assistant: (
    <>
      <path
        d="M20 17.5h21a6 6 0 0 1 6 6v10a6 6 0 0 1-6 6H31l-7.5 6.5v-6.5H20a6 6 0 0 1-6-6v-10a6 6 0 0 1 6-6z"
        pathLength={1}
        className="picto-line"
      />
      <path d="M20.5 26h11M20.5 31.5h7" pathLength={1} className="picto-line" />
      <path
        d="M40 23.5l1.5 3.4 3.4 1.5-3.4 1.5-1.5 3.4-1.5-3.4-3.4-1.5 3.4-1.5z"
        className="picto-fill"
      />
    </>
  ),
  // The web, and a pointer landing on it: sites in use, not just shipped.
  sites: (
    <>
      <circle cx="30" cy="31" r="13" pathLength={1} className="picto-line" />
      <path
        d="M17 31h26M19 24.5h22M19 37.5h15"
        pathLength={1}
        className="picto-line"
      />
      <path
        d="M30 18c3.9 3.6 5.8 7.9 5.8 13S33.9 40.4 30 44c-3.9-3.6-5.8-7.9-5.8-13S26.1 21.6 30 18z"
        pathLength={1}
        className="picto-line"
      />
      <path
        d="M38.5 37.5l11 4-4.7 1.9-2 4.7z"
        className="picto-fill picto-cursor"
      />
    </>
  ),
}

function Picto({
  icon,
  index,
}: {
  icon: ConfidentialWork['icon']
  index: number
}) {
  return (
    // Cropped to the glyphs, which were drawn in a 64-unit box.
    <svg
      aria-hidden="true"
      viewBox="11 13 42 37"
      className="mt-1 h-auto w-[clamp(34px,3vw,42px)]"
      style={{ '--i': index } as React.CSSProperties}
    >
      <g className="picto-glyph">{glyphs[icon]}</g>
    </svg>
  )
}

/** Text, then a replica of the mark n characters wide wherever the title says `[n]`. */
function Title({
  text,
  locale,
  offset,
}: {
  text: string
  locale: Locale
  offset: number
}) {
  let bar = offset

  return text.split(/\[(\d+)\]/).map((part, i) =>
    i % 2 === 0 ? (
      <Fragment key={i}>{part}</Fragment>
    ) : (
      <Fragment key={i}>
        {/* Drawn, not typed: a run of █ glyphs would be read aloud and sit
            on the font's own metrics, while a box can be sized to the name it
            hides, in this line's own `ch`. `--k` varies the shape and the
            timing, so no two on the card are the same. */}
        <span
          aria-hidden="true"
          className="redaction"
          data-shape={bar % 3}
          style={{ '--w': `${part}ch`, '--k': bar++ } as React.CSSProperties}
        >
          <span className="redaction-fill" />
        </span>
        <span className="sr-only">({withheld[locale]})</span>
      </Fragment>
    ),
  )
}

/**
 * What the confidential card shows where every other card has its pictures.
 *
 * Made of the page's own parts: the footer's panel and the mark drifting
 * behind it, three entries split by hairlines, type in the panel's inverted
 * inks. The logo's colours arrive in one place only: small replicas of the
 * mark, turning, where the names would be.
 *
 * No numbers on the entries: they are three kinds of work, not three steps,
 * and a count would rank them.
 */
export function PrivateWork({
  entries,
  locale,
}: {
  entries: readonly ConfidentialWork[]
  locale: Locale
}) {
  return (
    <>
      {/* The footer's mark, at the footer's opacity: see `.brand-mark--vault`. */}
      <div aria-hidden="true" className="brand-mark brand-mark--vault">
        <div className="brand-mark-float">
          <div className="brand-mark-spin">
            <Image
              src="/brand/marcmendez-logo.png"
              alt=""
              fill
              sizes="560px"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <ul className="relative z-[1] grid">
        {entries.map((entry, index) => (
          <li
            key={entry.icon}
            className="border-hair grid grid-cols-[auto_1fr] items-start gap-x-[clamp(18px,2.4vw,32px)] border-t py-[clamp(18px,2.8vh,30px)] first:border-t-0 first:pt-0 last:pb-0"
          >
            <Picto icon={entry.icon} index={index} />
            <div>
              <p className="text-ink text-[clamp(1.15rem,1.7vw,1.55rem)] leading-[1.25] font-semibold tracking-[-0.02em]">
                <Title text={entry.title} locale={locale} offset={index} />
              </p>
              {/* `**…**` in the detail lifts a phrase to full white, the same
                  marker the project descriptions use. */}
              <p className="text-soft mt-2 max-w-[46ch] text-[15px] leading-relaxed">
                <Emphasis text={entry.detail} />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
