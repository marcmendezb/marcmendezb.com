import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SplitWords } from '@/components/split-words'
import { learning, timeline } from '@/content/projects'
import { site } from '@/content/site'

/**
 * About.
 *
 * Laid out as three full-width bands rather than two columns.
 *
 * The two-column version put a single nine-word sentence against a stack of
 * three paragraphs, a timeline, education, languages and a learning list. Half
 * the section was empty and the other half was a column of everything, which is
 * the opposite of what a grid is for. Splitting by *kind* of content instead of
 * by column gives each band the width it needs: prose reads at a sane measure,
 * and the factual blocks get to run horizontally, which is how a progression of
 * years wants to be read anyway.
 */
export function About() {
  const { hiring, languages, education } = site

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="px-edge relative isolate pb-[clamp(40px,8vh,90px)]"
    >
      {/* The brand mark as atmosphere: anchored bottom-right, running from the
          middle of the page off the right edge and bleeding down into Contact.
          The section carries no `overflow-hidden`, which is what lets it cross
          the boundary; `body { overflow-x: clip }` keeps the bleed from adding
          a horizontal scrollbar. */}
      <div aria-hidden="true" className="brand-mark brand-mark--about">
        <div className="brand-mark-parallax">
          <div className="brand-mark-float">
            <div className="brand-mark-spin">
              <Image
                src="/brand/marcmendez-logo.png"
                alt=""
                fill
                sizes="(max-width: 880px) 130vw, 1100px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <SectionHeading
        id="about-heading"
        title="About"
        meta={hiring.currentLocation.split(',')[0] ?? ''}
      />

      {/* Band 1: the statement, then the argument behind it. */}
      <div className="grid grid-cols-1 gap-x-[clamp(24px,5vw,64px)] gap-y-8 min-[880px]:grid-cols-[0.85fr_1.15fr]">
        {/* The signature moment: this inks in word by word against the scroll
            position, so it writes itself as you arrive at it. */}
        <p className="ink-line block max-w-[16ch] text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.15] font-semibold tracking-[-0.02em]">
          {/* A <p> has role=paragraph, which prohibits aria-label, so the
              sentence is exposed once as a visually-hidden string instead. */}
          <span className="sr-only">
            I build the product and the growth around it.
          </span>
          <SplitWords
            text="I build the product and the growth around it."
            variant="plain"
            total={9}
          />
        </p>

        <Reveal className="reveal">
          {/* Deliberately does not retell the timeline below it. The dates are
              in the next band; this is the part the dates don't explain. */}
          <div className="text-soft max-w-[52ch] space-y-4">
            <p>
              Most people who build web products pick up conversion later, as
              something bolted on once the thing works. I came at it from both
              sides: seven years as a full-stack marketing technologist, four as
              a full-stack developer, with neither one supporting the other. So
              conversion is already in the structure when I build, not
              retrofitted after launch: what the page is for, what it asks of
              you, what happens after you say yes.
            </p>
            <p>
              It shows up as coherence. The positioning, the site, the product
              and the ads all answer to one idea, instead of three people each
              defending their own piece of it.
            </p>
            <p>
              Originally from {hiring.origin.split(',')[0]}, I&rsquo;m based
              near {hiring.targetLocation.split(',')[0]} already, available{' '}
              {hiring.availableFrom}, with no permit or relocation to sort out.{' '}
              {site.openTo}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Band 2: the background as a roadmap.

          A grey track draws in left to right with a node at each date, then
          blue runs along it in sequence and clears, on a loop. The three
          milestones read as one progression rather than three separate facts.

          The cells sit flush with no gap: that's what keeps the segments
          joining into a single continuous line. The text inside them is what
          gets the right padding, not the cell. */}
      <Reveal
        className="reveal border-hair bg-surface/60 mt-[clamp(40px,6vw,72px)] rounded-[clamp(24px,3.5vw,44px)] border px-[clamp(24px,4vw,52px)] py-[clamp(28px,4vw,52px)] backdrop-blur-2xl"
        as="div"
      >
        {/* Surface, not a grey fill. A tinted panel dropped --mute from 4.88:1
            to 4.31:1 against it, taking the years and the detail lines below
            AA; on the page surface they are back where they were tuned. The
            shape and the hairline do the separating, which is how the rest of
            the page works anyway.

            The horizontal padding is not decorative: with a capsule radius the
            corners curve inward by half the block's height, so the first and
            last columns need that much clearance or they sit in the curve. */}
        <h3 className="sr-only">Background</h3>
        <ol className="roadmap grid grid-cols-1 min-[720px]:grid-cols-3">
          {timeline.map((milestone, index) => {
            // `--i` goes on the two elements whose transition-delay reads it,
            // not on the <li>. It's registered `inherits: false`, so a value set
            // on the parent never reaches the children and every segment would
            // draw at once instead of in sequence.
            const step = { '--i': index } as React.CSSProperties

            return (
              <li
                key={milestone.year}
                className="pt-5 first:pt-0 min-[720px]:pt-0"
              >
                <p className="text-mute font-mono text-sm tabular-nums">
                  {milestone.year}
                </p>

                <div className="roadmap-track my-3.5">
                  <span
                    aria-hidden="true"
                    className="roadmap-line"
                    style={step}
                  />
                  {/* Accent line over the grey one. Each segment fills in
                      turn, the one after the last date included, so the track
                      is fully blue before it clears. */}
                  <span aria-hidden="true" className="roadmap-fill" />
                  <span
                    aria-hidden="true"
                    className="roadmap-node"
                    style={step}
                  >
                    <span className="roadmap-node-fill" />
                  </span>
                </div>

                <div className="min-[720px]:pr-8">
                  <p className="roadmap-label font-medium">{milestone.label}</p>
                  <p className="text-mute mt-1 max-w-[34ch] text-sm">
                    {milestone.detail}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </Reveal>

      {/* Band 3: the checkable facts, three abreast.

          The gap above this is deliberately larger than the one above the
          roadmap. At equal spacing the two bands read as one block, and the
          facts looked like a fourth roadmap column. Separation has to say
          "different kind of content", not just "next row". */}
      {/* Three panels in the roadmap's clothing: same hairline, same translucent
          surface over the brand mark, same blur. A smaller radius though — a
          capsule curve on a box this narrow would eat its own corners. The
          inner rules lose their top border because the panel edge already does
          that job.

          The gap above matches the gap between the cards, so the four panels
          read as one cluster rather than as a band and a separate afterthought. */}
      <Reveal className="reveal mt-[clamp(16px,2vw,28px)] grid grid-cols-1 items-start gap-[clamp(16px,2vw,28px)] min-[720px]:grid-cols-3">
        <div className="border-hair bg-surface/60 rounded-[clamp(24px,3.5vw,44px)] border px-[clamp(20px,2.4vw,32px)] py-[clamp(20px,2.2vw,28px)] backdrop-blur-2xl">
          <h3 className="mb-3 text-sm font-medium">Education</h3>
          <dl>
            {education.map((entry) => (
              <div
                key={entry.qualification}
                className="border-hair gap-4 border-t py-2.5"
              >
                <dt className="text-sm">{entry.qualification}</dt>
                <dd className="text-mute mt-0.5 text-sm">
                  {entry.country}
                  {entry.completed === false ? ', not completed' : ''}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-hair bg-surface/60 rounded-[clamp(24px,3.5vw,44px)] border px-[clamp(20px,2.4vw,32px)] py-[clamp(20px,2.2vw,28px)] backdrop-blur-2xl">
          <h3 className="mb-3 text-sm font-medium">Languages</h3>
          <dl>
            {languages.map((language) => (
              <div
                key={language.name}
                className="border-hair flex items-baseline justify-between gap-4 border-t py-2.5"
              >
                <dt className="text-sm">{language.name}</dt>
                <dd className="text-mute text-sm">{language.level}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-hair bg-surface/60 rounded-[clamp(24px,3.5vw,44px)] border px-[clamp(20px,2.4vw,32px)] py-[clamp(20px,2.2vw,28px)] backdrop-blur-2xl">
          {/* Saying what you're mid-way through reads as more credible than a
              list where everything is already mastered. */}
          <h3 className="mb-3 text-sm font-medium">Currently learning</h3>
          <ul>
            {learning.map((item) => (
              <li
                key={item}
                className="border-hair text-mute border-t py-2.5 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
