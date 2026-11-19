/**
 * Work, disciplines and stack.
 *
 * A hiring manager gives the work section about twenty seconds, so each entry
 * leads with what Marc *did*, not what the thing *is*.
 */

export type GalleryImage = {
  /** Path under `public/`. */
  src: string
  /** Describe what the screen shows, not that it is a screenshot. */
  alt: string
  /**
   * 'image' (the default, omit it) or 'video'.
   *
   * A video slide plays a silent, looping clip instead of a still, and unlike
   * a GIF it can actually be paused: the carousel's play/pause control calls
   * `.pause()`/`.play()` on it directly. A GIF rendered through `<img>` has no
   * such API at all: the browser's own decoder just keeps looping, which is
   * why a GIF slide never really stopped when the slideshow did.
   */
  kind?: 'image' | 'video'
  /**
   * How long this slide holds before the carousel advances, in ms. Defaults
   * to the carousel's own interval. Set this on a video slide to the clip's
   * own length, so the slide changes exactly on the loop point rather than
   * cutting away mid-loop or sitting on a frozen last frame while the timer
   * catches up.
   */
  durationMs?: number
}

export type ProjectVideo = {
  /** The film. Null until one has been shot; the poster stands in meanwhile. */
  src: string | null
  /** The still the dialog shows, and the poster frame once there is a film. */
  poster: string
  posterAlt: string
}

export type ProjectLink = {
  /** Short and concrete: "App" beats "View project" when there are two. */
  label: string
  /**
   * Null while there is nowhere to go yet.
   *
   * Not an empty string and not `'#'`: those are both a link, and a link that
   * goes nowhere is worse than no link at all: it takes focus, it is announced
   * as a link, and it does nothing when you follow it. Null says the
   * destination does not exist yet, which is a different fact, and the card
   * sets it as a label rather than as something to click. The day a URL exists,
   * it becomes a real link with no other change.
   */
  href: string | null
  /**
   * Set when following this opens the project's film in a dialog rather than
   * navigating. The entry needs no `href` and never gets one.
   */
  action?: 'video'
}

export type Project = {
  /** Stable key, also used as the DOM id. */
  slug: string
  title: string
  /** Kind of work: shown in the meta line above the title. */
  kind: string
  /** One or two lines: what it is and what you did. */
  /**
   * Prose, with two emphasis markers: `**bold**` for the claim inside the
   * sentence, `***bold accent***` for the signature line. See
   * `src/lib/emphasis.ts`; the markers are stripped before this reaches the
   * structured data.
   */
  description: string
  /**
   * Concrete result. Numbers land hardest. `null` hides the line.
   *
   * TODO: this is the biggest remaining upgrade available to the page. Every
   * entry below is honest about scope but silent about outcome: one real
   * figure per project (users, revenue, load time, conversion lift) would do
   * more for this section than any amount of rewriting.
   */
  outcome: string | null
  /** Be precise. "Design, build and growth, solo" reads better than "Developer". */
  role: string
  year: string
  /** Keep to 4–6. This is a signal, not an inventory. */
  tags: readonly string[]
  /**
   * Live links. A list rather than a single URL because a project can have more
   * than one front door: Marqo has a marketing site and the app itself, and
   * they're different things to click.
   *
   * Empty renders no link at all, rather than the dead `href="#"` the original
   * markup shipped.
   */
  links: readonly ProjectLink[]
  /**
   * Three words at most, for the project switcher in the deck bar.
   *
   * The names alone do not travel: "Tessel", "Santo Corte" and "Marqo" tell a
   * stranger nothing, and a list of six of them is a menu with no information
   * in it. This is the line that makes the list scannable, so it has to say
   * what the thing is, not what was admirable about it.
   */
  shorthand: string
  /** Single screenshot in `public/work/`. `null` renders a tonal placeholder. */
  image: string | null
  /**
   * Two or more images turn the media slot into a carousel. Leave empty to
   * fall back to `image`.
   */
  gallery: readonly GalleryImage[]
  imageAlt: string
  /** The film a `action: 'video'` link opens. Null when there is none. */
  video: ProjectVideo | null
}

/**
 * SCAFFOLDING: the Marqo screenshots, borrowed so the other projects can be
 * judged with pictures in them instead of grey panels.
 *
 * These are not the projects they are attached to. The alt text is deliberately
 * left describing Marqo, because that is what the pixels actually show and alt
 * text that lies is worse than a placeholder you can see.
 *
 * `reportPlaceholders()` counts every project still pointing here and says so
 * on each `pnpm dev`, so this cannot go live quietly. Anyone using a screen
 * reader on one of these cards today is told it is a Marqo screenshot, which
 * is true and confusing: the fix is real images, not better wording. Replace
 * per project by swapping `gallery: previewGallery` for that project's own
 * images.
 */
