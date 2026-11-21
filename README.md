# marcmendezb.com

> Personal landing page of Marc Mendez: full-stack developer and MarTech specialist based near Zürich. Seven years in marketing, three building products.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2_AA-green.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Languages](https://img.shields.io/badge/Locales-EN_|_DE_|_ES-f59e0b.svg)](#localization--seo)

Static Next.js site. No database, no API, no third-party tracking scripts. Every page is prerendered at build time in English, German and Spanish; the only code that runs per request is the small route that sends `/` to the visitor's language. It runs as a Cloudflare Worker.

**This repo is public on purpose.** If you are a recruiter or hiring manager reading this, treat it as a production work sample rather than just the code behind a portfolio: it applies the exact same software and marketing practices described in the client work it showcases.

---

## Screening facts

| Fact | Value | Notes |
| --- | --- | --- |
| **Role** | Full-stack developer & MarTech specialist | Seven years marketing, three building products |
| **Location** | Winterthur / Zürich area, Switzerland | On-site, hybrid, or remote |
| **Eligibility** | EU citizen | No Swiss work permit needed |
| **Availability** | Immediate | Available now |
| **Languages** | English (B2), German (A1, learning), Spanish (Native), Catalan (Native) | Full UI localized in EN, DE, ES |

---

## Where to look in the code

Rather than taking claims on faith, here are the concrete implementation choices worth inspecting:

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml): Route type generation, typecheck, lint, Prettier, production build and `pnpm audit` on every push. The [Actions tab](https://github.com/marcmendezb/marcmendezb/actions) has the history.
- [`src/app/route.ts`](src/app/route.ts): Route handler negotiating root visits to `/en`, `/de`, or `/es` via the `Accept-Language` header, with English fallback.
- [`next.config.ts`](next.config.ts): Content Security Policy (CSP) and HTTP security headers, documented with the exact trade-offs made for static generation.
- [`tsconfig.json`](tsconfig.json): Strict TypeScript configuration with `noUncheckedIndexedAccess`, `noUnusedLocals`, and `noUnusedParameters`, not just `strict: true`.
- [`src/content/`](src/content/): Complete separation of content and presentation. Components never hard-code copy, URLs, or dates; copy is typed and localized across three languages.
- [`src/app/globals.css`](src/app/globals.css): Bespoke motion design using native CSS `animation-timeline: view()` and `@property` Houdini registrations. Zero runtime JavaScript for layout animations.
- [`src/lib/config-check.ts`](src/lib/config-check.ts): Build-time validation that alerts in the terminal on `pnpm dev` if any required placeholder remains unconfigured.

---

## How it is put together

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx         Metadata, fonts, JSON-LD, hreflang alternates
│   │   ├── page.tsx           Section composition (Hero, Disciplines, Work, About, Contact)
│   │   ├── opengraph-image.tsx Social share image dynamically generated per locale
│   │   └── not-found.tsx      Localized 404 page
│   ├── globals.css            Tailwind v4 tokens, CSS Houdini properties, and animations
│   ├── icon.png · apple-icon.png Favicons
│   ├── manifest.ts · robots.ts · sitemap.ts
│   ├── route.ts               `/` → browser-language redirect
│   └── not-found.tsx          Root 404 fallback
├── components/                Individual section views and UI primitives
├── content/                   Typed single source of truth for site and project copy
├── i18n/                      Locale definitions and routing configuration
└── lib/                       Structured data generators, smooth scroll, and config check
```

**Content is separated from presentation.** Components read from `content/`; they never hard-code a name, URL, or date. Updating the site means editing two typed files (`src/content/site.ts` and `src/content/projects.ts`).

---

## Technical highlights

### Localization & SEO

- **Locale-driven routing:** Every page resolves under `/[locale]` (`/en`, `/de`, `/es`). A route handler at `/` negotiates the visitor's browser language, defaulting to English. A route rather than a proxy (middleware), because it runs on any host without the middleware support some adapters still treat as experimental.
- **Hreflang alternates:** `<link rel="alternate" hreflang="...">` tags for all three locales, dynamic Open Graph social images generated per locale, and a fully localized `sitemap.xml`.
- **Semantic JSON-LD:** Structured data describes a `Person`, a `WebSite`, and projects as an `ItemList`. Search engines resolve "Marc Mendez" to a semantic entity rather than an unstructured string.

### Styling & Swiss International Style

- **Restrained palette:** Monochrome surface with a single accent: `#2438e0`. Blue only marks *interaction* (hover and focus states, nav pill, skip link, text selection) plus the single availability status indicator. Nothing static or decorative is blue.
- **Tailwind CSS v4:** Layout and typography tokens registered through `@theme inline`.
- **One palette, light:** `color-scheme: light` on `:root` prevents form controls, scrollbars, and canvas from inverting unpredictably on dark-mode devices. Verified with axe-core at 1440px and 390px: zero violations.
- **Typography:** Self-hosted Inter with `"Helvetica Neue", Helvetica, Arial` leading the fallback stack, reflecting the Swiss-grotesque lineage. Hierarchy comes from weight and scale with tight negative tracking (`-0.035em` at hero display).

### Motion system: zero JavaScript overhead

- **Page-load overture:** The headline arrives word-by-word with a 70ms stagger (`--i` from `SplitWords` driving CSS `animation-delay`). Word-level animation starts at first paint rather than waiting for JavaScript hydration.
- **Scroll-driven ink effect:** The About lead text inks from `--mute` to `--ink` word-by-word as the paragraph crosses the viewport via native CSS `animation-timeline`. Un-inked words sit at the WCAG AA floor rather than near-invisible hairlines. Wrapped in `@supports (animation-timeline: view())` so unsupported browsers render the complete text.
- **Constrained smooth scroll:** Lenis is strictly tuned:
  - **Off under `prefers-reduced-motion`:** Scroll smoothing is a vestibular trigger, with no reduced-motion equivalent.
  - **Off on touch:** Preserves native OS touch momentum.
  - **Short settle time:** `lerp: 0.09` settling in roughly 250ms, avoiding the perceived sluggishness of long-duration smooth scrolling.
  - **Real scroll position:** Lenis moves the real scroll position rather than transforming a wrapper, keeping keyboard scrolling, find-in-page, and CSS scroll timelines in sync.

### Accessibility

- Skip link as the first tab stop.
- Mobile overlay is `inert` while closed, traps focus while open, closes on Escape, and returns focus to the toggle button.
- `aria-current` tracks the visible section; duplicate nav labels used by hover animations are `aria-hidden`.
- `<noscript>` fallbacks for scroll reveals so content remains fully accessible without JavaScript.

---

## Security & dependency hygiene

### A note on the CSP

`script-src` includes `'unsafe-inline'`. Next.js bootstraps hydration with inline scripts, so without it React never hydrates and navigation is dead; a static build does not catch this, only loading the page in a browser does.

The strict alternative is a per-request nonce, which requires dynamic server rendering and sacrifices static output. For a site with no user input, no authentication, and no third-party scripts, there is no injection vector. Revisit that trade-off if the site ever accepts user input.

### Keeping dependencies patched

`pnpm audit` runs in CI on every push. Next.js has shipped security advisories across the 16.x line, so this repository tracks the latest patch releases proactively.

`package.json` pins transitive versions via `pnpm.overrides` (`brace-expansion`, `source-map-js`, `zod`, `minimatch`). These sit deep inside ESLint and Tailwind dev-time toolchains and never ship to the built site, but overriding them keeps audit output clean and actionable.

---

## Local development

Requirements: Node.js 20.9 or higher and pnpm 10.

```bash
pnpm install
pnpm dev          # Dev server at http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server, plus a terminal checklist of unfilled placeholders |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm preview` | Build the Cloudflare Worker and run it locally in `workerd` at http://localhost:8787 |
| `pnpm deploy` | Build and deploy the Worker with Wrangler (needs `wrangler login`) |
| `pnpm check` | Typecheck + lint + format check (what CI runs) |
| `pnpm format` | Apply Prettier |

---

## Launch checklist

The site runs cleanly as-is, but a few fields are deliberately left empty rather than guessed. Everything lives in `src/content/site.ts` and `src/content/projects.ts`; no component needs touching.

- [ ] **LinkedIn**: Confirm the live profile URL in `site.socials` (it also feeds `sameAs` in the JSON-LD, which is how Google links this page to the profile).
- [ ] **CV**: Drop PDF in `public/` and configure `site.cvPath` to reveal download buttons.
- [ ] **Project outcomes**: Add concrete quantitative metrics to `projects[].outcome` where available.
- [ ] **Education institutions**: Complete institution names in `site.education[].institution`.

`pnpm dev` prints the status of remaining placeholders on every server start.

---

## Deploying

The site runs on **Cloudflare Workers** through [OpenNext](https://opennext.js.org/cloudflare), Cloudflare's own Next.js integration. Nothing to provision: no KV, no R2, no database.

- [`wrangler.jsonc`](wrangler.jsonc): the Worker. Static assets plus the Cloudflare Images binding that backs `next/image` (resizing and AVIF/WebP).
- [`open-next.config.ts`](open-next.config.ts): every page is prerendered and never revalidates, so the incremental cache is the read-only one served from the Worker's static assets.
- [`public/_headers`](public/_headers): headers for files Cloudflare serves straight from static assets. Pages get the full set, CSP included, from `next.config.ts`.

**From GitHub (Workers Builds).** Cloudflare dashboard → Workers & Pages → Create → Import a repository, then:

| Setting | Value |
| --- | --- |
| Project name | `marcmendezb` (must match `name` in `wrangler.jsonc`) |
| Build command | `pnpm build:worker` |
| Deploy command | `pnpm exec opennextjs-cloudflare deploy` |
| Non-production branch deploy command | `pnpm exec opennextjs-cloudflare upload` |

Every push to `main` then builds and deploys. Attach the custom domain under the Worker's Settings → Domains & Routes. `NEXT_PUBLIC_SITE_URL` (a build variable) overrides the canonical origin, which defaults to `https://marcmendezb.com`.

**From the terminal.** `pnpm preview` to check the Worker locally, `pnpm deploy` to ship it.

---

## Contact

**Marc Mendez**  
- Website: [marcmendezb.com](https://marcmendezb.com)  
- GitHub: [@marcmendezb](https://github.com/marcmendezb)  
- Email: [marcmendezb@gmail.com](mailto:marcmendezb@gmail.com)  
