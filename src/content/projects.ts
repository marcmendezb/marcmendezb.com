import type { Locale } from '@/i18n/locales'

/**
 * Work, disciplines and stack.
 *
 * A hiring manager gives the work section about twenty seconds, so each entry
 * leads with what Marc *did*, not what the thing *is*.
 *
 * English lives on the arrays below (`projects`, `disciplines`, `timeline`,
 * `learning`), unconditionally: it's the language every other field in this
 * file (slugs, tags, links) is already written in, and it's what
 * `reportPlaceholders()` checks. German and Spanish live in the `translations`
 * maps further down, keyed by slug/index so a reordering of the English array
 * doesn't silently misalign them. Components call `getProjects(locale)` etc.,
 * never the base arrays directly.
 *
 * `previewGallery`/`previewPoster` are scaffolding, not copy: borrowed Marqo
 * screenshots standing in until a project has its own. They stay English in
 * every locale, the same way a "lorem ipsum" placeholder wouldn't get
 * translated either.
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
  /**
   * CSS `object-position` for the crop, e.g. '50% 75%'. Defaults to centred.
   *
   * On a phone the frame is 4:5, the same as the images, so nothing is cut.
   * From 880px the frame turns landscape and a portrait image loses roughly a
   * third of its height to `object-cover`; when the subject sits off the
   * vertical middle (a laptop low in the shot, a phone near the top) the
   * centred crop slices it. Set this to the subject's centre instead.
   */
  position?: string
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
 * SCAFFOLDING: the Santo Corte mockups, borrowed so a project without its own
 * images yet can be judged with pictures in it instead of a grey panel.
 *
 * These are not the projects they are attached to. The alt text is deliberately
 * left describing Santo Corte, because that is what the pixels actually show
 * and alt text that lies is worse than a placeholder you can see.
 *
 * A separate array from Santo Corte's own `gallery`, not a reference to it:
 * `reportPlaceholders()` spots borrowers by identity, so sharing the array
 * would flag Santo Corte as borrowing its own pictures.
 *
 * `reportPlaceholders()` counts every project still pointing here and says so
 * on each `pnpm dev`, so this cannot go live quietly. Replace per project by
 * swapping `gallery: previewGallery` for that project's own images.
 */
export const previewGallery: readonly GalleryImage[] = [
  {
    src: '/work/santo-corte/santo-corte-01.jpg',
    position: '50% 75%',
    alt: 'The Santo Corte homepage on a laptop resting on a leather armchair, its engraved scissors suspended over a dim barbershop interior',
  },
  {
    src: '/work/santo-corte/santo-corte-02.jpg',
    position: '50% 15%',
    alt: 'The Santo Corte services menu on a phone standing on a block of rough concrete, each cut and shave listed with its duration and price',
  },
  {
    src: '/work/santo-corte/santo-corte-03.jpg',
    alt: 'The Santo Corte studio section on a laptop set on a stool, a grid of numbered photos of the barbershop interior',
  },
  {
    src: '/work/santo-corte/santo-corte-04.jpg',
    position: '50% 60%',
    alt: 'A phone lying on concrete, open on the "La Experiencia" section of the Santo Corte site',
  },
]