export const previewGallery: readonly GalleryImage[] = [
  {
    src: '/work/marqo/marqo-01.jpg',
    alt: 'The Marqo landing page on a laptop, headline asking how much you really made on this car',
  },
  {
    src: '/work/marqo/marqo-02.jpg',
    alt: 'Three phone screens side by side: stock, the purchase calculator and alerts',
  },
  {
    src: '/work/marqo/marqo-03.jpg',
    alt: 'The Marqo dashboard on a tablet, showing cars in stock, money tied up and average margin',
  },
  {
    src: '/work/marqo/marqo-04.jpg',
    alt: 'The Marqo site open in a phone browser, held in both hands',
  },
]

/**
 * A stand-in poster, borrowed from Marqo like `previewGallery` above.
 *
 * Exported so `config-check` can spot it by identity and keep shouting about
 * it. A still from another product sitting inside a dialog is easier to forget
 * than one on the face of a card, and it is exactly as wrong.
 */
export const previewPoster = '/work/marqo/marqo-01.jpg'

export const projects: readonly Project[] = [
  {
    slug: 'tessel',
    title: 'Tessel',
    // `|` rather than the slash it arrived with, which is the separator the
    // rest of the page uses and the one the card beside it already renders:
    // the meta line reads "Since 2026 | CRM | ERP", the same shape as
    // "2025 | Web app | Client" two cards down.
    kind: 'CRM | ERP',
    description:
      'A CRM for agencies that scales into a full ERP with a client portal, and later into a SaaS other agencies can buy. Built module by module (sales, projects, finance, operations) on one shared data model, with AI woven into the flow rather than bolted on as a separate module: drafting follow-up emails, summarising a deal’s history. Shipped in 10 languages, with automatic locale detection. Multi-tenant from day one, **enforced at the database level** with Postgres row-level security, with a full test suite and its own CI/CD pipeline deploying to a self-hosted VPS. I did the product, the brand, and the whole build.',
    outcome: null,
    role: 'Product, brand, build',
    year: 'Since 2026',
    // Ten now, not six: a deliberate exception to "a card is a signal, not a
    // dependency list" (the rule the rest of this file still follows). Added
    // on request, for the names a reviewer recognises on sight: Tailwind CSS,
    // Drizzle ORM and Playwright. Auth.js, Vitest and Caddy are still left out
    // real, but none of them changes what a reader takes away from the row.
    tags: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'PostgreSQL',
      'Drizzle ORM',
      'Row-Level Security',
      'Docker',
      'GitHub Actions',
      'Playwright',
      'VPS',
    ],
    links: [
      // Both are authored now and neither points anywhere yet, so the card
      // sets them as labels rather than as links. Fill in an `href` and each
      // one becomes clickable on its own.
      { label: 'Waitlist', href: null }, // TODO: the waitlist URL
      { label: 'View the project', href: null, action: 'video' },
    ],
    shorthand: 'Multi-tenant agency CRM',
    image: null, // TODO: '/work/tessel.jpg'
    imageAlt: 'Tessel, a multi-tenant CRM and ERP for agencies',
    // Four slides, alternating a still with a clip: two static laptop shots
    // bracket two phone recordings, so the gallery never shows two videos
    // back to back.
    gallery: [
      {
        src: '/work/tessel/tessel-01.jpg',
        alt: 'The Tessel home dashboard on a laptop: pipeline value, active projects, and an overdue task with an AI-drafted follow-up email open beside it, a tone picker reading Formal, Friendly, Brief',
      },
      {
        // Video, not a GIF: a GIF in an <img> has no API this page can call,
        // so the pause button could never actually stop one: the browser's
        // own decoder just keeps looping regardless of anything React does.
        src: '/work/tessel/tessel-02.mp4',
        kind: 'video',
        durationMs: 6000,
        alt: 'A phone turning to reveal the Tessel home screen, with the same AI-drafted follow-up email and tone picker as on the laptop',
      },
      {
        src: '/work/tessel/tessel-03.jpg',
        alt: 'The Tessel tasks board on a laptop, columns for To do, In progress, In review and Done',
      },
      {
        src: '/work/tessel/tessel-04.mp4',
        kind: 'video',
        durationMs: 8000,
        alt: "A phone turning to reveal Tessel's mobile navigation: Home, Notes and Conversations, then the Sales and Projects sections",
      },
    ],
    video: {
      src: '/work/tessel/tessel.mp4',
      // The film's own opening card: the tessellation mark and the tagline,
      // not a product screenshot. Supplied directly, so this is what the
      // video itself leads with rather than a frame picked out of it.
      poster: '/work/tessel/tessel-poster.png',
      posterAlt:
        "The Tessel logo, with the tagline 'Your whole agency, in one tool.'",
    },
  },
  {
    slug: 'northbridge',
    title: 'Northbridge Advisory',
    kind: 'Fictional brand',
    description:
      "A fictional fiduciary and accounting firm in Zürich, brief, branding and photography (AI-generated) built from scratch by me. Five languages, five countries, and **a tax deadline engine that computes each country's real, sourced filing dates** instead of hard-coding them, so next year's calendar is already correct.",
    outcome: null,
    role: 'Brief, brand and build',
    year: '2026',
    tags: [
      'Astro',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'GSAP',
      'Cloudflare Pages',
    ],
    links: [{ label: 'Visit site', href: 'https://northbridge-124.pages.dev' }],
    shorthand: 'Fictional Zürich fiduciary',
    image: '/work/northbridge/northbridge-01.jpg',
    imageAlt:
      'Sunlight through an arched window falling across a plaster wall, a eucalyptus branch in the foreground, from the homepage of a fictional Zürich fiduciary',
    gallery: [
      {
        src: '/work/northbridge/northbridge-01.jpg',
        alt: 'Sunlight through an arched window falling across a plaster wall, a eucalyptus branch in the foreground, from the homepage of a fictional Zürich fiduciary',
      },
      {
        src: '/work/northbridge/northbridge-02.jpg',
        alt: 'A tax calendar showing VAT, income tax, payroll and contribution deadlines across the year, with the next deadline, 30 November for Q3 VAT, called out separately',
      },
      {
        src: '/work/northbridge/northbridge-03.jpg',
        alt: 'The German-language contact page, headlined "Reden wir über deine Zahlen," promising a reply by noon the next working day',
      },
      {
        src: '/work/northbridge/northbridge-04.jpg',
        alt: "A form confirmation page with a live countdown to reply, under an arch echoing the homepage's window",
      },
    ],
    video: null,
  },
  {
    slug: 'santo-corte',
    title: 'Santo Corte',
    // Flagged right in the meta line, not just in the paragraph below it: a
    // recruiter scanning cards in twenty seconds sees "2024 | Fictional
    // brand" before reading a word of the description.
    kind: 'Fictional brand',
    description:
      'A fictional barbershop, brief and branding included, invented and built from scratch by me. The brief asked for a basic brochure site that could grow into a booking system later; what shipped goes further than that: a full-screen hero scroll-scrubbing **a 300-frame canvas sequence with real alpha transparency** instead of a video, GSAP and Lenis animating everything beneath it, with a reduced-motion fallback throughout.',
    outcome: null,
    role: 'Brief, brand and build',
    year: '2026',
    tags: ['React', 'TypeScript', 'Vite', 'GSAP', 'Lenis', 'Vercel'],
    links: [{ label: 'Visit site', href: 'https://santocorteweb.vercel.app/' }],
    shorthand: 'Fictional barbershop brand',
    image: '/work/santo-corte/santo-corte-01.jpg',
    imageAlt:
      'A pair of engraved barber scissors reading "Santo Corte" in a gothic typeface, suspended against a dim, blurred barbershop interior',
    gallery: [
      {
        src: '/work/santo-corte/santo-corte-01.jpg',
        alt: 'A pair of engraved barber scissors reading "Santo Corte" in a gothic typeface, suspended against a dim, blurred barbershop interior',
      },
      {
        src: '/work/santo-corte/santo-corte-02.jpg',
        alt: 'A vintage barber chair with folded hot towels and a straight razor laid across it, the "Santo Corte" wordmark on the concrete wall behind',
      },
      {
        src: '/work/santo-corte/santo-corte-03.jpg',
        alt: 'A straight razor, a shaving brush, scissors and a comb laid out on a steel tray',
      },
      {
        src: '/work/santo-corte/santo-corte-04.jpg',
        alt: 'The founder in a "Santo Corte, Architects of Style" t-shirt, holding a comb and scissors in the barbershop',
      },
    ],
    video: null,
  },
  {
    slug: 'marqo',
    title: 'Marqo',
    kind: 'SaaS',
    // "My first SaaS" is stated outright; the growth since is left for the
    // reader to notice on their own, set against Tessel's own, later, more
    // demanding build, rather than claimed here.
    description:
      'My first SaaS: a car-retail calculator that tells buyers and dealers what actually makes sense to buy. I did the product strategy, the brand, the marketing site and **the whole build**.',
    outcome: null,
    role: 'Product, brand, build and growth',
    year: 'Since 2025',
    // Trimmed from the full stack on purpose: App Router, RSC, Zod, RLS,
    // next-themes, self-hosted fonts and a hand-rolled i18n are all in there,
    // but a card is a signal, not a dependency list. These six are the ones a
    // recruiter actually scans for.
    tags: [
      'Next.js',
      'TypeScript',
      'Supabase',
      'Stripe',
      'Tailwind CSS',
      'Vercel',
    ],
    links: [
      { label: 'Landing page', href: 'https://marqo.es' },
      { label: 'App', href: 'https://app.marqo.es' },
    ],
    shorthand: 'Car retail SaaS',
    image: null,
    imageAlt: 'Marqo purchase-decision calculator for automotive retail',
    gallery: [
      {
        src: '/work/marqo/marqo-01.jpg',
        alt: 'The Marqo landing page on a laptop, headline asking how much you really made on this car',
      },
      {
        src: '/work/marqo/marqo-02.jpg',
        alt: 'Three phone screens side by side: stock, the purchase calculator and alerts',
      },
      {
        src: '/work/marqo/marqo-03.jpg',
        alt: 'The Marqo dashboard on a tablet, showing cars in stock, money tied up and average margin',
      },
      {
        src: '/work/marqo/marqo-04.jpg',
        alt: 'The Marqo site open in a phone browser, held in both hands',
      },
    ],
    video: null,
  },
  {
    slug: 'freelance-practice',
    title: 'Freelance practice',
    kind: 'Freelance practice',
    description:
      '**Strategy, design and code from one person.** I work out the positioning first, then build the site that carries it. Clients who’d normally hire two people hire one.',
    outcome: null,
    role: 'Strategy, design, build',
    year: 'Since 2026',
    tags: ['Marketing strategy', 'Web design', 'CRO', 'Next.js'],
    links: [],
    shorthand: 'Freelance practice',
    image: null, // TODO: '/work/freelance-practice.jpg'
    imageAlt: 'Freelance practice website',
    gallery: previewGallery, // SCAFFOLDING, see previewGallery above
    video: null,
  },
  {
    slug: 'agency-tracker',
    title: 'Agency project tracker',
    kind: 'Web app | Client',
    description:
      'Project management for an agency, with live sync between the team and the client. Two roles, proper auth, and permissions set so a client only sees what they’re meant to. It came out of a real workflow problem and it’s **running in production**.',
    outcome: null,
    role: 'Full build',
    year: '2026',
    tags: ['Vite', 'Supabase', 'Realtime', 'PostgreSQL', 'Netlify'],
    links: [], // TODO: add the live URL, or leave empty if it's private
    shorthand: 'Agency project tracker',
    image: null, // TODO: '/work/agency-tracker.jpg'
    imageAlt: 'Agency project tracker dashboard',
    gallery: previewGallery, // SCAFFOLDING, see previewGallery above
    video: null,
  },
  {
    slug: 'client-sites',
    title: 'Client sites & brand systems',
    kind: 'Client work',
    description:
      'Websites and design systems for local businesses, car dealers among them. **No templates.** Each one starts from what the business needs to sell, and gets a design system built around that.',
    outcome: null,
    role: 'Strategy, design & build',
    year: 'Since 2026',
    tags: ['Design systems', 'CRO', 'Technical SEO', 'Landing pages'],
    links: [],
    shorthand: 'Sites and branding',
    image: null, // TODO: '/work/client-sites.jpg'
    imageAlt: 'Selection of client websites and brand systems',
    gallery: previewGallery, // SCAFFOLDING, see previewGallery above
    video: null,
  },
  {
    slug: 'ai-tooling',
    title: 'AI dev-workflow tooling',
    kind: 'R&D',
    description:
      'A VS Code extension that lets me watch and steer **several AI coding agents at once**, instead of losing track of what each one’s doing. Plus experiments running local coding models on ordinary hardware.',
    outcome: null,
    role: 'Solo R&D',
    year: 'Since 2026',
    tags: ['AI agents', 'VS Code', 'LLM APIs', 'Automation'],
    links: [],
    shorthand: 'Multi-agent dev tooling',
    image: null, // TODO: '/work/ai-tooling.jpg'
    imageAlt: 'VS Code extension for observing multi-agent coding sessions',
    gallery: previewGallery, // SCAFFOLDING, see previewGallery above
    video: null,
  },
] as const

