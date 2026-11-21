// The Worker's entry point: a thin wrapper around the one OpenNext generates
// at build time (`.open-next/worker.js`, see `wrangler.jsonc`).
//
// It settles the address before Next.js sees the request. On the site's own
// domain, a request over plain http or on the www host is sent, in one 301,
// to https on the bare domain: one canonical address per page, with the HSTS
// header taking over after the first visit. Kept in the Worker rather than as
// zone rules in the Cloudflare dashboard so it lives in the repository and
// ships with it.
//
// Every other host passes straight through untouched: the workers.dev
// address, and localhost under `pnpm preview`, where an http-to-https
// redirect would lock the preview out.

import handler from './.open-next/worker.js'

const CANONICAL_HOST = 'marcmendezb.com'
const HOSTS = new Set([CANONICAL_HOST, `www.${CANONICAL_HOST}`])

const worker = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (
      HOSTS.has(url.hostname) &&
      (url.protocol === 'http:' || url.hostname !== CANONICAL_HOST)
    ) {
      url.protocol = 'https:'
      url.hostname = CANONICAL_HOST
      return Response.redirect(url.toString(), 301)
    }

    return handler.fetch(request, env, ctx)
  },
}

export default worker
