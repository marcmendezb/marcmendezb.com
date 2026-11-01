import { previewGallery, previewPoster, projects } from '@/content/projects'
import { site } from '@/content/site'

/**
 * Development-only reminder of everything still on its placeholder value.
 *
 * The point is that an unfinished site should nag you in the terminal rather
 * than quietly go live with a placeholder email and three dead project
 * links. Runs on the server during `pnpm dev`; compiled out of production.
 */
export function reportPlaceholders() {
  if (process.env.NODE_ENV !== 'development') return

  const todo: string[] = []

  if (
    site.url.includes('marcmendez.com') &&
    !process.env.NEXT_PUBLIC_SITE_URL
  ) {
    todo.push('site.url — still the default domain (set NEXT_PUBLIC_SITE_URL)')
  }
  if (!site.cvPath) {
    todo.push('site.cvPath — no CV yet; every download button is hidden')
  }
  if (!site.hiring.workEligibility) {
    todo.push(
      'site.hiring.workEligibility — unset; Swiss recruiters screen on this first',
    )
  }
  for (const social of site.socials) {
    if (social.href.endsWith('/marcmendez')) {
      todo.push(
        `site.socials — ${social.label} URL built from your handle, unverified`,
      )
    }
  }
  const outcomeless = projects.filter((project) => !project.outcome)
  if (outcomeless.length > 0) {
    todo.push(
      `projects — ${outcomeless.length} with no outcome; one real number each is the biggest win available`,
    )
  }
  /* A link with no destination does not count as having one, or Tessel would
     drop off this list by virtue of two buttons that go nowhere. */
  const linkless = projects.filter(
    (project) => !project.links.some((link) => link.href !== null),
  )
  if (linkless.length > 0) {
    todo.push(
      `projects — ${linkless.length} without a live URL (${linkless
        .map((project) => project.slug)
        .join(', ')})`,
    )
  }
  /* Borrowed art is its own item, and a louder one than a missing image: a grey
     panel reads as unfinished, whereas someone else's screenshot on your card
     reads as finished and wrong. Identity comparison, not contents — a project
     that happens to ship four images is not borrowing anything. */
  const borrowed = projects.filter(
    (project) =>
      project.gallery === previewGallery ||
      project.video?.poster === previewPoster,
  )
  if (borrowed.length > 0) {
    todo.push(
      `projects — ${borrowed.length} are showing MARQO'S screenshots as stand-ins ` +
        `(${borrowed.map((project) => project.slug).join(', ')}); these must not go live`,
    )
  }

  /* A project with a gallery has pictures whether or not `image` is set, so it
     is not on a placeholder panel. Counting on `image` alone had Marqo, the one
     project with four real screenshots, listed as still unillustrated. */
  const imageless = projects.filter(
    (project) => !project.image && project.gallery.length === 0,
  )
  if (imageless.length > 0) {
    todo.push(
      `projects — ${imageless.length} still showing the placeholder panel`,
    )
  }

  if (todo.length === 0) return

  console.warn(
    `\n\x1b[33m▲ ${todo.length} item(s) still to fill in before launch\x1b[0m\n` +
      todo.map((item) => `  · ${item}`).join('\n') +
      '\n  See the launch checklist in README.md\n',
  )
}
