import Image from 'next/image'
import { Media } from '@/components/media'
import { SplitWords } from '@/components/split-words'
import { site } from '@/content/site'

/** Helper for the staggered fade-up entrance. */
const delay = (seconds: number) =>
  ({ '--delay': `${seconds}s` }) as React.CSSProperties

export function Hero() {
  const { hiring, cvPath } = site

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="ink-exit px-edge min-[880px]:pt-nav relative isolate grid min-h-svh grid-cols-1 items-center gap-[clamp(28px,4vw,64px)] pt-[calc(var(--nav-h)+24px)] pb-0 min-[880px]:min-h-[calc(100svh+clamp(60px,10vh,140px))] min-[880px]:grid-cols-[1fr_0.92fr] min-[880px]:items-stretch min-[880px]:pb-[clamp(16px,3vh,40px)]"
    >
      {/* Mirror of the About mark, on the other side. */}
      <div aria-hidden="true" className="brand-mark brand-mark--hero">
        <div className="brand-mark-parallax">
          <div className="brand-mark-float">
            <div className="brand-mark-spin">
              {/* priority, even though it is decorative: at 88vw this wash is
                  the largest thing painted above the fold, so it is the LCP
                  element whether or not it means anything. Left to lazy-load,
                  the browser only discovers it once the layout has settled,
                  which is exactly the delay LCP measures. It optimises down to
                  ~43KB from the 1MB source, so preloading it is cheap.

                  The About and menu copies stay lazy: both are below the fold
                  or behind a closed panel. */}
              <Image
                src="/brand/marcmendez-logo.png"
                alt=""
                fill
                priority
                sizes="(max-width: 880px) 130vw, 1100px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* The section is taller than the screen so the photograph can carry on
          past the fold, but the words should not move with it: this column is
          given exactly one viewport of height and centres itself inside that,
          so the headline sits where it always did and only the picture grows. */}
      <div className="min-[880px]:order-1 min-[880px]:flex min-[880px]:h-[calc(100svh-var(--nav-h))] min-[880px]:flex-col min-[880px]:justify-center">
        {/* Word-by-word rather than line-by-line. The line break is kept
            deliberate rather than left to wrapping, so the stagger index
            continues across both lines via `start`. */}
        <h1
          id="hero-heading"
          aria-label="Developer. Marketer."
          className="text-[clamp(2.8rem,6.2vw,6rem)] leading-[0.98] font-semibold tracking-[-0.035em]"
        >
          <span className="block">
            <SplitWords text="Developer." start={0} total={2} />
          </span>
          <span className="block">
            <SplitWords text="Marketer." start={1} total={2} />
          </span>
        </h1>

        {/* Two words, two full-stack disciplines, neither one a modifier on
            the other, so the supporting lines get to be concrete instead of
            explaining the headline back. */}
        <p
          className="fade-up text-soft mt-[clamp(18px,3vh,32px)] max-w-[34ch] text-[clamp(1.05rem,1.55vw,1.3rem)]"
          style={delay(0.5)}
        >
          I build web products end to end, and the growth around them.
        </p>

        <p
          className="fade-up text-mute mt-3.5 max-w-[40ch] text-[clamp(0.95rem,1.2vw,1.05rem)]"
          style={delay(0.58)}
        >
          {/* Not "most teams hire twice for that": headcount framing prices the
              work by what it replaces and reads as an offer to be bought
              cheaply. The argument is that the decisions hold together. */}
          Full-stack MarTech specialist for seven years, across SEO, paid
          acquisition, social media and CRO. Full-stack developer for four,
          shipping the products that marketing points to. The same person
          designs both, not handed between two teams.
        </p>

        {/* The three facts a Swiss recruiter screens on, above the fold and in
            plain text rather than buried in a paragraph. */}
        <ul
          /* A column on a phone, a row on a desktop. Wrapped, the three facts
             broke after "Available" and left the separator dangling at the end
             of the line with nothing after it, which reads as a truncation
             rather than a list. Stacked they also stop competing with the
             headline for the same horizontal space. */
          className="fade-up text-mute mt-[clamp(22px,3.5vh,34px)] flex flex-col items-start gap-y-2.5 text-sm min-[880px]:flex-row min-[880px]:flex-wrap min-[880px]:items-center min-[880px]:gap-x-5 min-[880px]:gap-y-2"
          style={delay(0.66)}
        >
          {/* The three marks are decorative: each sits beside text that already
              says the same thing, so they carry an empty alt and stay out of
              the accessible name.

              Sized by eye, not to one number. The pin and the EU ring are line
              art and the logo is a solid shape, so matching their boxes would
              leave the outlines looking weaker than the mark between them; each
              is set to the size at which it carries the same weight as the 14px
              text beside it. Each is also served at roughly double its display
              size, so the thin strokes survive a retina screen.

              The blue in the files is the accent, and with one palette it stays
              the accent, so nothing needs to recolour them. */}
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="mark-col">
              <Image
                src="/icons/location.png"
                alt=""
                width={36}
                height={36}
                className="size-[17px]"
              />
            </span>
            {hiring.currentLocation.split(',')[0] ?? ''}
          </li>
          <li
            aria-hidden="true"
            className="text-hair hidden min-[880px]:list-item"
          >
            |
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="mark-col">
              <span className="status-mark">
                <Image
                  src="/brand/logo-96.png"
                  alt=""
                  width={12}
                  height={12}
                  className="status-spin size-3"
                />
              </span>
            </span>
            Available
          </li>
          {hiring.workEligibility ? (
            <>
              <li
                aria-hidden="true"
                className="text-hair hidden min-[880px]:list-item"
              >
                |
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="mark-col">
                  <Image
                    src="/icons/eu.png"
                    alt=""
                    width={36}
                    height={36}
                    className="size-[18px]"
                  />
                </span>
                {hiring.workEligibility}
              </li>
            </>
          ) : null}
        </ul>

        <div
          className="fade-up mt-[clamp(26px,4vh,40px)] flex flex-wrap gap-3"
          style={delay(0.74)}
        >
          <a
            href="#work"
            className="wipe-fill border-ink ease-brand hover:border-accent hover:text-on-accent inline-block rounded-full border px-[22px] py-3 text-sm font-medium transition-colors duration-300"
          >
            See the work
          </a>
          {cvPath ? (
            <a
              href={cvPath}
              download
              className="wipe-stroke border-hair text-mute ease-brand hover:text-accent inline-block rounded-full border px-[22px] py-3 text-sm font-medium transition-colors duration-300"
            >
              Download CV
            </a>
          ) : (
            <a
              href="#contact"
              className="wipe-stroke border-hair text-mute ease-brand hover:text-accent inline-block rounded-full border px-[22px] py-3 text-sm font-medium transition-colors duration-300"
            >
              Let&rsquo;s talk
            </a>
          )}
        </div>
      </div>

      {/* A column, not a card floating beside the text.
          `self-stretch` makes it take the full height of the grid row, which on
          this section is the viewport, so the portrait runs from under the
          header to the bottom of the screen and reads as one of the two halves
          of the hero rather than as an illustration set next to it. At 430px
          wide and vertically centred it had white above and below and looked
          like something that had not finished loading.

          Rounded, at the same scale as the footer panel and the About cards.
          Every other surface on this page is round, and a hard-cornered
          rectangle in the middle of them was the one shape that did not belong.

          The caption is gone: it said his name, which the header pill and the
          headline both already say, and the destination city, which the line of
          facts says two lines below it. */}
      {/* Bleeds to the top and right edges of the viewport, and to neither of
          the others. The negative margins cancel exactly the two paddings in
          its way: `--edge` on the section's right, and the nav height reserved
          at its top. `w-auto` at the same breakpoint is what lets that work: a
          grid item with an explicit width is laid out at exactly that width and
          a negative margin only leaves a gap beside it, so the bleed did
          nothing at all until the width went back to being stretched. The bottom keeps the section's padding and the left keeps
          the column gap, so the photograph reads as running off the screen in
          one direction rather than floating in the middle of it. */}
      {/* Full-bleed on a phone too, just in the directions a phone has.
          Boxed at 340px with `--edge` on both sides it read as an illustration
          dropped below the copy, with dead white under it before the next
          section: the one element on the page that looked like a stock
          template. Running it off both edges and down to the section's own
          bottom makes it the end of the hero rather than an attachment to it,
          which is the same argument the desktop bleed is making. */}
      <figure className="fade-up ms-[calc(var(--edge)*-1)] me-[calc(var(--edge)*-1)] mt-[clamp(28px,5vh,48px)] w-auto min-[880px]:order-2 min-[880px]:ms-0 min-[880px]:me-[calc(var(--edge)*-1)] min-[880px]:mt-[calc(var(--nav-h)*-1)] min-[880px]:self-stretch">
        {/* One rounded corner, the only one that is not sitting on a viewport
            edge. Rounding the other three would carve notches out of the screen
            corners; leaving this one square would make the bleed look like an
            overflow bug rather than a decision. */}
        <div className="media-frame bg-placeholder relative aspect-[4/5] h-full overflow-hidden rounded-none rounded-t-[clamp(22px,6vw,34px)] min-[880px]:aspect-auto min-[880px]:w-full min-[880px]:rounded-none min-[880px]:rounded-bl-[clamp(24px,3vw,44px)]">
          {/* Now that the frame is set by the bleed rather than by the
              photograph, its shape moves with the window and `object-cover`
              always has something to trim. `object-position` at 50% 22% is the
              compromise that holds at both extremes: on a tall window it takes
              the excess off the bottom, and on a short one, where the frame
              goes wide and the crop is vertical, it keeps the eyes on the upper
              third instead of sliding the face out of the top. */}
          <Media
            src="/images/marcmendez.jpeg"
            alt={`${site.name}, ${site.role}`}
            sizes="(max-width: 880px) 100vw, 46vw"
            priority
            className="parallax--hero object-[50%_22%]"
          />
        </div>
      </figure>
    </section>
  )
}
