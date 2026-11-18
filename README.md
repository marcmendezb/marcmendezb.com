# marcmendez.com

Personal landing page of Marc Mendez, full-stack developer and marketing
technologist, based in the Zürich area.

Static Next.js site. No database, no API, no third-party scripts. Every route is
prerendered at build time, so it can be hosted anywhere.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server, plus a terminal checklist of unfilled placeholders |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm check` | Typecheck + lint + format check — what CI runs |
| `pnpm format` | Apply Prettier |

---

## Launch checklist

The site runs fine as-is, but a few fields are deliberately left empty rather
than guessed. `pnpm dev` lists whatever is still outstanding.

**Everything below lives in [`src/content/site.ts`](src/content/site.ts) and
[`src/content/projects.ts`](src/content/projects.ts). No component needs
touching.**

- [ ] **Domain** — set `NEXT_PUBLIC_SITE_URL`, or edit `site.url`. Drives
      canonical URLs, OG tags, `sitemap.xml` and `robots.txt`.
- [ ] **LinkedIn + GitHub** — `site.socials` currently holds guessed profile
      URLs. These also feed the `sameAs` field in the JSON-LD, which is how
      Google links this page to your profiles.
- [ ] **CV** — drop the PDF in `public/`, set `site.cvPath`. Every download
      button stays hidden until you do.
- [ ] **Project links + screenshots** — four projects (`tessel`,
      `agency-tracker`, `client-sites`, `ai-tooling`) have no live URL,
      and the same four are still showing Marqo's own screenshots as
      stand-ins (`projects[].gallery`). A project with no `href` renders
      without a link rather than a dead `#`, but a borrowed screenshot reads
      as finished and wrong — this is the one item here that must not go
      live as-is.
- [ ] **Project outcomes** — `projects[].outcome` is `null` on 7 of 7
      projects. A number ("first 200 users in 6 weeks", "0.9s LCP") is the
      single biggest upgrade available to this page.
- [ ] **Education institutions** — `site.education[].institution` is `null`
      on 4 of 5 entries. Held back deliberately rather than guessed; not
      rendered on the page even once filled in, but worth completing for a
      fuller CV export later.

`pnpm dev` is the source of truth for all of the above — it reprints the
current count on every server start, so this list can drift and the
terminal won't.

---

## How it's put together

```
src/
├── app/
│   ├── layout.tsx           Metadata, fonts, JSON-LD, no-JS fallback
│   ├── page.tsx             Section composition
│   ├── globals.css          Design tokens + the bespoke animations
│   ├── icon.png · apple-icon.png   Static favicons
│   ├── opengraph-image.tsx  Social card, generated at build
│   ├── sitemap.ts · robots.ts · manifest.ts
│   └── not-found.tsx
├── components/              One file per section, plus nav/reveal/media
├── content/                 ← all copy and personal data
└── lib/                     Structured data, in-view hook, config check
```

**Content is separated from presentation.** Components read from `content/`;
they never hard-code a name, URL or date. Updating the site means editing two
typed files.

### Styling

Tailwind v4 for layout and typography. Design tokens are plain CSS custom
properties registered through `@theme inline`, which is what lets a single
`prefers-color-scheme` media query repaint the whole site — `text-ink` resolves
to `var(--ink)` rather than a baked-in hex.

The signature motion — the sliding nav highlight, the masked text swaps, the
curtain wipes — stays in hand-written CSS in `globals.css`. Utilities are the
wrong tool for that, and it's all keyed off `data-` attributes so the JavaScript
never touches styles.

### Colour

Monochrome, with one accent: `#2438e0`. The rule is that blue only ever marks
**interaction** — every hover and focus state, the nav pill, the skip link, text
selection — plus exactly one status signal, the "available" dot. Nothing static
and nothing decorative is blue, which is what keeps it reading as intentional.

Filled hover states swap `border-color` alongside the background; without that
you get a black outline ringing a blue fill.

There is one palette. The site renders light even on a device set to dark:
`color-scheme: light` on `:root` covers the parts the tokens don't, so form
controls, scrollbars and the canvas can't arrive inverted underneath. Verified
with axe-core at 1440px and 390px, on devices set to both preferences: zero
violations.

### Motion

One rehearsed overture, one signature move, and micro-interactions only where
they mark interaction. All of it is CSS; the motion system ships zero
JavaScript.

**Overture.** The headline arrives word by word (70ms stagger, `--i` from
`SplitWords` driving `animation-delay`), then the support copy, screening facts
and buttons fade up on offsets. Word-level rather than line-level: a line
sliding in reads as a slide, words arriving in sequence read as typesetting.
Pure CSS animation, so it starts at first paint rather than after hydration.

