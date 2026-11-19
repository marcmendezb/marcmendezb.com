import { Carousel } from '@/components/carousel'
import { Emphasis } from '@/components/emphasis'
import { DeckIndex } from '@/components/deck-index'
import { Media } from '@/components/media'
import { ProjectVideo } from '@/components/project-video'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { ToolPills } from '@/components/tool-pills'
import { getProjects } from '@/content/projects'
import type { Locale } from '@/i18n/locales'
import { toolkitLabel } from '@/lib/toolkit-label'

const title: Record<Locale, string> = {
  en: 'Selected work',
  de: 'Ausgewählte Projekte',
  es: 'Proyectos seleccionados',
}

const meta = (count: number, locale: Locale): string => {
  switch (locale) {
    case 'de':
      return `${count} Projekte | Produkte, Kundenarbeit und F&E`
    case 'es':
      return `${count} proyectos | productos, trabajo para clientes e I+D`
    default:
      return `${count} projects | products, client work and R&D`
  }
}

const projectCount = (index: number, total: number, locale: Locale): string => {
  switch (locale) {
    case 'de':
      return `Projekt ${index} von ${total}`
    case 'es':
      return `Proyecto ${index} de ${total}`
    default:
      return `Project ${index} of ${total}`
  }
}

const notAvailableYet = (title: string, locale: Locale): string => {
  switch (locale) {
    case 'de':
      return ` für ${title}, noch nicht verfügbar`
    case 'es':
      return ` para ${title}, no disponible aún`
    default:
      return ` for ${title}, not available yet`
  }
}

const opensInNewTab = (title: string, locale: Locale): string => {
  switch (locale) {
    case 'de':
      return ` für ${title}, öffnet in einem neuen Tab`
    case 'es':
      return ` para ${title}, se abre en una pestaña nueva`
    default:
      return ` for ${title}, opens in a new tab`
  }
}

