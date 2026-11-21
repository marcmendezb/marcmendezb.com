import type { Locale } from '@/i18n/locales'

/**
 * Single source of truth for everything personal on this site.
 *
 * Components never hard-code names, URLs or copy: they call `getSite(locale)`
 * and read from the result. Editing this file is the only thing you need to
 * do to keep the site current, in all three languages at once.
 *
 * Fields typed `| null` are ones that must not be guessed. They render nothing
 * until you fill them in, so an unfinished field is invisible rather than
 * wrong. `pnpm dev` prints a checklist of everything still unset, checked
 * against the English copy only: nullability doesn't vary by language.
 */

export type NavLink = {
  /** Visible label. */
  label: string
  /** Target section id, without the leading `#`. */
  section: string
}

export type SocialLink = {
  label: string
  href: string
  /** Shown to screen readers in place of the bare label. */
  description: string
}

export type Language = {
  name: string
  level: string
}

export type EducationEntry = {
  /** The kind of qualification, e.g. "Higher Vocational Diploma". */
  level: string
  /** The subject, e.g. "Web Application Development". */
  field: string
  country: string
  /**
   * The awarding school or university. Never rendered on the page, by
   * decision: the names belong on the CV, which goes to each company
   * directly. Kept here only so the data is complete in one place.
   */
  institution: string | null
  /**
   * A short note shown as a tag on the entry, e.g. "not completed" or
   * "starts February 2026". Omit for a plain finished qualification.
   */
  status?: string
  /**
   * What the status means, for the node on the education rail: a hollow ring
   * for one still to start, a faint one for one left unfinished, a filled dot
   * for everything completed. Locale-independent, unlike `status`.
   */
  state?: 'upcoming' | 'incomplete'
}

/** Everything that reads differently per language. */
type LocalizedSite = {
  /**
   * Used in <title>, OG tags and the JSON-LD `jobTitle`.
   *
   * Both named outright rather than one leading. Seven years in marketing
   * and three building products are different tenures, but neither is the
   * "real" job with the other bolted on, and a recruiter searching either
   * term on its own should still land on this page.
   *
   * "MarTech specialist", not "marketing technologist": it's the literal
   * string Swiss postings use for this (PwC's Marketing Technology Lead,
   * Salesforce's MarTech-focused Marketing Architect, Source Group's
   * MarTech Engineer, all Zürich), and it's what the `<title>` tag, the OG
   * card and the JSON-LD `jobTitle` all inherit from this one field. Kept
   * as the English loanword in German and Spanish too: that's how the term
   * is actually used in both markets, not translated.
   */
  role: string
  /** <150 chars. What Google shows, and what appears when someone pastes the link. */
  description: string
  socials: readonly [linkedin: string, github: string]
  hiring: {
    origin: string
    availableFrom: string
    workArrangement: string
    workEligibility: string
    responseTime: string
  }
  education: readonly Omit<EducationEntry, 'institution'>[]
  languages: readonly { name: string; level: string }[]
  openTo: string
  nav: readonly [whatIDo: string, work: string, about: string]
}

/**
 * Awarding institution per education entry, same order as the `education`
 * arrays below. A proper noun, so it doesn't vary by locale; kept separate
 * rather than repeated inside all three `education` arrays.
 */
const educationInstitutions: readonly (string | null)[] = [
  'Universidad Internacional de Valencia (VIU)',
  null,
  null,
  null,
  null,
]