/**
 * A stand-in poster, borrowed from Marqo.
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
    slug: 'paddock-notes',
    title: 'Paddock Notes',
    kind: 'Open source',
    description:
      'An unofficial site that explains Formula 1 with data: the current season race by race, strategy, pace and telemetry analysis for every race since 2023, and a what-if championship simulator. Web app, API and data ingestion run as three separate Cloudflare Workers, and after each race a workflow precomputes the analysis, so **no page ever waits on an external API**. Written in English, Spanish and German, built to WCAG 2.2 AA, and the core of the site works with JavaScript turned off. All 36 architectural decisions are documented in the repository.',
    outcome: null,
    role: 'Product, design and build',
    year: '2026',
    tags: [
      'Next.js',
      'TypeScript',
      'Cloudflare Workers',
      'Hono',
      'Drizzle ORM',
      'Playwright',
    ],
    // The repository is public on purpose: for this one the code is the
    // work sample. The site itself is not deployed yet.
    links: [
      {
        label: 'Source code',
        href: 'https://github.com/marcmendezb/paddock-notes',
      },
    ],
    shorthand: 'F1 data analysis',
    image: null,
    imageAlt: 'Paddock Notes, Formula 1 explained with data',
    gallery: previewGallery, // TODO: Paddock Notes' own images
    video: null,
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
      'The Northbridge homepage on a laptop, headlined "Your numbers, under control." beside sunlight falling through an arched window',
    gallery: [
      {
        src: '/work/northbridge/northbridge-01.jpg',
        // Laptop sits low in the shot (44-87% of the height).
        position: '50% 85%',
        alt: 'The Northbridge homepage on a laptop, headlined "Your numbers, under control." beside sunlight falling through an arched window',
      },
      {
        src: '/work/northbridge/northbridge-02.jpg',
        // Phone sits above the middle (23-64% of the height).
        position: '50% 30%',
        alt: 'A phone held in both hands, open on the free consultation section: no commitment, a fixed price afterwards and one dedicated contact person, above the four advisers in arched frames',
      },
      {
        src: '/work/northbridge/northbridge-03.jpg',
        // Taller than the landscape crop can hold; favour the screen over the
        // trackpad.
        position: '50% 40%',
        alt: 'The tax calendar on a laptop, headlined "Your tax year, at a glance.", with every deadline across the year and the next one, 30 November for Q3 VAT, called out separately',
      },
      {
        src: '/work/northbridge/northbridge-04.jpg',
        // Phone sits a little above the middle (27-66% of the height).
        position: '50% 40%',
        alt: 'The same tax calendar on a phone, scrolled to November, with the next deadline marked beside today',
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
      'The Santo Corte homepage on a laptop resting on a leather armchair, its engraved scissors suspended over a dim barbershop interior',
    gallery: [
      {
        src: '/work/santo-corte/santo-corte-01.jpg',
        // Laptop sits low in the shot (38-81% of the height).
        position: '50% 75%',
        alt: 'The Santo Corte homepage on a laptop resting on a leather armchair, its engraved scissors suspended over a dim barbershop interior',
      },
      {
        src: '/work/santo-corte/santo-corte-02.jpg',
        // Phone sits high in the shot (17-56% of the height).
        position: '50% 15%',
        alt: 'The services menu on a phone standing on a block of rough concrete, each cut and shave listed with its duration and price',
      },
      {
        src: '/work/santo-corte/santo-corte-03.jpg',
        alt: 'The studio section on a laptop set on a stool, a grid of numbered photos of the barbershop interior',
      },
      {
        src: '/work/santo-corte/santo-corte-04.jpg',
        // Phone sits just below the middle (36-73% of the height).
        position: '50% 60%',
        alt: 'A phone lying on concrete, open on the "La Experiencia" section of the site',
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

// ---------------------------------------------------------------------------
// German and Spanish translations
// ---------------------------------------------------------------------------

type ProjectTranslation = {
  kind: string
  description: string
  role: string
  shorthand: string
  imageAlt: string
  /** Positional, parallel to the base project's own `gallery` array. Omitted
   *  entirely for a project still on `previewGallery`: that gallery is
   *  scaffolding, not copy, so there's nothing of its own to translate. */
  galleryAlt?: readonly string[]
  /** Only tessel has a video today. */
  videoPosterAlt?: string
}

const projectTranslations: Record<
  'de' | 'es',
  Record<string, ProjectTranslation>
