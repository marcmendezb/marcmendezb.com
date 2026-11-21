import { getProjects, previewGallery, previewPoster } from '@/content/projects'
import { getSite } from '@/content/site'

/**
 * Development-only reminder of everything still on its placeholder value.
 *
 * The point is that an unfinished site should nag you in the terminal rather
 * than quietly go live with a placeholder email and three dead project
 * links. Runs on the server during `pnpm dev`; compiled out of production.
 *
 * Checked against English only. Nullability (a missing URL, an unset
 * institution) is a property of the data, not of the language it's read in,
 * so checking all three locales would just print the same list three times.
 */
export function reportPlaceholders() {
  if (process.env.NODE_ENV !== 'development') return

  const site = getSite('en')
  const projects = getProjects('en')
  const todo: string[] = []

  if (!site.hiring.workEligibility) {
    todo.push(
      'site.hiring.workEligibility: unset; Swiss recruiters screen on this first',
    )
  }
  /* A link with no destination does not count as having one. A project that
     offers a call instead (Tessel, in development and not public) has no URL
     by design, so it is not a gap to fill. */
  const linkless = projects.filter(
    (project) =>
      !project.links.some(
        (link) => link.href !== null || link.action === 'contact',
      ),
  )
  if (linkless.length > 0) {
    todo.push(
      `projects: ${linkless.length} without a live URL (${linkless
        .map((project) => project.slug)
        .join(', ')})`,
    )
  }
  /* Borrowed art is its own item, and a louder one than a missing image: a grey
     panel reads as unfinished, whereas someone else's screenshot on your card
     reads as finished and wrong. Identity comparison, not contents: a project
     that happens to ship four images is not borrowing anything. */
  const borrowed = projects.filter(
    (project) =>
      project.gallery === previewGallery ||
      project.video?.poster === previewPoster,
  )
  if (borrowed.length > 0) {
    todo.push(
      `projects: ${borrowed.length} are showing another project's images as stand-ins ` +
        `(${borrowed.map((project) => project.slug).join(', ')}); these must not go live`,
    )
  }

  /* A project with a gallery has pictures whether or not `image` is set, so it
     is not on a placeholder panel. Counting on `image` alone had Marqo, the one
     project with four real screenshots, listed as still unillustrated. */
  const imageless = projects.filter(
    (project) =>
      !project.image && project.gallery.length === 0 && !project.confidential,
  )
  if (imageless.length > 0) {
    todo.push(
      `projects: ${imageless.length} still showing the placeholder panel`,
    )
  }

  if (todo.length === 0) return

  console.warn(
    `\n\x1b[33m▲ ${todo.length} item(s) still to fill in before launch\x1b[0m\n` +
      todo.map((item) => `  · ${item}`).join('\n') +
      '\n  See "Left out on purpose" in README.md for what is off the page by design\n',
  )
}
