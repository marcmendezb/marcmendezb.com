/**
 * Single source of truth for everything personal on this site.
 *
 * Components never hard-code names, URLs or copy: they read from here. Editing
 * this file is the only thing you need to do to keep the site current.
 *
 * Fields typed `| null` are ones that must not be guessed. They render nothing
 * until you fill them in, so an unfinished field is invisible rather than wrong.
 * `pnpm dev` prints a checklist of everything still unset.
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
  /** The qualification and subject, e.g. "Higher Vocational Diploma, Web Application Development". */
  qualification: string
  country: string
  /**
   * The awarding school or university. `null` while unconfirmed: see the
   * module comment on `| null` fields. Not rendered on the page even once
   * set; kept here so `reportPlaceholders()` can still flag it and so the
   * data is complete if a fuller CV page ever wants it.
   */
  institution: string | null
  /**
   * A short note shown beside the country, e.g. "not completed" or "starts
   * February 2026". Omit for a plain finished qualification.
   */
  status?: string
}

export const site = {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  name: 'Marc Mendez',

  /**
   * Used in <title>, OG tags and the JSON-LD `jobTitle`.
   *
   * Both named outright rather than one leading. Seven years in marketing
   * and four building products are different tenures, but neither is the
   * "real" job with the other bolted on, and a recruiter searching either
   * term on its own should still land on this page.
   */
  role: 'Full-stack developer & marketing technologist',

  /**
   * Canonical origin, no trailing slash. Drives canonical URLs, OG tags,
   * sitemap and robots.txt.
   *
   * TODO: point this at your real domain before launch.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://marcmendez.com'),

  /** <150 chars. What Google shows, and what appears when someone pastes the link. */
  description:
    'Full-stack developer and full-stack marketing technologist. Seven years in marketing, four building products. Based near Zürich, available now.',

  // ---------------------------------------------------------------------------
  // Contact
  // ---------------------------------------------------------------------------

  email: 'marcmendezb@gmail.com',
  phone: '+34 669 27 24 83',

  socials: [
    {
      label: 'LinkedIn',
      // TODO: confirm (built from your handle, not verified).
      href: 'https://www.linkedin.com/in/marcmendez',
      description: 'LinkedIn profile',
    },
    {
      label: 'GitHub',
      // TODO: confirm (built from your handle, not verified).
      href: 'https://github.com/marcmendez',
      description: 'GitHub profile',
    },
  ] satisfies SocialLink[],

  // ---------------------------------------------------------------------------
  // Job search: the facts Swiss recruiters screen on first
  // ---------------------------------------------------------------------------

  hiring: {
    // Elsau is the actual village; Winterthur is the city it sits beside and
    // the name a recruiter will recognise, the same way the hero's status
    // line and the mobile menu split on the city before the comma.
    currentLocation: 'Winterthur, Switzerland',
    targetLocation: 'Zürich, Switzerland',

    /**
     * Where Marc moved from, not where he's moving to: he already lives in
     * the Zürich area (see `currentLocation`). Surfaced once, in About's
     * prose, so the page doesn't read as having skipped the relocation that
     * already happened.
     */
    origin: 'Barcelona, Spain',

    /**
     * Zero days' notice.
     *
     * The short status chips (hero, mobile menu, OG card) just say "Available"
     * on its own; this only fills in the prose sentences in About and Contact,
     * where "available now" reads naturally. If the date ever stops being
     * immediate, change this to something like "from March" and revisit those
     * chips so they say "Available from March" instead.
     */
    availableFrom: 'now',

    workArrangement: 'On-site, hybrid or remote',

    /**
     * The single biggest filter in the Swiss market. An EU passport removes the
     * recruiter's first objection before they have to ask, so it is stated
     * plainly rather than left to be inferred.
     */
    workEligibility: 'EU citizen, no Swiss permit needed',

    /** Reply-time promise, used in the contact section. */
    responseTime: 'within 24 hours',
  },

  /**
   * Worth its own block rather than a footnote. Switzerland runs on vocational
   * training: the Berufsbildung route is the mainstream path there, not a
   * fallback, so these read as credentials to a Swiss recruiter in a way
   * they might not elsewhere.
   *
   * Four entries, not one: a web development diploma on its own undersold the
   * marketing side, which has its own formal qualification rather than being
   * self-taught. The unfinished bachelor's stays in rather than getting
   * quietly dropped: "left Public Relations partway through for a vocational
   * diploma instead" is a more honest shape of a career than hiding the
   * detour.
   *
   * The Spanish qualification codes (CFGS, CFGM) are left out on purpose:
   * they mean nothing to a Swiss recruiter and would read as noise next to
   * credentials they do recognise. "Higher" vs "Intermediate" carries the
   * same distinction in plain English.
   *
   * The data science degree leads the list: it's the one a reader should
   * notice first, not something to find by reading to the end.
   */
  education: [
    {
      qualification: 'Data Science and Artificial Intelligence (BSc)',
      country: 'Spain',
      institution: 'Universidad Internacional de Valencia (VIU)',
      status: 'starts February 2026',
    },
    {
      qualification: 'Higher Vocational Diploma, Web Application Development',
      country: 'Spain',
      institution: null, // TODO: the centre's name
    },
    {
      qualification: 'Higher Vocational Diploma, Marketing and Advertising',
      country: 'Spain',
      institution: null, // TODO: the centre's name
    },
    {
      qualification:
        'Intermediate Vocational Diploma, Administrative Assistance',
      country: 'Spain',
      institution: null, // TODO: the centre's name
    },
    {
      qualification: 'Public Relations, Marketing and Advertising (BA)',
      country: 'Spain',
      institution: null, // TODO: the university's name
      status: 'not completed',
    },
  ] satisfies EducationEntry[],

  languages: [
    { name: 'Spanish', level: 'Native' },
    { name: 'Catalan', level: 'Native' },
    { name: 'English', level: 'Professional (B2)' },
    { name: 'German', level: 'Learning (A1)' },
  ] satisfies Language[],

  /**
   * What you're open to. Kept broad on purpose: you're looking at marketing
   * roles, development roles and the combination.
   */
  openTo: 'Marketing roles, development roles, or both.',

  /**
   * Path to your CV, served from `public/`. `null` hides every download button.
   *
   * TODO: drop the PDF at `public/marc-mendez-cv.pdf` and set this.
   */
  cvPath: null as string | null,

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  /* Contact is deliberately not here. The header carries a "Get in touch"
     button that goes to the same section, and listing it twice in one strip of
     chrome made the button look like a duplicate of the link beside it rather
     than the one thing the page is asking you to do.

     This list also drives the scroll spy, the mobile menu and the footer index,
     so the three stay in step by construction. */
  nav: [
    { label: 'What I do', section: 'disciplines' },
    { label: 'Work', section: 'work' },
    { label: 'About', section: 'about' },
  ] satisfies NavLink[],
} as const

export type Site = typeof site
