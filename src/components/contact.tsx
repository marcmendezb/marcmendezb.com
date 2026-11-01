import { Reveal } from '@/components/reveal'
import { SplitWords } from '@/components/split-words'
import { site } from '@/content/site'

export function Contact() {
  const { hiring, cvPath } = site

  // Built as one string so the word count that drives the scroll-fill stays
  // correct if the destination city ever changes.
  const heading = `Let’s build something in ${hiring.targetLocation.split(',')[0]}.`
  const headingWords = heading.split(' ').length

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-hair px-edge border-t py-[clamp(70px,14vh,160px)]"
    >
      <Reveal className="reveal">
        {/* Inks in word by word against the scroll position, like the About
            lead. Unlike a <p>, a heading may carry aria-label, so the clean
            sentence reaches assistive tech without a visually-hidden copy. */}
        <h2
          id="contact-heading"
          aria-label={heading}
          data-pace="long"
          className="ink-line max-w-[16ch] text-[clamp(2.2rem,7vw,5.5rem)] leading-[0.98] font-semibold tracking-[-0.035em]"
        >
          <SplitWords text={heading} variant="plain" total={headingWords} />
        </h2>

        <p className="text-soft mt-6 max-w-[48ch]">
          EU citizen, no permit to sort out, available {hiring.availableFrom}.
          Email is the fastest way to reach me. I reply {hiring.responseTime}.
        </p>

        <a
          href={`mailto:${site.email}`}
          className="border-ink ease-brand hover:border-accent hover:text-accent mt-[clamp(22px,4vh,38px)] inline-block border-b-2 pb-1 text-[clamp(1.1rem,2.4vw,1.8rem)] transition-colors duration-300"
        >
          {site.email}
        </a>

        <p className="text-mute mt-4 text-[15px]">
          or{' '}
          <a
            href={`tel:${site.phone.replace(/\s/g, '')}`}
            className="underline-sweep ease-brand hover:text-accent transition-colors duration-300"
          >
            {site.phone}
          </a>
        </p>

        <ul className="text-mute mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
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
          {cvPath ? (
            <li>
              <a
                href={cvPath}
                download
                className="underline-sweep ease-brand hover:text-accent transition-colors duration-300"
              >
                Download CV
                <span className="sr-only"> (PDF)</span>
              </a>
            </li>
          ) : null}
        </ul>
      </Reveal>
    </section>
  )
}