> = {
  de: {
    tessel: {
      kind: 'CRM | ERP',
      description:
        'Ein CRM für Agenturen, das zu einem vollständigen ERP mit Kundenportal wird und später zu einem SaaS, das andere Agenturen kaufen können. Modul für Modul aufgebaut (Vertrieb, Projekte, Finanzen, Betrieb) auf einem gemeinsamen Datenmodell, mit KI, die in den Ablauf eingewoben ist statt als separates Modul angeflanscht: Entwürfe für Follow-up-E-Mails, Zusammenfassungen der Historie eines Deals. Ausgeliefert in 10 Sprachen mit automatischer Spracherkennung. Von Anfang an Multi-Tenant, **auf Datenbankebene erzwungen** mit Postgres Row-Level Security, mit einer vollständigen Testsuite und einer eigenen CI/CD-Pipeline, die auf einen selbst gehosteten VPS deployt. Produkt, Marke und den gesamten Aufbau habe ich selbst gemacht.',
      role: 'Produkt, Marke, Umsetzung',
      shorthand: 'Multi-Tenant-CRM für Agenturen',
      imageAlt: 'Tessel, ein Multi-Tenant-CRM und ERP für Agenturen',
      galleryAlt: [
        'Das Tessel-Startdashboard auf einem Laptop: Pipeline-Wert, aktive Projekte und eine überfällige Aufgabe mit einer KI-generierten Follow-up-E-Mail daneben geöffnet, ein Tonalitäts-Wähler mit „Formal, Freundlich, Kurz"',
        'Ein Smartphone dreht sich und zeigt den Tessel-Startbildschirm, mit derselben KI-generierten Follow-up-E-Mail und demselben Tonalitäts-Wähler wie auf dem Laptop',
        'Das Tessel-Aufgabenboard auf einem Laptop, Spalten für Zu erledigen, In Bearbeitung, In Prüfung und Erledigt',
        'Ein Smartphone dreht sich und zeigt Tessels mobile Navigation: Start, Notizen und Unterhaltungen, dann die Bereiche Vertrieb und Projekte',
      ],
      videoPosterAlt:
        'Das Tessel-Logo mit dem Slogan „Deine ganze Agentur, in einem Tool."',
    },
    'paddock-notes': {
      kind: 'Open Source',
      description:
        'Eine inoffizielle Website, die die Formel 1 mit Daten erklärt: die laufende Saison Rennen für Rennen, Strategie-, Pace- und Telemetrieanalysen für jedes Rennen seit 2023 und ein Was-wäre-wenn-Meisterschaftssimulator. Web-App, API und Datenimport laufen als drei getrennte Cloudflare Workers, und nach jedem Rennen berechnet ein Workflow die Analysen vor, sodass **keine Seite je auf eine externe API wartet**. Auf Englisch, Spanisch und Deutsch geschrieben, nach WCAG 2.2 AA gebaut, und der Kern der Website funktioniert auch ohne JavaScript. Alle 36 Architekturentscheidungen sind im Repository dokumentiert.',
      role: 'Produkt, Design und Umsetzung',
      shorthand: 'F1-Datenanalyse',
      imageAlt: 'Paddock Notes, die Formel 1 mit Daten erklärt',
    },
    northbridge: {
      kind: 'Fiktive Marke',
      description:
        'Eine fiktive Treuhand- und Buchhaltungsfirma in Zürich, Briefing, Markenbildung und Fotografie (KI-generiert), von mir komplett von Grund auf entwickelt. Fünf Sprachen, fünf Länder, und **eine Steuerfristen-Engine, die für jedes Land die echten, belegten Einreichungsfristen berechnet** statt sie fest zu hinterlegen, sodass der Kalender für nächstes Jahr bereits korrekt ist.',
      role: 'Briefing, Marke und Umsetzung',
      shorthand: 'Fiktive Zürcher Treuhandfirma',
      imageAlt:
        'Die Northbridge-Startseite auf einem Laptop, mit der Überschrift „Your numbers, under control." neben Sonnenlicht, das durch ein Bogenfenster fällt',
      galleryAlt: [
        'Die Northbridge-Startseite auf einem Laptop, mit der Überschrift „Your numbers, under control." neben Sonnenlicht, das durch ein Bogenfenster fällt',
        'Ein Smartphone, mit beiden Händen gehalten, geöffnet beim kostenlosen Erstgespräch: unverbindlich, danach ein Festpreis und eine feste Ansprechperson, darunter die vier Berater in Bogenrahmen',
        'Der Steuerkalender auf einem Laptop, mit der Überschrift „Your tax year, at a glance.", allen Fristen des Jahres und der nächsten, 30. November für die MWST Q3, separat hervorgehoben',
        'Derselbe Steuerkalender auf einem Smartphone, bis November gescrollt, die nächste Frist neben dem heutigen Tag markiert',
      ],
    },
    'santo-corte': {
      kind: 'Fiktive Marke',
      description:
        'Eine fiktive Barbershop-Marke, Briefing und Branding inklusive, von mir komplett erfunden und umgesetzt. Das Briefing verlangte eine einfache Broschürenseite, die später zu einem Buchungssystem ausgebaut werden könnte; umgesetzt wurde mehr als das: ein Vollbild-Hero, der beim Scrollen durch **eine 300-Bilder-Canvas-Sequenz mit echter Alpha-Transparenz** blättert statt durch ein Video, mit GSAP und Lenis, die alles darunter animieren, durchgehend mit einem Fallback für reduzierte Bewegung.',
      role: 'Briefing, Marke und Umsetzung',
      shorthand: 'Fiktive Barbershop-Marke',
      imageAlt:
        'Die Santo-Corte-Startseite auf einem Laptop in einem Ledersessel, die gravierte Schere schwebt vor einem dunklen Barbershop-Interieur',
      galleryAlt: [
        'Die Santo-Corte-Startseite auf einem Laptop in einem Ledersessel, die gravierte Schere schwebt vor einem dunklen Barbershop-Interieur',
        'Die Leistungsübersicht auf einem Smartphone, das auf einem rohen Betonblock steht, jeder Schnitt und jede Rasur mit Dauer und Preis',
        'Der Studio-Bereich auf einem Laptop auf einem Hocker, ein Raster nummerierter Fotos des Barbershop-Interieurs',
        'Ein Smartphone auf Beton, geöffnet im Bereich „La Experiencia" der Website',
      ],
    },
    marqo: {
      kind: 'SaaS',
      description:
        'Mein erstes SaaS: ein Rechner für den Autohandel, der Käufern und Händlern sagt, was wirklich Sinn ergibt zu kaufen. Produktstrategie, Marke, Marketing-Website und **die gesamte Umsetzung** habe ich selbst gemacht.',
      role: 'Produkt, Marke, Umsetzung und Wachstum',
      shorthand: 'SaaS für den Autohandel',
      imageAlt: 'Marqo-Kaufentscheidungsrechner für den Autohandel',
      galleryAlt: [
        'Die Marqo-Landingpage auf einem Laptop, Headline fragt, wie viel an diesem Auto wirklich verdient wurde',
        'Drei Smartphone-Bildschirme nebeneinander: Lagerbestand, Kaufrechner und Benachrichtigungen',
        'Das Marqo-Dashboard auf einem Tablet, mit Fahrzeugen im Bestand, gebundenem Kapital und durchschnittlicher Marge',
        'Die Marqo-Website geöffnet in einem Smartphone-Browser, mit beiden Händen gehalten',
      ],
    },
  },
  es: {
    tessel: {
      kind: 'CRM | ERP',
      description:
        'Un CRM para agencias que escala hasta convertirse en un ERP completo con portal de cliente, y más adelante en un SaaS que otras agencias puedan comprar. Construido módulo a módulo (ventas, proyectos, finanzas, operaciones) sobre un único modelo de datos, con IA integrada en el flujo en lugar de añadida como un módulo aparte: redactando correos de seguimiento, resumiendo el historial de un trato. Lanzado en 10 idiomas, con detección automática de idioma. Multi-tenant desde el primer día, **reforzado a nivel de base de datos** con seguridad a nivel de fila (RLS) de Postgres, con una suite de pruebas completa y su propio pipeline de CI/CD que despliega en un VPS autogestionado. El producto, la marca y toda la construcción los hice yo.',
      role: 'Producto, marca, construcción',
      shorthand: 'CRM multi-tenant para agencias',
      imageAlt: 'Tessel, un CRM y ERP multi-tenant para agencias',
      galleryAlt: [
        'El panel de inicio de Tessel en un portátil: valor del pipeline, proyectos activos y una tarea atrasada con un correo de seguimiento redactado por IA abierto al lado, un selector de tono con "Formal, Cercano, Breve"',
        'Un teléfono girando para mostrar la pantalla de inicio de Tessel, con el mismo correo de seguimiento redactado por IA y el mismo selector de tono que en el portátil',
        'El tablero de tareas de Tessel en un portátil, columnas para Por hacer, En curso, En revisión y Hecho',
        'Un teléfono girando para mostrar la navegación móvil de Tessel: Inicio, Notas y Conversaciones, y después las secciones de Ventas y Proyectos',
      ],
      videoPosterAlt:
        'El logotipo de Tessel, con el eslogan "Toda tu agencia, en una sola herramienta."',
    },
    'paddock-notes': {
      kind: 'Código abierto',
      description:
        'Un sitio no oficial que explica la Fórmula 1 con datos: la temporada en curso carrera a carrera, análisis de estrategia, ritmo y telemetría de cada carrera desde 2023, y un simulador del campeonato para jugar con el "¿y si...?". La web, la API y la ingesta de datos funcionan como tres Cloudflare Workers separados, y después de cada carrera un workflow precalcula los análisis, así que **ninguna página espera nunca a una API externa**. Escrito en inglés, español y alemán, construido según WCAG 2.2 AA, y el núcleo del sitio funciona con JavaScript desactivado. Las 36 decisiones de arquitectura están documentadas en el repositorio.',
      role: 'Producto, diseño y construcción',
      shorthand: 'Análisis de datos de F1',
      imageAlt: 'Paddock Notes, la Fórmula 1 explicada con datos',
    },
    northbridge: {
      kind: 'Marca ficticia',
      description:
        'Una fiduciaria y firma contable ficticia en Zúrich, con brief, branding y fotografía (generada por IA) construidos desde cero por mí. Cinco idiomas, cinco países, y **un motor de plazos fiscales que calcula las fechas reales y verificadas de cada país** en lugar de fijarlas a mano, de modo que el calendario del año siguiente ya es correcto.',
      role: 'Brief, marca y construcción',
      shorthand: 'Fiduciaria ficticia de Zúrich',
      imageAlt:
        'La portada de Northbridge en un portátil, con el titular "Your numbers, under control." junto a la luz del sol que entra por una ventana en arco',
      galleryAlt: [
        'La portada de Northbridge en un portátil, con el titular "Your numbers, under control." junto a la luz del sol que entra por una ventana en arco',
        'Un móvil sujeto con las dos manos, abierto en la sección de primera consulta gratuita: sin compromiso, precio cerrado después y una única persona de contacto, sobre los cuatro asesores en marcos con forma de arco',
        'El calendario fiscal en un portátil, con el titular "Your tax year, at a glance.", todos los plazos del año y el siguiente, el 30 de noviembre para el IVA del tercer trimestre, destacado aparte',
        'El mismo calendario fiscal en un móvil, desplazado hasta noviembre, con el siguiente plazo marcado junto al día de hoy',
      ],
    },
    'santo-corte': {
      kind: 'Marca ficticia',
      description:
        'Una marca de barbería ficticia, con brief y branding incluidos, inventada y construida desde cero por mí. El brief pedía un sitio folleto básico que más adelante pudiera crecer hacia un sistema de reservas; lo que se construyó va más allá: un hero a pantalla completa que, al hacer scroll, recorre **una secuencia de canvas de 300 fotogramas con transparencia alfa real** en lugar de un vídeo, con GSAP y Lenis animando todo lo que hay debajo, con alternativa de movimiento reducido en todo el sitio.',
      role: 'Brief, marca y construcción',
      shorthand: 'Marca ficticia de barbería',
      imageAlt:
        'La portada de Santo Corte en un portátil apoyado en un sillón de cuero, con las tijeras grabadas suspendidas sobre un interior de barbería en penumbra',
      galleryAlt: [
        'La portada de Santo Corte en un portátil apoyado en un sillón de cuero, con las tijeras grabadas suspendidas sobre un interior de barbería en penumbra',
        'La carta de servicios en un móvil de pie sobre un bloque de hormigón rugoso, cada corte y afeitado con su duración y su precio',
        'La sección del estudio en un portátil sobre un taburete, una cuadrícula de fotos numeradas del interior de la barbería',
        'Un móvil sobre hormigón, abierto en la sección "La Experiencia" del sitio',
      ],
    },
    marqo: {
      kind: 'SaaS',
      description:
        'Mi primer SaaS: una calculadora para el sector del motor que dice a compradores y concesionarios qué compra tiene realmente sentido. La estrategia de producto, la marca, el sitio de marketing y **toda la construcción** los hice yo.',
      role: 'Producto, marca, construcción y crecimiento',
      shorthand: 'SaaS de venta de coches',
      imageAlt:
        'Calculadora de decisión de compra Marqo para el sector del motor',
      galleryAlt: [
        'La página de inicio de Marqo en un portátil, con un titular que pregunta cuánto se ganó realmente con este coche',
        'Tres pantallas de móvil una junto a otra: stock, la calculadora de compra y las alertas',
        'El panel de Marqo en una tablet, mostrando coches en stock, dinero inmovilizado y margen medio',
        'El sitio de Marqo abierto en el navegador de un móvil, sujetado con ambas manos',
      ],
    },
  },
}

