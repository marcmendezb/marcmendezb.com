import Image from 'next/image'
import { site } from '@/content/site'

/**
 * The last thing a recruiter sees, and the only place on the page that changes
 * ground.
 *
 * Four columns rather than two. Two blocks of narrow content in a panel this
 * wide leaves the middle empty however they are aligned — the gap has to go
 * somewhere, and pushing it to the edges just pools it. Splitting the same
 * space into four even tracks puts the whitespace inside the columns, where it
 * reads as air instead of as a hole.
 *
 * The profiles are back. Cutting them was an over-correction: what Marc asked
 * not to repeat was the "Get in touch" button, not every way of reaching him,
 * and a footer that lists where else to find someone is doing its job rather
 * than restating a call to action.
 *
 * It still closes on the three facts a Swiss recruiter screens for. They open
 * the page under the headline and they close it here, which is the one piece of
 * repetition that earns itself: someone who skimmed the middle still leaves
 * knowing where he is, when he is free, and that there is no permit to arrange.
 */
export function Footer() {
  const { hiring } = site

  return (
    <footer className="px-edge pt-[clamp(20px,3vh,44px)] pb-[clamp(16px,2.5vh,32px)]">
      {/* `isolate` and `overflow-hidden` together: the first gives the panel a
          stacking context of its own so the wash inside cannot escape behind
          it, the second clips that wash to the rounded corners.

          The padding is asymmetric on purpose. Matched top and bottom, the 57px
          that gives the four columns room to start also sat under a single 13px
          line of copyright, where it read as the panel having been left open at
          the end. The top still needs it; the bottom needs about half. */}
      <div className="footer-panel relative isolate overflow-hidden rounded-[clamp(28px,4vw,56px)] px-[clamp(24px,4vw,60px)] pt-[clamp(40px,6vh,72px)] pb-[clamp(20px,2.6vh,30px)]">
        {/* The same mark that sits behind the hero and About, a third time and
            last, held down to a whisper so it tints the panel without competing
            with the type sitting on it. */}
        <div aria-hidden="true" className="brand-mark brand-mark--footer">
          <div className="brand-mark-parallax">
            <div className="brand-mark-float">
              <div className="brand-mark-spin">
                <Image
                  src="/brand/marcmendez-logo.png"
                  alt=""
                  fill
                  sizes="(max-width: 880px) 120vw, 620px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          {/* Two columns from the smallest screen up, four once there is room.
              A single column stacked Index, Elsewhere and Availability into a
              column of three short lists with a hand's width of nothing between
              each — a footer half a screen taller than its contents, on the one
              device where height is the scarce thing. Index and Elsewhere are
              two and three words wide; they were never going to need a whole
              phone each. */}
          <div className="grid grid-cols-2 gap-x-[clamp(24px,3vw,48px)] gap-y-[clamp(34px,4vw,48px)] min-[900px]:grid-cols-4">
            {/* --- Signature ------------------------------------------------ */}
            <div className="col-span-2 min-[900px]:col-span-1">
              <a
                href="#hero"
                className="ease-brand hover:text-accent inline-flex items-center gap-3 transition-colors duration-300"
              >
                <Image
                  src="/brand/logo-96.png"
                  alt=""
                  width={96}
                  height={96}
                  className="size-[clamp(28px,2.4vw,34px)] shrink-0"
                />
                <span className="text-[clamp(1.35rem,2vw,1.7rem)] font-semibold tracking-[-0.03em]">
                  {site.name}
                </span>
              </a>
              <p className="text-mute mt-2.5 text-sm">{site.role}</p>

              {/* A real link to #hero rather than a scroll-to-zero button: it
                  goes through the same handler every other in-page link uses,
                  so it eases, it moves focus, it leaves the address bar alone,
                  and it still works with the JavaScript off. */}
              <a
                href="#hero"
                className="wipe-stroke border-hair text-mute ease-brand hover:text-accent mt-7 inline-block rounded-full border px-[20px] py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-300"
              >
                Back to top
              </a>
            </div>

            {/* --- Index ---------------------------------------------------- */}
            {/* "Index", not "Sections". The header's pill nav is already a
                navigation landmark named Sections, and two landmarks of the
                same role sharing a name is a real navigation problem rather
                than a lint: a screen reader lists the page's landmarks and
                offers two identical entries with no way to tell them apart. */}
            <nav aria-labelledby="footer-index">
              <h2 id="footer-index" className="footer-label">
                Index
              </h2>
              <ul className="mt-5 flex flex-col gap-3 text-[15px]">
                {site.nav.map((item) => (
                  <li key={item.section}>
                    <a
                      href={`#${item.section}`}
                      className="underline-sweep ease-brand hover:text-accent transition-colors duration-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* --- Elsewhere ------------------------------------------------ */}
            {/* Not wrapped in <nav>: these leave the site, and a third
                navigation landmark would be one more thing to step past for
                anyone browsing by landmark. */}
            <div>
              <h2 id="footer-elsewhere" className="footer-label">
                Elsewhere
              </h2>
              <ul
                aria-labelledby="footer-elsewhere"
                className="mt-5 flex flex-col gap-3 text-[15px]"
              >
                {site.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener me"
                      className="underline-sweep ease-brand hover:text-accent transition-colors duration-300"
                    >
                      {social.label}
                      <span className="sr-only">: {social.description}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* --- Availability --------------------------------------------- */}
            {/* Full width below the other two rather than beside them: "EU
                citizen, no Swiss permit needed" in half a phone is four ragged
                lines. */}
            <div className="col-span-2 min-[560px]:col-span-1">
              <h2 id="footer-availability" className="footer-label">
                Availability
              </h2>
              {/* The route line lives under the headline and in the mobile
                  menu; here it was the third time on one screen, counting the
                  Contact copy right above. Stacked rather than strung together
                  with separators: down here these are a summary to be read, not
                  a strapline to be skimmed. */}
              <ul
                aria-labelledby="footer-availability"
                className="text-soft mt-5 flex flex-col gap-3 text-sm"
              >
                <li className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="mark-col">
                    <span className="status-mark">
                      <Image
                        src="/brand/logo-96.png"
                        alt=""
                        width={24}
                        height={24}
                        className="status-spin size-3"
                      />
                    </span>
                  </span>
                  Available {hiring.availableFrom}
                </li>
                {hiring.workEligibility ? (
                  <li className="flex items-start gap-2.5">
                    <span aria-hidden="true" className="mark-col mt-px">
                      <Image
                        src="/icons/eu.png"
                        alt=""
                        width={36}
                        height={36}
                        className="mark-invert size-[18px]"
                      />
                    </span>
                    {hiring.workEligibility}
                  </li>
                ) : null}
              </ul>
            </div>
          </div>

          {/* One centred line. With the credit line gone there is nothing to
              sit opposite, and a lone notice pushed to the left edge of a
              full-width rule reads as the other half having fallen off. */}
          <p className="border-hair text-mute mt-[clamp(36px,6vh,64px)] border-t pt-6 text-center text-[13px]">
            {/* Rendered on the server, so this is a static string in the HTML —
                no hydration mismatch from the client's clock disagreeing with
                the server's, which is the classic `new Date()`-in-a-footer
                bug. */}
            &copy; {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </div>
    </footer>
  )
}
