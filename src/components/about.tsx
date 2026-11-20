import Image from 'next/image'
import { Emphasis } from '@/components/emphasis'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { SplitWords } from '@/components/split-words'
import { getLearning, getTimeline } from '@/content/projects'
import { getSite } from '@/content/site'
import type { Locale } from '@/i18n/locales'

const title: Record<Locale, string> = {
  en: 'About',
  de: 'Über mich',
  es: 'Sobre mí',
}

const lead: Record<Locale, string> = {
  en: 'I build the product and the growth around it.',
  de: 'Ich baue das Produkt und das Wachstum darum herum.',
  es: 'Construyo el producto y el crecimiento a su alrededor.',
}

const paragraph1: Record<Locale, string> = {
  en: 'Most people who build web products pick up conversion later, as something bolted on once the thing works. I came at it from both sides: seven years as a full-stack MarTech specialist, three as a full-stack developer, with neither one supporting the other. So **conversion is already in the structure when I build**, not retrofitted after launch: what the page is for, what it asks of you, what happens after you say yes.',
  de: 'Die meisten, die Webprodukte bauen, kümmern sich erst später um Konversion, als etwas, das nachträglich angeflanscht wird, sobald die Sache funktioniert. Ich kam von beiden Seiten: sieben Jahre als Full-Stack-MarTech-Spezialist, drei als Full-Stack-Entwickler, wobei keiner dem anderen untergeordnet war. **Konversion steckt deshalb schon in der Struktur, wenn ich baue**, nicht nachträglich eingebaut nach dem Launch: wofür die Seite da ist, was sie von dir verlangt, was passiert, nachdem du Ja gesagt hast.',
  es: 'La mayoría de quienes construyen productos web se ocupan de la conversión más tarde, como algo añadido una vez que la cosa ya funciona. Yo llegué desde los dos lados: siete años como especialista full-stack en MarTech, tres como desarrollador full-stack, sin que uno dependiera del otro. Por eso **la conversión ya está en la estructura cuando construyo**, no añadida después del lanzamiento: para qué sirve la página, qué te pide, qué pasa después de que dices que sí.',
}

const paragraph2: Record<Locale, string> = {
  en: 'It shows up as coherence. The positioning, the site, the product and the ads all answer to one idea, instead of three people each defending their own piece of it.',
  de: 'Das zeigt sich als Kohärenz. Positionierung, Website, Produkt und Anzeigen folgen alle derselben Idee, statt dass drei Leute jeweils ihr eigenes Stück verteidigen.',
  es: 'Esto se traduce en coherencia. El posicionamiento, el sitio, el producto y los anuncios responden todos a una misma idea, en lugar de tres personas defendiendo cada una su propio trozo.',
}

/* The freelance years, framed as ownership rather than as a gap between jobs:
   leading the work and being the person the client deals with is the part a
   hiring manager can't see from the project cards. Split into the parts the
   band sets differently: a label, the claim in display type, the detail, and
   a way to act on it. */
const freelanceLabel: Record<Locale, string> = {
  en: 'Freelance & contract',
  de: 'Freiberuflich & auf Vertragsbasis',
  es: 'Freelance y por contrato',
}

const freelanceClaim: Record<Locale, string> = {
  en: 'I’ve led projects end to end as a freelancer, as the client’s direct point of contact.',
  de: 'Als Freelancer habe ich Projekte von Anfang bis Ende geleitet, als direkter Ansprechpartner der Kunden.',
  es: 'He liderado proyectos de principio a fin como freelance, siendo el interlocutor directo del cliente.',
}

const freelanceDetail: Record<Locale, string> = {
  en: 'From scoping and priorities through to launch and what comes after. Where it suits a team better than a permanent hire, **I’m open to working on a freelance or contract basis**.',
  de: 'Vom Scoping und den Prioritäten bis zum Launch und darüber hinaus. Wo es für ein Team besser passt als eine Festanstellung, **arbeite ich auch freiberuflich oder auf Vertragsbasis**.',
  es: 'Desde definir el alcance y las prioridades hasta el lanzamiento y lo que viene después. Si a un equipo le encaja mejor que una contratación fija, **también estoy abierto a colaborar como freelance o por contrato**.',
}

const freelanceAction: Record<Locale, string> = {
  en: 'Discuss a project',
  de: 'Projekt besprechen',
  es: 'Hablemos de un proyecto',
}

const backgroundLabel: Record<Locale, string> = {
  en: 'Background',
  de: 'Werdegang',
  es: 'Trayectoria',
}