export function getProjects(locale: Locale): readonly Project[] {
  if (locale === 'en') return projects

  const t = projectTranslations[locale]
  return projects.map((project) => {
    const tr = t[project.slug]
    if (!tr) return project

    return {
      ...project,
      kind: tr.kind,
      description: tr.description,
      role: tr.role,
      shorthand: tr.shorthand,
      imageAlt: tr.imageAlt,
      gallery: tr.galleryAlt
        ? project.gallery.map((image, i) => ({
            ...image,
            alt: tr.galleryAlt?.[i] ?? image.alt,
          }))
        : project.gallery,
      video:
        project.video && tr.videoPosterAlt
          ? { ...project.video, posterAlt: tr.videoPosterAlt }
          : project.video,
    }
  })
}

type DisciplineTranslation = Pick<Discipline, 'name' | 'claim' | 'body'>

const disciplineTranslations: Record<
  'de' | 'es',
  readonly DisciplineTranslation[]
> = {
  de: [
    {
      name: 'Full-Stack-Entwickler',
      claim: 'Ich baue es selbst',
      body: 'Echte Produkte, keine Mockups: Firmenwebsites, Landingpages, Marketing-Automation, SaaS, Web-Apps, interne Software. Ich bringe sie vom Frontend bis zum Deployment, wobei Coding-Agenten echte Arbeit neben mir leisten statt nur im Editor zu autovervollständigen. Es gibt keine Übergabe, weil es niemanden gibt, an den übergeben werden könnte.',
    },
    {
      name: 'Full-Stack-MarTech-Spezialist',
      claim: 'Ich weiss, warum es verkauft',
      body: 'Zuerst die Strategie, dann der MarTech-Stack, der ihr dient: SEO, Paid Acquisition, Social Media, Landingpages, CRO, E-Mail und die Automation dahinter. Sieben Jahre davon, bevor ich eine einzige Zeile Produktionscode geschrieben habe, weshalb ich schon beim Bauen an Konversion denke, nicht erst danach.',
    },
  ],
  es: [
    {
      name: 'Desarrollador full-stack',
      claim: 'Lo construyo yo mismo',
      body: 'Productos reales, no maquetas: sitios corporativos, landing pages, automatización de marketing, SaaS, aplicaciones web, software interno. Los llevo desde el frontend hasta el despliegue, con agentes de codificación haciendo trabajo real a mi lado en lugar de solo autocompletar en el editor. No hay traspaso, porque no hay nadie a quien traspasar.',
    },
    {
      name: 'Especialista full-stack en MarTech',
      claim: 'Sé por qué vende',
      body: 'Primero la estrategia, después el stack de MarTech que la sirve: SEO, adquisición de pago, redes sociales, landing pages, CRO, email y la automatización detrás de todo ello. Siete años haciendo esto antes de escribir una sola línea de código en producción, por eso ya pienso en conversión mientras construyo, no después.',
    },
  ],
}