**The signature move.** The About lead is set in `--mute` and inks to `--ink`
word by word as the paragraph crosses the viewport, so the sentence writes
itself as you read it. Un-inked words sit at the AA floor rather than at
near-invisible `--hair`: the dramatic version left real content at ~1.4:1 for
anyone who stopped scrolling mid-sentence.

**Scroll-driven layer.** The ink line and the image parallax use native CSS
`animation-timeline`. No scroll listeners, and the animations run off the main
thread. Both are wrapped in `@supports (animation-timeline: view())` with each
element's *default* state being its *final* state, so Firefox gets the finished
page rather than a broken one.

`--i` and `--n` are registered with `@property` so the `calc()` in
`animation-delay` and `animation-range` resolves reliably. They're set on the
element that reads them, not on a parent: they're declared `inherits: false`,
so a value on the wrapper silently resolves to 0 in the child.

**Smooth scrolling** (Lenis, the one motion dependency) is deliberately
constrained, because smooth scroll is the effect most often done badly:

- **Off under `prefers-reduced-motion`.** Scroll smoothing is a vestibular
  trigger, and there's no meaningful "reduced" version of it to ship.
- **Off on touch.** The OS tunes native momentum; `syncTouch` is the main reason
  sites with smooth scroll feel broken on phones.
- **Short.** `lerp: 0.09`, settling in roughly 250ms. Perceptible on a trackpad,
  which already has its own momentum, without the lag people associate with
  smooth scroll: that comes from near-second durations. Below about 0.04 it
  starts to fight the user.
- **Nothing else intercepted.** Lenis moves the real scroll position rather than
  transforming a wrapper, so keyboard scrolling, scrollbar dragging,
  find-in-page and focus scrolling all behave normally — and the CSS scroll
  timelines stay in sync, since they read the same scroller.

Two integration details worth keeping: the mobile overlay calls
`pauseSmoothScroll()` alongside its body lock (`overflow: hidden` alone doesn't
stop Lenis's own loop), and `anchors` takes no offset because
`scroll-padding-top` already clears the fixed nav — setting both landed anchored
sections 128px down instead of 64.

Everything honours `prefers-reduced-motion`: words at rest, sentence fully
inked, roadmap shown complete, scrolling native.

### Accessibility

- Skip link as the first tab stop
- Mobile overlay is `inert` while closed, traps focus while open, closes on
  Escape and returns focus to the button
- `aria-current` tracks the visible section; the duplicated nav labels used by
  the hover animation are `aria-hidden`
- Scroll reveals have a `<noscript>` fallback — without it, About and Contact
  render blank for anyone with JavaScript disabled

### SEO

Full metadata, Open Graph and Twitter cards, canonical URLs, sitemap and robots.
JSON-LD describes a `Person`, a `WebSite` and the work as an `ItemList` — that's
what lets a search engine resolve "Marc Mendez" to a person rather than a
string, and it's server-rendered so crawlers that don't run JavaScript still see
it.

---

## Deploying

Every route is static, so any host works.

**With a Next.js runtime** (Vercel, Netlify, Cloudflare Pages) — connect the
repo. Nothing to configure. `next.config.ts` sets the security headers.

**Without one** (GitHub Pages, S3, nginx) — uncomment the two `output: 'export'`
lines at the bottom of `next.config.ts` and run `pnpm build`; the site lands in
`out/`. Note that `headers()` is a no-op under static export, so configure the
CSP and friends on your CDN instead.

### A note on the CSP

`script-src` includes `'unsafe-inline'`. Next.js bootstraps hydration with
inline scripts, so without it React never hydrates and the navigation is dead —
and the build doesn't catch it, only loading the page does. The strict
alternative is a per-request nonce, which forces dynamic rendering and gives up
the static output. For a page with no user input, no auth and no third-party
scripts there's no injection vector to defend against. Revisit that trade the
moment this site accepts input.

### Keeping dependencies patched

Run `pnpm audit` before any deploy you care about. Next.js itself has shipped
a handful of critical RCE advisories across the 16.x line — this repo tracks
the latest patch release for that reason, not just for features.

`package.json` pins a few transitive versions via `pnpm.overrides`
(`brace-expansion`, `source-map-js`, `zod`, `minimatch`). All four sit several
layers deep inside ESLint's and Tailwind's own toolchains — dev-time only,
never shipped to the built site — but `pnpm audit` flags them regardless, and
overriding them keeps the audit output meaningful instead of permanently
noisy. One advisory (`picomatch`, also dev-only) has no upstream fix yet;
re-run `pnpm audit` periodically and drop the override that's no longer
needed once one lands.