export function Work({ locale }: { locale: Locale }) {
  const projects = getProjects(locale)

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="pb-[clamp(40px,8vh,90px)]"
    >
      {/* The section no longer owns the side padding. Each slide has to paint
          edge to edge to hide the one pinned underneath it, so the padding
          moved onto the slides themselves and the heading keeps its own. */}
      <div className="px-edge">
        <SectionHeading
          id="work-heading"
          title={title[locale]}
          meta={meta(projects.length, locale)}
        />
      </div>

      {/* One project per screen. `data-snap` is what SmoothScroll reads to
          register the slides with Lenis, so the scroll settles on a project
          instead of halfway between two.

          The gap is gone: each article is a viewport tall and carries its own
          breathing room, and a gap on top of that just pushed the next slide
          out of alignment with the screen. */}
      <DeckIndex projects={projects} locale={locale} />

      <div className="grid">
        {projects.map((project, index) => {
          // Alternate which side the image sits on, but only once there are two
          // columns to alternate between.
          const mediaSecond = index % 2 === 1

          return (
            /* Each slide pins itself to the top of the screen and the next one
               rides up over it, so the section reads as a deck being dealt
               rather than a list being scrolled.

               `bg-surface` is not decoration: without an opaque slide there is
               nothing to cover the pinned one underneath and you see both at
               once.

               Nothing marks the leading edge: no outline, no radius, no
               shadow. Where a card rides over the previous one's photograph the
               boundary shows on its own, and over the white half of the layout
               there is nothing behind it worth separating from.

               Sticky only from 880px. Below it the image and the copy stack and
               a project is taller than the screen, so pinning one would hold
               the top of it in place while the rest scrolled out of reach. */
            <article
              key={project.slug}
              data-snap
              data-index={index}
              className="group bg-surface px-edge grid grid-cols-1 items-center gap-[clamp(20px,4vw,56px)] py-[clamp(56px,9vh,96px)] min-[880px]:sticky min-[880px]:top-0 min-[880px]:min-h-svh min-[880px]:grid-cols-2 min-[880px]:py-0"
            >
              {/* Runs off its own side of the screen and stops short of the
                  other three edges: the negative margin cancels the section's
                  `--edge` padding on the outer side only, and the height is
                  capped below the viewport so there is air above and below.
                  Rounded on the inner corners alone: the two that are not
                  sitting on a screen edge. */}
              <Reveal
                /* Off both edges on a phone, off one on a desktop. There is no
                   alternating side to play with in a single column, so the
                   bleed goes the only way it can: the picture spans the screen
                   and the words keep their margin, which is the same
                   relationship the two-column version sets up. Boxed inside
                   `--edge` on both sides, six of these read as a list of
                   thumbnails.

                   Each side is reset explicitly at the breakpoint rather than
                   with a single `mx-0`: `mx` and `ms` set overlapping
                   properties and Tailwind orders its own output, so which one
                   won would not be decided here. */
                className={`curtain media-frame bg-placeholder relative ms-[calc(var(--edge)*-1)] me-[calc(var(--edge)*-1)] aspect-[4/5] overflow-hidden rounded-none min-[880px]:aspect-auto min-[880px]:h-[min(72svh,720px)] min-[880px]:rounded-none ${
                  mediaSecond
                    ? 'min-[880px]:order-2 min-[880px]:ms-0 min-[880px]:me-[calc(var(--edge)*-1)] min-[880px]:rounded-l-[clamp(20px,2.4vw,36px)]'
                    : 'min-[880px]:ms-[calc(var(--edge)*-1)] min-[880px]:me-0 min-[880px]:rounded-r-[clamp(20px,2.4vw,36px)]'
                }`}
              >
                {project.gallery.length > 0 ? (
                  <Carousel
                    images={project.gallery}
                    label={project.title}
                    sizes="(max-width: 880px) 100vw, 54vw"
                    locale={locale}
                  />
                ) : (
                  <Media
                    src={project.image}
                    alt={project.imageAlt}
                    sizes="(max-width: 880px) 100vw, 54vw"
                  />
                )}
              </Reveal>

              {/* When the image takes the right-hand column the copy is set
                  ragged-left against it, so both halves meet at the gutter
                  instead of leaving a slack channel down the middle. Every
                  child that is narrower than the column has to be pushed over
                  with it: text-align alone moves the words and leaves the
                  blocks where they were. Below the two-column breakpoint the
                  image is above the copy and it all goes back to ragged-right. */}
              {/* The copy takes the photograph's band and works to its edges.
                  Centred inside a full-screen slide it was a 348px lump adrift
                  in a 950px row, sharing no edge with the 684px picture beside
                  it: two columns in the same slide with nothing lining up.
                  Given the same height and pushed apart, the title meets the
                  top of the photograph and the copy runs down from there in
                  its own rhythm, with the space left over falling below it
                  against the lower half of the picture.

                  Pushing the two halves apart to meet both edges was the first
                  attempt and it was worse: only about 350px of copy in a 684px
                  band left a hole in the middle larger than either group, which
                  reads as two loose pieces rather than as air.

                  `min-h` here, and `h` on the picture beside it, which is not
                  an inconsistency. The copy has to be free to grow: on a narrow
                  desktop it wraps to more lines than the band holds, and a
                  fixed height would spill the links out of the slide. The frame
                  has to be the opposite: the carousel inside it is sized
                  `height: 100%`, and a percentage measured against a parent
                  whose height is `auto` resolves to `auto` rather than to its
                  `min-height`. Give the frame a minimum instead of a height and
                  the carousel collapses to nothing: the frame still measures
                  684px, and every photograph inside it renders at zero. */}
              <div
                className={`min-[880px]:flex min-[880px]:min-h-[min(72svh,720px)] min-[880px]:flex-col min-[880px]:justify-start ${
                  mediaSecond
                    ? 'min-[880px]:order-1 min-[880px]:text-right'
                    : ''
                }`}
              >
                <div>
                  {/* Spoken, not drawn. The visible counter is the badge
                    pinned to the corner of the screen; this is the same fact in
                    the reading order, where a screen reader meets it once per
                    card instead of hearing a floating badge re-announce
                    itself. */}
                  <p className="sr-only">
                    {projectCount(index + 1, projects.length, locale)}
                  </p>

                  <p
                    className={`text-mute mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${
                      mediaSecond ? 'min-[880px]:justify-end' : ''
                    }`}
                  >
                    {/* Where you are, on the one layout that has nowhere else
                        to say it. On a desktop the deck bar at the foot of the
                        screen carries the number and the name; below 880px
                        there is no deck and no bar, so the count went missing
                        from a section whose heading promises six. Spoken
                        version stays in the sr-only line above at every
                        width. */}
                    <span aria-hidden="true" className="min-[880px]:hidden">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-hair min-[880px]:hidden"
                    >
                      |
                    </span>
                    <span>{project.year}</span>
                    <span aria-hidden="true" className="text-hair">
                      |
                    </span>
                    <span>{project.kind}</span>
                  </p>

                  {/* Plain type. The word-by-word ink fill that used to run here
                    is driven by a view timeline, which measures an element
                    against the scroller as it passes, and these cards now pin
                    themselves to the top of the screen, so a pinned title stops
                    moving and its fill freezes part way through. The effect
                    could not survive the slides, so it is gone rather than half
                    working. It still runs everywhere nothing is pinned: the
                    About lead, the Contact heading, the three discipline
                    names. */}
                  <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold tracking-[-0.025em]">
                    {project.title}
                  </h3>

                  <p
                    className={`text-soft mt-2.5 max-w-[42ch] ${
                      mediaSecond ? 'min-[880px]:ml-auto' : ''
                    }`}
                  >
                    <Emphasis text={project.description} />
                  </p>

                  {project.outcome ? (
                    <p
                      className={`text-ink mt-3 max-w-[42ch] text-sm font-medium ${
                        mediaSecond ? 'min-[880px]:ml-auto' : ''
                      }`}
                    >
                      {project.outcome}
                    </p>
                  ) : null}
                </div>

                <div className="mt-[clamp(28px,4vh,56px)]">
                  <p className="text-mute text-sm">{project.role}</p>

                  <ToolPills
                    tools={project.tags}
                    label={toolkitLabel(project.title, locale)}
                    className={`mt-[18px] ${mediaSecond ? 'min-[880px]:justify-end' : ''}`}
                  />

                  {/* A dead `href="#"`, which is what the original shipped, is
                    worse than no link: it's focusable, announced as a link, and
                    goes nowhere. Render nothing until there's a real URL.

                    The rule now extends across the whole cell rather than just
                    the media, so the line under each link reacts on hovering
                    that link, not on hovering anywhere in the project. */}
                  {project.links.length > 0 ? (
                    <ul
                      className={`mt-[22px] flex flex-wrap items-center gap-x-7 gap-y-2 ${
                        mediaSecond ? 'min-[880px]:justify-end' : ''
                      }`}
                    >
                      {project.links.map((link) => (
                        <li key={link.label}>
                          {link.action === 'video' && project.video ? (
                            <ProjectVideo
                              label={link.label}
                              title={project.title}
                              video={project.video}
                              mirrored={mediaSecond}
                              locale={locale}
                            />
                          ) : link.href === null ? (
                            /* Named, but not offered. The destination does not
                               exist yet, so this is a label: not focusable, not
                               announced as a link, and nothing happens if it is
                               clicked, because nothing claims it would. In the
                               page's muted grey with a hairline rule rather
                               than the ink one, so it reads as a line of the
                               card rather than as a link that has broken. */
                            <span
                              className={`text-mute inline-flex items-center gap-2.5 text-[15px] font-medium ${
                                mediaSecond
                                  ? 'min-[880px]:flex-row-reverse'
                                  : ''
                              }`}
                            >
                              {link.label}
                              <span className="sr-only">
                                {notAvailableYet(project.title, locale)}
                              </span>
                              <span
                                aria-hidden="true"
                                className="bg-hair block h-px w-[26px]"
                              />
                            </span>
                          ) : (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noreferrer noopener"
                              /* The rule under the label already lengthens and
                                 takes the accent on hover; the label now goes
                                 with it. Same duration and easing as the rule,
                                 so the two read as one movement rather than as
                                 a colour change next to an animation. */
                              className={`group/link ease-brand hover:text-accent inline-flex items-center gap-2.5 text-[15px] font-medium transition-colors duration-400 ${
                                mediaSecond
                                  ? 'min-[880px]:flex-row-reverse'
                                  : ''
                              }`}
                            >
                              {link.label}
                              {/* One string, with its own leading space. A bare
                                {' '} between elements gets collapsed out of the
                                accessible name, which ran this together as
                                "Landing pagefor Marqo". */}
                              <span className="sr-only">
                                {opensInNewTab(project.title, locale)}
                              </span>
                              <span
                                aria-hidden="true"
                                className="bg-ink ease-brand group-hover/link:bg-accent block h-px w-[26px] transition-[width,background-color] duration-400 group-hover/link:w-[44px]"
                              />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