export function getDisciplines(locale: Locale): readonly Discipline[] {
  if (locale === 'en') return disciplines

  const t = disciplineTranslations[locale]
  return disciplines.map((discipline, i) => ({
    ...discipline,
    ...t[i],
  }))
}

type MilestoneTranslation = Pick<Milestone, 'label' | 'detail'>

const timelineTranslations: Record<
  'de' | 'es',
  readonly MilestoneTranslation[]
> = {
  de: [
    {
      label: 'Einstieg ins Marketing',
      detail: 'Gelernt, was Leute zum Klicken, Kaufen und Wiederkommen bringt.',
    },
    {
      label: 'Webentwicklung studiert',
      detail:
        'Ich wollte die Produkte selbst bauen, nicht nur das Briefing dafür schreiben.',
    },
    {
      label: 'KI-nativ geworden',
      detail:
        'Täglich Coding-Agenten, plus die Tools, die ich darum herum baue.',
    },
  ],
  es: [
    {
      label: 'Empecé en marketing',
      detail: 'Aprendiendo qué hace que la gente haga clic, compre y vuelva.',
    },
    {
      label: 'Estudié desarrollo web',
      detail:
        'Quería construir los productos, no solo escribir el brief para ellos.',
    },
    {
      label: 'Me volví nativo en IA',
      detail:
        'Agentes de codificación cada día, además de las herramientas que construyo a su alrededor.',
    },
  ],
}

export function getTimeline(locale: Locale): readonly Milestone[] {
  if (locale === 'en') return timeline

  const t = timelineTranslations[locale]
  return timeline.map((milestone, i) => ({ ...milestone, ...t[i] }))
}

const learningTranslations: Record<'de' | 'es', readonly string[]> = {
  de: ['Server & Infrastruktur', 'Deutsch'],
  es: ['Servidores e infraestructura', 'Alemán'],
}

export function getLearning(locale: Locale): readonly string[] {
  if (locale === 'en') return learning
  return learningTranslations[locale]
}