/**
 * The two disciplines, in no particular order.
 *
 * Full-stack on both sides: seven years as a MarTech specialist and three
 * as a developer are different tenures, but neither one is the "real" job
 * with the other bolted on. AI tooling sits inside the developer discipline
 * rather than as a third item of its own: coding agents are a development
 * capability here, not a separate identity.
 *
 * "MarTech specialist" rather than the more generic "marketing
 * technologist": it's the term Swiss job postings actually use (PwC's
 * Marketing Technology Lead, Salesforce's MarTech-focused Marketing
 * Architect, Source Group's MarTech Engineer, all Zürich), so it's also
 * the string a recruiter's own search is more likely to match.
 */
export type Discipline = {
  name: string
  /** The claim, in Marc's own words. */
  claim: string
  body: string
  tools: readonly string[]
}

export const disciplines: readonly Discipline[] = [
  {
    name: 'Full-stack developer',
    claim: 'I build it myself',
    body: 'Real products, not mockups: corporate sites, landing pages, marketing automation, SaaS, web apps, internal software. I take them from the frontend through to deploy, with coding agents doing real work alongside me rather than just autocompleting in the editor. There’s no handoff, because there’s nobody to hand off to.',
    /* Drawn from what is actually in the repos, not from memory: 43 projects
       across personal and client work were read for their dependencies.
       Cloudflare Workers with D1 appear in four of them and Hono in three.
       Vite is in eleven. The AI API entries are evidenced too: one of them
       ships @anthropic-ai/sdk with Trigger.dev for background jobs, and
       nutribot runs @google/generative-ai.

       MySQL, Framer and Figma are here on Marc's say-so rather than on
       evidence: they're skills he supplied, but nothing in these repos uses
       them. Worth a second look before an interview. */
    tools: [
      'TypeScript',
      'React',
      'Next.js',
      'Astro',
      'Framer',
      'Figma',
      'Vite',
      'Node',
      'Hono',
      'PostgreSQL',
      'MySQL',
      'Supabase',
      'Cloudflare Workers & D1',
      'Stripe',
      'Vercel',
      'Docker',
      'Claude Code',
      'Codex',
      'Cursor',
      'Agentic coding',
      'Multi-agent workflows',
      'Anthropic API',
      'Gemini API',
      'Trigger.dev',
      'Local LLMs',
      'VS Code extensions',
      'Internal tooling',
    ],
  },
  {
    name: 'Full-stack MarTech specialist',
    claim: 'I know why it sells',
    body: 'Strategy first, then the MarTech stack that serves it: SEO, paid acquisition, social media, landing pages, CRO, email and the automation behind it. Seven years of this before I wrote a line of production code, which is why I think about conversion while I’m building, not after.',
    // 'Lifecycle' became 'Email marketing': the same work, named the way a job
    // ad names it. Automation and workflows sit here rather than under the
    // developer discipline, because the judgement they encode is a marketing
    // one.
    tools: [
      'Marketing strategy',
      'Positioning',
      'Technical SEO',
      'Content SEO',
      'Social media',
      'Google Ads',
      'Meta Ads',
      'CRO',
      'Landing pages',
      'Email marketing',
      'Marketing automation',
      'Workflows',
      'Referral loops',
      'Copy',
      'Analytics & tracking',
      'GA4',
      'GTM',
      'HubSpot',
      'Photoshop',
    ],
  },
] as const

/**
 * The three dates that explain the combination. Rendered as a short timeline in
 * the About section rather than as a CV-style employment history: the shape of
 * the career is the argument, not the list of employers.
 */
export type Milestone = {
  year: string
  label: string
  detail: string
}

export const timeline: readonly Milestone[] = [
  {
    year: '2019',
    label: 'Started in marketing',
    detail: 'Learning what makes people click, buy and come back.',
  },
  {
    year: '2023',
    label: 'Studied web development',
    detail:
      'I wanted to build the products, not just write the brief for them.',
  },
  {
    year: '2025',
    label: 'Went AI-native',
    detail: 'Coding agents every day, plus the tools I build around them.',
  },
] as const

/** Currently learning. Honest about being in progress. */
export const learning: readonly string[] = [
  'Servers & infrastructure',
  'German',
] as const