const educationLabel: Record<Locale, string> = {
  en: 'Education',
  de: 'Ausbildung',
  es: 'Formación',
}

const languagesLabel: Record<Locale, string> = {
  en: 'Languages',
  de: 'Sprachen',
  es: 'Idiomas',
}

const currentlyLearningLabel: Record<Locale, string> = {
  en: 'Currently learning',
  de: 'Aktuell am Lernen',
  es: 'Actualmente aprendiendo',
}

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
export function About({ locale }: { locale: Locale }) {
  const site = getSite(locale)
  const timeline = getTimeline(locale)
  const learning = getLearning(locale)
  const { hiring, languages, education } = site

  const availableLine: Record<Locale, string> = {
    en: `available ${hiring.availableFrom}`,
    de: `verfügbar ab ${hiring.availableFrom}`,
    es: `disponible desde ${hiring.availableFrom}`,
  }

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
        title={title[locale]}
        meta={hiring.currentLocation.split(',')[0] ?? ''}
      />

      {/* Band 1: the statement, then the argument behind it. */}
      <div className="grid grid-cols-1 gap-x-[clamp(24px,5vw,64px)] gap-y-8 min-[880px]:grid-cols-[0.85fr_1.15fr]">
        {/* The signature moment: this inks in word by word against the scroll
            position, so it writes itself as you arrive at it. */}
        <p className="ink-line block max-w-[16ch] text-[clamp(1.5rem,3vw,2.4rem)] leading-[1.15] font-semibold tracking-[-0.02em]">
          {/* A <p> has role=paragraph, which prohibits aria-label, so the
              sentence is exposed once as a visually-hidden string instead. */}
          <span className="sr-only">{lead[locale]}</span>
          <SplitWords
            text={lead[locale]}
            variant="plain"
            total={lead[locale].split(' ').length}
          />
        </p>

        <Reveal className="reveal">
          {/* Deliberately does not retell the timeline below it. The dates are
              in the next band; this is the part the dates don't explain. */}
          <div className="text-soft max-w-[52ch] space-y-4">
            <p>
              <Emphasis text={paragraph1[locale]} />
            </p>
            <p>{paragraph2[locale]}</p>
            <p>
              {locale === 'de' ? (
                <>
                  Ursprünglich aus {hiring.origin.split(',')[0]}, wohne ich
                  bereits in der Nähe von {hiring.targetLocation.split(',')[0]},{' '}
                  <strong className="text-ink font-medium">
                    {availableLine[locale]}
                  </strong>
                  , ohne Bewilligung oder Umzug zu klären. {site.openTo}
                </>
              ) : locale === 'es' ? (
                <>
                  Originario de {hiring.origin.split(',')[0]}, ya vivo cerca de{' '}
                  {hiring.targetLocation.split(',')[0]},{' '}
                  <strong className="text-ink font-medium">
                    {availableLine[locale]}
                  </strong>
                  , sin permiso ni traslado que resolver. {site.openTo}
                </>
              ) : (
                <>
                  Originally from {hiring.origin.split(',')[0]}, I&rsquo;m based
                  near {hiring.targetLocation.split(',')[0]} already,{' '}
                  <strong className="text-ink font-medium">
                    {availableLine[locale]}
                  </strong>
                  , with no permit or relocation to sort out. {site.openTo}
                </>
              )}
            </p>
          </div>
        </Reveal>
      </div>

      {/* Band 2: freelance, as a band of its own.

          It used to sit inside the prose as a boxed paragraph, which broke the
          argument in two, and then in a corner of the left column, where it
          was easy to pass. Here it heads the cluster of cards that follows (it
          wears the roadmap's frame, the capsule hairline over the brand mark),
          so it reads as one of the facts About is built from, first in line,
          rather than as an aside.

          In the footer's material, not the cards' pale one: on the same white
          as its neighbours it dissolved into them. The dark panel is what the
          page already uses for the pieces it wants found (the footer, the
          confidential work), so it lifts this one out of the cluster without a
          colour the page doesn't have. `.footer-panel` brings the inverted
          tokens with it, so the label, the claim, the bold and the link's rule
          and hover all follow without being told.

          Two halves. The claim in display type with its label, for the reader
          who only scans; the detail and a way to act on it, for the one who
          stops. Bottom-aligned, so the link sits level with the claim's last
          line and the band closes on a single edge. */}
      <Reveal
        className="reveal footer-panel relative isolate mt-[clamp(40px,6vw,72px)] grid grid-cols-1 gap-x-[clamp(24px,5vw,72px)] gap-y-6 overflow-hidden rounded-[clamp(24px,3.5vw,44px)] px-[clamp(24px,4vw,52px)] py-[clamp(28px,4vw,48px)] min-[880px]:grid-cols-[1.05fr_1fr] min-[880px]:items-end"
        as="div"
      >
        {/* The footer's mark, at the footer's whisper. */}
        <div aria-hidden="true" className="brand-mark brand-mark--footer">
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

        <div className="relative z-10">
          <h3 className="text-mute flex items-center gap-2.5 text-sm font-medium">
            <span aria-hidden="true" className="status-mark">
              <Image
                src="/brand/logo-96.png"
                alt=""
                width={12}
                height={12}
                className="status-spin size-3"
              />
            </span>
            {freelanceLabel[locale]}
          </h3>
          <p className="text-ink mt-3.5 max-w-[26ch] text-[clamp(1.3rem,2.2vw,1.85rem)] leading-[1.2] font-semibold tracking-[-0.02em] text-balance">
            {freelanceClaim[locale]}
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-soft max-w-[48ch]">
            <Emphasis text={freelanceDetail[locale]} />
          </p>
          {/* The project cards' link, rule and all: same gesture, same
              place it leads (the email and the phone number). */}
          <a
            href="#contact"
            className="group/link ease-brand hover:text-accent mt-5 inline-flex items-center gap-2.5 text-[15px] font-medium transition-colors duration-400"
          >
            {freelanceAction[locale]}
            <span
              aria-hidden="true"
              className="bg-ink ease-brand group-hover/link:bg-accent block h-px w-[26px] transition-[width,background-color] duration-400 group-hover/link:w-[44px]"
            />
          </a>
        </div>
      </Reveal>

      {/* Band 3: the background as a roadmap.

          A grey track draws in left to right with a node at each date, then
          blue runs along it in sequence and clears, on a loop. The three
          milestones read as one progression rather than three separate facts.

          The cells sit flush with no gap: that's what keeps the segments
          joining into a single continuous line. The text inside them is what
          gets the right padding, not the cell. */}
      <Reveal
        className="reveal border-hair bg-surface/60 mt-[clamp(16px,2vw,28px)] rounded-[clamp(24px,3.5vw,44px)] border px-[clamp(24px,4vw,52px)] py-[clamp(28px,4vw,52px)] backdrop-blur-2xl"
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
        <h3 className="sr-only">{backgroundLabel[locale]}</h3>
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

      {/* Band 4: the checkable facts, three abreast.

          The gap above this is deliberately larger than the one above the
          roadmap. At equal spacing the two bands read as one block, and the
          facts looked like a fourth roadmap column. Separation has to say
          "different kind of content", not just "next row". */}
      {/* Three panels in the roadmap's clothing: same hairline, same translucent
          surface over the brand mark, same blur. A smaller radius though: a
          capsule curve on a box this narrow would eat its own corners. The
          inner rules lose their top border because the panel edge already does
          that job.

          The gap above matches the gap between the cards, so the four panels
          read as one cluster with the freelance band and the roadmap rather than as a separate afterthought. */}
      <Reveal className="reveal mt-[clamp(16px,2vw,28px)] grid grid-cols-1 items-start gap-[clamp(16px,2vw,28px)] min-[720px]:grid-cols-3">
        <div className="border-hair bg-surface/60 rounded-[clamp(24px,3.5vw,44px)] border px-[clamp(20px,2.4vw,32px)] py-[clamp(20px,2.2vw,28px)] backdrop-blur-2xl">
          <h3 className="mb-3 text-sm font-medium">{educationLabel[locale]}</h3>
          <dl>
            {education.map((entry) => (
              <div
                key={entry.qualification}
                className="border-hair gap-4 border-t py-2.5"
              >
                <dt className="text-sm">{entry.qualification}</dt>
                <dd className="text-mute mt-0.5 text-sm">
                  {entry.country}
                  {entry.status ? `, ${entry.status}` : ''}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-hair bg-surface/60 rounded-[clamp(24px,3.5vw,44px)] border px-[clamp(20px,2.4vw,32px)] py-[clamp(20px,2.2vw,28px)] backdrop-blur-2xl">
          <h3 className="mb-3 text-sm font-medium">{languagesLabel[locale]}</h3>
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
          <h3 className="mb-3 text-sm font-medium">
            {currentlyLearningLabel[locale]}
          </h3>
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
