import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

/**
 * Cloudflare Workers build, through OpenNext.
 *
 * Every page on this site is prerendered at build time and nothing ever
 * revalidates, so the incremental cache is the read-only one backed by the
 * Worker's own static assets: no KV, no R2, nothing to provision. Cache
 * interception answers a prerendered page straight from that cache without
 * booting the Next.js server, which is most of what a request here is.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
})