const localized: Record<Locale, LocalizedSite> = {
  en: {
    role: 'Full-stack developer & MarTech specialist',
    description:
      'Full-stack developer and MarTech specialist. Seven years in marketing, three building products. Based near Zürich, available now.',
    socials: ['LinkedIn profile', 'GitHub profile'],
    hiring: {
      origin: 'Barcelona, Spain',
      availableFrom: 'now',
      workArrangement: 'On-site, hybrid or remote',
      workEligibility: 'EU citizen, no Swiss permit needed',
      responseTime: 'within 24 hours',
    },
    education: [
      {
        level: 'Bachelor’s degree (BSc)',
        field: 'Data Science and Artificial Intelligence',
        country: 'Spain',
        status: 'starts February 2026',
        state: 'upcoming',
      },
      {
        level: 'Higher Vocational Diploma',
        field: 'Web Application Development',
        country: 'Spain',
      },
      {
        level: 'Higher Vocational Diploma',
        field: 'Marketing and Advertising',
        country: 'Spain',
      },
      {
        level: 'Intermediate Vocational Diploma',
        field: 'Administrative Assistance',
        country: 'Spain',
      },
      {
        level: 'Bachelor’s degree (BA)',
        field: 'Public Relations, Marketing and Advertising',
        country: 'Spain',
        status: 'not completed',
        state: 'incomplete',
      },
    ],
    languages: [
      { name: 'Spanish', level: 'Native' },
      { name: 'Catalan', level: 'Native' },
      { name: 'English', level: 'Professional (B2)' },
      { name: 'German', level: 'Learning (A1)' },
    ],
    openTo: 'Marketing roles, development roles, or both.',
    nav: ['What I do', 'Work', 'About'],
  },
  de: {
    role: 'Full-Stack-Entwickler & MarTech-Spezialist',
    description:
      'Full-Stack-Entwickler und MarTech-Spezialist. Sieben Jahre Marketing, drei Jahre Produktentwicklung. Wohnhaft bei Zürich, ab sofort verfügbar.',
    socials: ['LinkedIn-Profil', 'GitHub-Profil'],
    hiring: {
      origin: 'Barcelona, Spanien',
      availableFrom: 'sofort',
      workArrangement: 'Vor Ort, hybrid oder remote',
      workEligibility: 'EU-Bürger, keine Schweizer Bewilligung nötig',
      responseTime: 'innerhalb von 24 Stunden',
    },
    education: [
      {
        level: 'Bachelor (BSc)',
        field: 'Data Science und künstliche Intelligenz',
        country: 'Spanien',
        status: 'Start Februar 2026',
        state: 'upcoming',
      },
      {
        level: 'Höhere Fachausbildung',
        field: 'Webentwicklung',
        country: 'Spanien',
      },
      {
        level: 'Höhere Fachausbildung',
        field: 'Marketing und Werbung',
        country: 'Spanien',
      },
      {
        level: 'Mittlere Fachausbildung',
        field: 'Büroassistenz',
        country: 'Spanien',
      },
      {
        level: 'Bachelor (BA)',
        field: 'Public Relations, Marketing und Werbung',
        country: 'Spanien',
        status: 'nicht abgeschlossen',
        state: 'incomplete',
      },
    ],
    languages: [
      { name: 'Spanisch', level: 'Muttersprache' },
      { name: 'Katalanisch', level: 'Muttersprache' },
      { name: 'Englisch', level: 'Fliessend (B2)' },
      { name: 'Deutsch', level: 'Lernend (A1)' },
    ],
    openTo: 'Marketing-Rollen, Entwicklungs-Rollen, oder beides.',
    nav: ['Leistungen', 'Projekte', 'Über mich'],
  },
  es: {
    role: 'Desarrollador full-stack y especialista en MarTech',
    description:
      'Desarrollador full-stack y especialista en MarTech. Siete años en marketing, tres construyendo productos. Vivo cerca de Zúrich, disponible ya.',
    socials: ['Perfil de LinkedIn', 'Perfil de GitHub'],
    hiring: {
      origin: 'Barcelona, España',
      availableFrom: 'ya',
      workArrangement: 'Presencial, híbrido o remoto',
      workEligibility: 'Ciudadano de la UE, sin permiso suizo necesario',
      responseTime: 'en menos de 24 horas',
    },
    education: [
      {
        level: 'Grado universitario',
        field: 'Ciencia de Datos e Inteligencia Artificial',
        country: 'España',
        status: 'empieza en febrero de 2026',
        state: 'upcoming',
      },
      {
        level: 'Ciclo Formativo de Grado Superior',
        field: 'Desarrollo de Aplicaciones Web',
        country: 'España',
      },
      {
        level: 'Ciclo Formativo de Grado Superior',
        field: 'Marketing y Publicidad',
        country: 'España',
      },
      {
        level: 'Ciclo Formativo de Grado Medio',
        field: 'Gestión Administrativa',
        country: 'España',
      },
      {
        level: 'Grado universitario',
        field: 'Relaciones Públicas, Marketing y Publicidad',
        country: 'España',
        status: 'sin terminar',
        state: 'incomplete',
      },
    ],
    languages: [
      { name: 'Español', level: 'Nativo' },
      { name: 'Catalán', level: 'Nativo' },
      { name: 'Inglés', level: 'Profesional (B2)' },
      { name: 'Alemán', level: 'Aprendiendo (A1)' },
    ],
    openTo: 'Roles de marketing, de desarrollo, o ambos.',
    nav: ['Qué hago', 'Proyectos', 'Sobre mí'],
  },
}

