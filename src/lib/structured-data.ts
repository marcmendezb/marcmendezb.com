import { getDisciplines, getProjects } from '@/content/projects'
import { getSite } from '@/content/site'
import { emphasisPlain } from '@/lib/emphasis'
import type { Locale } from '@/i18n/locales'
import { localeTag } from '@/i18n/locales'

/**
 * Schema.org JSON-LD.
 *
 * This is what lets Google resolve "Marc Mendez" to a person rather than a
 * string, and it's what feeds the knowledge panel and the AI answer engines
 * recruiters increasingly search through. It costs ~1KB and is the single
 * highest-leverage SEO addition to a personal site.
 *
 * One schema per locale, matching whichever language the page it's embedded
 * in actually renders: a JSON-LD block that describes an English jobTitle
 * under a German page is a mismatch a search engine can penalise rather than
 * resolve.
 */
export function buildPersonSchema(locale: Locale) {
  const site = getSite(locale)
  const { hiring } = site

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${site.url}/#person`,
    name: site.name,
    jobTitle: site.role,
    description: site.description,
    url: `${site.url}/${locale}`,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    // `sameAs` is how a search engine links this page to your other profiles.
    sameAs: site.socials.map((social) => social.href),
    knowsAbout: getDisciplines(locale).flatMap(
      (discipline) => discipline.tools,
    ),
    knowsLanguage: site.languages.map((language) => ({
      '@type': 'Language',
      name: language.name,
    })),
    nationality: { '@type': 'Country', name: 'Spain' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: hiring.currentLocation.split(',')[0]?.trim(),
      addressCountry: 'CH',
    },
    workLocation: {
      '@type': 'Place',
      name: hiring.targetLocation,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Zürich',
        addressCountry: 'CH',
      },
    },
  }
}

/**
 * The page itself, tied back to the Person node above via `mainEntity`.
 */
export function buildWebSiteSchema(locale: Locale) {
  const site = getSite(locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site.url}/${locale}#website`,
    url: `${site.url}/${locale}`,
    name: `${site.name} | ${site.role}`,
    description: site.description,
    inLanguage: localeTag[locale],
    mainEntity: { '@id': `${site.url}/#person` },
  }
}

/**
 * Each project as a CreativeWork, so the work section is machine-readable too.
 * Projects without a live URL are still listed; the link is simply omitted.
 */
export function buildWorkSchema(locale: Locale) {
  const site = getSite(locale)

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Selected work',
    itemListElement: getProjects(locale).map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        // Stripped: the markers are typography for the page, and this
        // field is published to search engines.
        description: emphasisPlain(project.description),
        ...(project.year ? { dateCreated: project.year } : {}),
        keywords: project.tags.join(', '),
        creator: { '@id': `${site.url}/#person` },
        // `url` takes the primary link; the rest ride along in `sameAs`,
        // which is the schema.org way to say "this thing also lives here".
        //
        // Filtered first. A card may carry a link whose destination does not
        // exist yet, and publishing `"url": null` to a search engine is worse
        // than publishing nothing.
        ...(() => {
          const live = project.links.filter(
            (link): link is { label: string; href: string } =>
              link.href !== null,
          )
          const [primary, ...rest] = live
          return {
            ...(primary ? { url: primary.href } : {}),
            ...(rest.length > 0
              ? { sameAs: rest.map((link) => link.href) }
              : {}),
          }
        })(),
      },
    })),
  }
}

/**
 * Serialise for injection into a <script type="application/ld+json"> tag.
 *
 * `<` is escaped so a stray angle bracket in any content field can't close the
 * script tag early: the classic JSON-LD injection hole.
 */
export function serialiseSchema(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}
