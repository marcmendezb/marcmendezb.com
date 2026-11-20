import { Emphasis } from '@/components/emphasis'
import { Reveal } from '@/components/reveal'
import { SplitWords } from '@/components/split-words'
import { getSite } from '@/content/site'
import type { Locale } from '@/i18n/locales'

const buildHeading = (city: string, locale: Locale): string => {
  switch (locale) {
    case 'de':
      return `Lass uns etwas in ${city} bauen.`
    case 'es':
      return `Construyamos algo en ${city}.`
    default:
      return `Let’s build something in ${city}.`
  }
}

const intro = (
  availableFrom: string,
  responseTime: string,
  locale: Locale,
): string => {
  switch (locale) {
    case 'de':
      return `**EU-Bürger, keine Bewilligung zu klären, verfügbar ab ${availableFrom}**. E-Mail ist der schnellste Weg, mich zu erreichen. Ich antworte ${responseTime}.`
    case 'es':
      return `**Ciudadano de la UE, sin permiso que resolver, disponible desde ${availableFrom}**. El correo es la forma más rápida de contactarme. Respondo ${responseTime}.`
    default:
      return `**EU citizen, no permit to sort out, available ${availableFrom}**. Email is the fastest way to reach me. I reply ${responseTime}.`
  }
}

const or: Record<Locale, string> = { en: 'or', de: 'oder', es: 'o' }

/** Leading space included: a bare {' '} gets collapsed out of the name. */
const whatsappHint: Record<Locale, string> = {
  en: ' (message me, opens in a new tab)',
  de: ' (Nachricht schreiben, öffnet in einem neuen Tab)',
  es: ' (escríbeme, se abre en una pestaña nueva)',
}

const downloadCV: Record<Locale, string> = {
  en: 'Download CV',
  de: 'CV herunterladen',
  es: 'Descargar CV',
}

export function Contact({ locale }: { locale: Locale }) {
  const site = getSite(locale)
  const { hiring, cvPath } = site

  // Built as one string so the word count that drives the scroll-fill stays
  // correct if the destination city or language ever changes.
  const heading = buildHeading(
    hiring.targetLocation.split(',')[0] ?? '',
    locale,
  )
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
          <Emphasis
            text={intro(hiring.availableFrom, hiring.responseTime, locale)}
          />
        </p>

        <a
          href={`mailto:${site.email}`}
          className="border-ink ease-brand hover:border-accent hover:text-accent mt-[clamp(22px,4vh,38px)] inline-block border-b-2 pb-1 text-[clamp(1.1rem,2.4vw,1.8rem)] transition-colors duration-300"
        >
          {site.email}
        </a>

        {/* The number once, two ways to use it: a call, or a message on
            WhatsApp, which is how a lot of recruiters reach candidates
            abroad first. Same sweep, same size, so neither reads as the
            fallback. */}
        <p className="text-mute mt-4 text-[15px]">
          {or[locale]}{' '}
          <a
            href={site.tel}
            className="underline-sweep ease-brand hover:text-accent transition-colors duration-300"
          >
            {site.phone}
          </a>
          <span aria-hidden="true" className="text-hair mx-2.5">
            |
          </span>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noreferrer noopener"
            className="underline-sweep ease-brand hover:text-accent transition-colors duration-300"
          >
            WhatsApp
            <span className="sr-only">{whatsappHint[locale]}</span>
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
                {downloadCV[locale]}
                <span className="sr-only"> (PDF)</span>
              </a>
            </li>
          ) : null}
        </ul>
      </Reveal>
    </section>
  )
}