export function getSite(locale: Locale) {
  const t = localized[locale]
  // The Swiss number is the main one: it is what an English- or German-
  // reading recruiter in Switzerland will call. The Spanish page keeps the
  // Spanish number for readers calling from Spain.
  const phone = locale === 'es' ? '+34 669 27 24 83' : '+41 77 284 08 45'
  const digits = phone.replace(/\D/g, '')

  return {
    // ---------------------------------------------------------------------
    // Identity — same in every language
    // ---------------------------------------------------------------------
    name: 'Marc Mendez',
    role: t.role,

    /**
     * Canonical origin, no trailing slash. Drives canonical URLs, OG tags,
     * sitemap and robots.txt. Read at build time: set `NEXT_PUBLIC_SITE_URL`
     * in the build environment to point a preview at another origin.
     */
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marcmendezb.com',

    description: t.description,

    // ---------------------------------------------------------------------
    // Contact
    // ---------------------------------------------------------------------

    email: 'marcmendezb@gmail.com',
    phone,
    /** `tel:` target for `phone`: the same number with the spaces taken out. */
    tel: `tel:+${digits}`,
    /** The same number on WhatsApp. wa.me wants digits only, no `+`. */
    whatsapp: `https://wa.me/${digits}`,

    socials: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/marc-m%C3%A9ndez-barnils-53b5a4183/',
        description: t.socials[0],
      },
      {
        label: 'GitHub',
        href: 'https://github.com/marcmendezb',
        description: t.socials[1],
      },
    ] satisfies readonly SocialLink[],

    // ---------------------------------------------------------------------
    // Job search: the facts Swiss recruiters screen on first
    // ---------------------------------------------------------------------

    hiring: {
      // Elsau is the actual village; Winterthur is the city it sits beside
      // and the name a recruiter will recognise, the same way the hero's
      // status line and the mobile menu split on the city before the comma.
      // Not translated: a place name stays the same in every language.
      currentLocation: 'Winterthur, Switzerland',
      targetLocation: 'Zürich, Switzerland',
      origin: t.hiring.origin,
      availableFrom: t.hiring.availableFrom,
      workArrangement: t.hiring.workArrangement,
      workEligibility: t.hiring.workEligibility,
      responseTime: t.hiring.responseTime,
    },

    education: t.education.map((entry, i) => ({
      ...entry,
      institution: educationInstitutions[i] ?? null,
    })) satisfies readonly EducationEntry[],

    languages: t.languages satisfies readonly Language[],

    openTo: t.openTo,

    /**
     * Path to a public CV, served from `public/`. `null` hides every download
     * button, and `null` is the decision, not a gap: the CV goes by email to
     * each company that asks for it, so whoever needs it has it, and a PDF
     * with a phone number and a full history is not left public for anyone
     * to scrape. The page's contact lines are the way to ask for it.
     */
    cvPath: null as string | null,

    // ---------------------------------------------------------------------
    // Navigation
    // ---------------------------------------------------------------------

    /* Contact is deliberately not here. The header carries a "Get in touch"
       button that goes to the same section, and listing it twice in one strip
       of chrome made the button look like a duplicate of the link beside it
       rather than the one thing the page is asking you to do.

       This list also drives the scroll spy, the mobile menu and the footer
       index, so the three stay in step by construction. */
    nav: [
      { label: t.nav[0], section: 'disciplines' },
      { label: t.nav[1], section: 'work' },
      { label: t.nav[2], section: 'about' },
    ] satisfies readonly NavLink[],
  } as const
}

export type Site = ReturnType<typeof getSite>
