import Image from 'next/image'
import { Nav } from '@/components/nav'
import { getSite } from '@/content/site'
import { localeTag, type Locale } from '@/i18n/locales'

/**
 * The 404, one per language.
 *
 * One idea and nothing else: the number, set at poster scale in the site's own
 * grotesque, with the brand mark standing in for the zero. The mark is the one
 * chromatic thing on the site, and here it is the only thing that moves once
 * the page has arrived, turning slowly the way it does behind the hero. Beside
 * it, a plain sentence and the way back.
 *
 * A Server Component with no client code: `global-not-found` renders it once
 * per language and shows the one the address asks for.
 */
const copy: Record<
  Locale,
  {
    code: string
    title: string
    lede: string
    cta: string
  }
> = {
  en: {
    code: 'Error 404',
    title: 'This page doesn’t exist.',
    lede: 'It may have moved, or the address was mistyped.',
    cta: 'Back to the homepage',
  },
  de: {
    code: 'Fehler 404',
    title: 'Diese Seite gibt es nicht.',
    lede: 'Vielleicht wurde sie verschoben, oder die Adresse ist falsch geschrieben.',
    cta: 'Zur Startseite',
  },
  es: {
    code: 'Error 404',
    title: 'Esta página no existe.',
    lede: 'Puede que se haya movido o que la dirección esté mal escrita.',
    cta: 'Volver al inicio',
  },
}

export function NotFoundView({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const site = getSite(locale)
  const home = `/${locale}/`

  return (
    <div
      data-nf-locale={locale}
      lang={localeTag[locale]}
      className="nf-page flex-col"
    >
      {/* The site's own header, with its links pointing back at the home
          page's sections. Fixed, as it is there, so the page reserves its
          height. No project list: those buttons scroll the home page's deck,
          which is not on this page. */}
      <Nav locale={locale} projects={[]} home={home} />
      <div aria-hidden="true" className="h-nav shrink-0" />

      <main className="nf-main px-edge flex-1">
        {/* The number is drawing; the label in the copy says it in words. */}
        <div aria-hidden="true" className="nf-num">
          <span className="nf-mask">
            <span
              className="nf-digit"
              style={{ '--d': 0 } as React.CSSProperties}
            >
              4
            </span>
          </span>
          <span className="nf-zero">
            <span className="nf-zero-turn">
              <Image
                src="/brand/marcmendez-logo.png"
                alt=""
                fill
                priority
                sizes="(max-width: 879px) 40vw, 360px"
                className="object-contain"
              />
            </span>
          </span>
          <span className="nf-mask">
            <span
              className="nf-digit"
              style={{ '--d': 2 } as React.CSSProperties}
            >
              4
            </span>
          </span>
        </div>

        <div className="nf-copy">
          <p
            className="nf-in nf-code text-mute text-sm"
            style={{ '--d': 0 } as React.CSSProperties}
          >
            {t.code}
          </p>
          <h1
            className="nf-in nf-title mt-3"
            style={{ '--d': 1 } as React.CSSProperties}
          >
            {t.title}
          </h1>
          <p
            className="nf-in text-soft mt-3 max-w-[34ch] text-[15px] leading-relaxed"
            style={{ '--d': 2 } as React.CSSProperties}
          >
            {t.lede}
          </p>
          <a
            href={home}
            className="nf-in nf-cta wipe-fill border-ink ease-brand hover:border-accent hover:text-on-accent mt-7 inline-flex w-fit items-center gap-3 rounded-full border px-[22px] py-3 text-sm font-medium transition-colors duration-300"
            style={{ '--d': 3 } as React.CSSProperties}
          >
            {t.cta}
            <span aria-hidden="true" className="nf-cta-arrow">
              →
            </span>
          </a>
        </div>
      </main>

      {/* The footer, reduced to one line. The full panel is the heaviest
          block on the site: here it took a third of the screen from the one
          thing this page is for, and its index repeated the header right
          above. What stays is what a recruiter would come back for: the
          profiles and the address. On the page's own ground, under a
          hairline, the way every section on the site begins. */}
      <footer className="nf-foot px-edge shrink-0">
        <div
          className="nf-in nf-foot-row"
          style={{ '--d': 4 } as React.CSSProperties}
        >
          <ul className="nf-foot-links">
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
            <li>
              <a
                href={`mailto:${site.email}`}
                className="underline-sweep ease-brand hover:text-accent transition-colors duration-300"
              >
                {site.email}
              </a>
            </li>
          </ul>
          {/* Rendered on the server: a static year, no hydration mismatch. */}
          <p className="text-mute">
            &copy; {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </footer>
    </div>
  )
}
