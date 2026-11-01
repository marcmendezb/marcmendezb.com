import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page not found',
  // A 404 should never be indexed or accumulate link equity.
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="px-edge flex min-h-svh flex-col justify-center">
      <p className="text-mute text-sm">404</p>
      <h1 className="mt-3 max-w-[14ch] text-[clamp(2.2rem,7vw,4.5rem)] leading-[1] font-semibold tracking-[-0.035em]">
        This page doesn&rsquo;t exist.
      </h1>
      <Link
        href="/"
        className="wipe-fill border-ink ease-brand hover:border-accent hover:text-on-accent mt-8 inline-block w-fit rounded-full border px-[22px] py-3 text-sm font-medium transition-colors duration-300"
      >
        Back home
      </Link>
    </main>
  )
}
