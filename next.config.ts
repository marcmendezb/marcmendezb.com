import type { NextConfig } from 'next'

/**
 * Security headers.
 *
 * On `script-src 'unsafe-inline'`: Next.js bootstraps hydration with inline
 * <script> tags, so a bare `script-src 'self'` blocks them and React never
 * hydrates (error #412) — the page renders but every interactive piece, the
 * navigation included, is dead. The build does not catch this; only loading the
 * page does.
 *
 * The strict alternative is a per-request nonce set in `proxy.ts`, but that
 * forces dynamic rendering and gives up the fully-static output this site is
 * built around. For a static page with no user input, no auth and no
 * third-party scripts, there's no injection vector for `script-src` to defend
 * against, so the trade is worth making. Revisit it the moment this site starts
 * accepting input or rendering anything user-supplied.
 *
 * `style-src` needs 'unsafe-inline' for the same reason: Next.js inlines the
 * critical CSS for the first paint.
 *
 * On `'unsafe-eval'` in development only: React's development build uses eval()
 * for debugging features — reconstructing a callstack that came from somewhere
 * else, among others — and without it the browser logs an error on every load.
 * React never uses eval() in production, so the directive is granted to the dev
 * server and withheld from everything that ships. Keeping it out of the
 * production policy is the whole point: `'unsafe-eval'` turns any string that
 * reaches an interpreter into executable code, which is the one thing a CSP is
 * there to prevent.
 */
const isDev = process.env.NODE_ENV !== 'production'

const csp = [
  "default-src 'self'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  // The headers that do the real work on a static site: no framing, no plugin
  // content, no <base> hijacking.
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Fail the production build on type errors rather than shipping them.
  // (Next.js 16 dropped the `eslint` key — linting runs via `pnpm lint` and CI.)
  typescript: { ignoreBuildErrors: false },

  // Pin the workspace root. Without this, Turbopack walks up looking for a
  // lockfile, finds a stray package-lock.json in the home directory and infers
  // the whole home folder as the project root.
  turbopack: { root: import.meta.dirname },

  // Don't leak the framework version in response headers.
  poweredByHeader: false,

  // Emit `/about/` style URLs so the site behaves identically on Vercel,
  // Cloudflare Pages, Netlify and a plain static host.
  trailingSlash: true,

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },

  // ---------------------------------------------------------------------------
  // Static export
  // ---------------------------------------------------------------------------
  // This site is fully static. To deploy to a host without a Next.js runtime
  // (GitHub Pages, plain S3/nginx), uncomment the two lines below and run
  // `pnpm build` — the site is emitted to `out/`.
  //
  // Note: `headers()` above is a no-op under static export; configure the same
  // headers on your CDN/web server instead.
  //
  // output: 'export',
  // images: { unoptimized: true, formats: ['image/avif', 'image/webp'] },
}

export default nextConfig
