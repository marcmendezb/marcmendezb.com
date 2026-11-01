/**
 * Single source of truth for everything personal on this site.
 *
 * Components never hard-code names, URLs or copy — they read from here. Editing
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

export const site = {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  name: 'Marc Mendez',

  /**
   * Used in <title>, OG tags and the JSON-LD `jobTitle`.
   *
   * Marketing leads deliberately. It's the longer half of the track record
   * (seven years against four) and the half that makes the developer work
   * unusual, rather than the other way round.
   */
  role: 'Marketing & web development',

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
    'Marketer who builds. Seven years doing marketing strategy, SEO, paid acquisition and social. Four building the products too. Moving to Zürich, available now.',

  // ---------------------------------------------------------------------------
  // Contact
  // ---------------------------------------------------------------------------

  email: 'marcmendezb@gmail.com',
  phone: '+34 669 27 24 83',

  socials: [
    {
      label: 'LinkedIn',
      // TODO: confirm — built from your handle, not verified.
      href: 'https://www.linkedin.com/in/marcmendez',
      description: 'LinkedIn profile',
    },
    {
      label: 'GitHub',
      // TODO: confirm — built from your handle, not verified.
      href: 'https://github.com/marcmendez',
      description: 'GitHub profile',
    },
  ] satisfies SocialLink[],

  // ---------------------------------------------------------------------------
  // Job search — the facts Swiss recruiters screen on first
  // ---------------------------------------------------------------------------

  hiring: {
    currentLocation: 'Barcelona, Spain',
    targetLocation: 'Zürich, Switzerland',

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
   * training — the Berufsbildung route is the mainstream path there, not a
   * fallback — so a formal diploma in web development reads as a credential to
   * a Swiss recruiter in a way it might not elsewhere.
   *
   * Kept to the field and the year on purpose. The specific qualification,
   * awarding body and grades belong on the CV, where someone who wants that
   * detail will go looking for it; on the page they would be noise.
   */
  education: {
    field: 'Web development',
    year: '2022',
  },

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
  openTo:
    'Marketing roles, development roles, or both. Full-time, freelance or per project.',

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
