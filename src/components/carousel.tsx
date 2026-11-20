'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { GalleryImage } from '@/content/projects'
import type { Locale } from '@/i18n/locales'

/** How long each slide holds before advancing. */
const INTERVAL_MS = 3000

/** How far a finger travels before it counts as a swipe rather than a tap. */
const SWIPE_MIN_PX = 44
/** How far it travels before the gesture commits to an axis. */
const SWIPE_AXIS_PX = 10
/** How long after a swipe a click is still assumed to belong to it. */
const SWIPE_CLICK_MS = 400

/**
 * Swipe to change slide.
 *
 * The buttons are the accessible control and stay exactly as they are; this is
 * the gesture anyone holding a phone will try first, and until now it did
 * nothing. Only touch and pen: a cursor drag is not how a slide gets changed on
 * a desktop, and taking over the mouse here would put this in front of the
 * click that pauses the slideshow, which is.
 *
 * The axis is decided once, on the first 10px of travel, and a gesture that
 * commits to vertical is left alone for the rest of its life: otherwise a
 * thumb flicking down the page with any sideways drift in it would page the
 * carousel on the way past.
 */
function useSwipe(onSwipe: (direction: 'forward' | 'back') => void) {
  /* A ref, not state: none of this is rendered, and a gesture that re-rendered
     on every pointermove would spend a frame budget on nothing. */
  const gesture = useRef<{
    id: number
    x: number
    y: number
    axis: 'x' | 'y' | null
  } | null>(null)

  /* When the last swipe landed, read by the click that may follow it. The whole
     frame is a button that pauses the slideshow, so a swipe that also counted
     as a click would page the images and then immediately stop them.

     A timestamp rather than a flag, because most swipes produce no click at
     all: once a horizontal drag passes the touch slop the browser cancels the
     tap, and a flag set on the way out would sit there armed until it swallowed
     somebody's next genuine tap, which is exactly what it did. A window that
     closes by itself cannot. */
  const swipedAt = useRef(0)

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse') return
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      axis: null,
    }
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const g = gesture.current
    if (!g || g.id !== event.pointerId || g.axis !== null) return
    const dx = event.clientX - g.x
    const dy = event.clientY - g.y
    if (Math.abs(dx) < SWIPE_AXIS_PX && Math.abs(dy) < SWIPE_AXIS_PX) return
    g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
  }

  const onPointerUp = (event: React.PointerEvent) => {
    const g = gesture.current
    gesture.current = null
    if (!g || g.id !== event.pointerId || g.axis !== 'x') return
    const dx = event.clientX - g.x
    if (Math.abs(dx) < SWIPE_MIN_PX) return
    swipedAt.current = performance.now()
    // Dragging left pulls the next image in from the right, which is the way
    // the curtain already wipes when you press next.
    onSwipe(dx < 0 ? 'forward' : 'back')
  }

  return {
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: () => {
        gesture.current = null
      },
    },
    /** Whether a swipe just landed, for the click that sometimes follows one. */
    justSwiped: () => performance.now() - swipedAt.current < SWIPE_CLICK_MS,
  }
}

type Props = {
  images: readonly GalleryImage[]
  /** Project name, used to name the carousel and its controls for screen readers. */
  label: string
  sizes: string
  locale: Locale
}

const groupLabel = (label: string, count: number, locale: Locale): string => {
  switch (locale) {
    case 'de':
      return `${label}, ${count} Bilder`
    case 'es':
      return `${label}, ${count} imágenes`
    default:
      return `${label}, ${count} images`
  }
}

const playSlideshow: Record<Locale, string> = {
  en: 'Play slideshow',
  de: 'Diashow abspielen',
  es: 'Reproducir diapositivas',
}

const pauseSlideshow: Record<Locale, string> = {
  en: 'Pause slideshow',
  de: 'Diashow anhalten',
  es: 'Pausar diapositivas',
}

const goToImage = (i: number, locale: Locale): string => {
  switch (locale) {
    case 'de':
      return `Zu Bild ${i} wechseln`
    case 'es':
      return `Ir a la imagen ${i}`
    default:
      return `Go to image ${i}`
  }
}

const previousImage: Record<Locale, string> = {
  en: 'Previous image',
  de: 'Vorheriges Bild',
  es: 'Imagen anterior',
}

const nextImage: Record<Locale, string> = {
  en: 'Next image',
  de: 'Nächstes Bild',
  es: 'Siguiente imagen',
}

/**
 * Image carousel.
 *
 * Follows the page's own vocabulary rather than importing a carousel look:
 * hairline rules instead of dots, an accent fill instead of a spinner, no
 * shadows and no rounded corners. The progress bars are the timer made visible,
 * which means the autoplay never happens invisibly, and they double as the
 * manual control.
 *
 * On autoplay and WCAG 2.2.2: anything that moves on its own for longer than
 * five seconds needs a way to stop it. That mechanism is the pause button, and
 * clicking the image does the same thing: hovering alone does not stop it,
 * deliberately, because the pointer crosses these images on the way to
 * everything else. Under `prefers-reduced-motion` it never starts at all.
 *
 * No lightbox: the image never enlarges, on click or otherwise. A click is a
 * play/pause toggle and nothing more.
 *
 * A slide can be a video instead of a still (`image.kind === 'video'`): a
 * silent, looping clip rather than a GIF, specifically so the pause button
 * has something it can actually call `.pause()` on. See `GalleryImage` in
 * `content/projects.ts` for why that distinction exists.
 */
export function Carousel({ images, label, sizes, locale }: Props) {
  /* Which slide is up, which one it displaced, and which way it came from.
     All three move together, so they live in one object: with the outgoing
     slide in its own state the two setters could land in different renders and
     the curtain would open onto an empty frame. `from` is null on first paint,
     which is how the opening slide is told not to wipe in. */
  const [slide, setSlide] = useState<{
    index: number
    from: number | null
    direction: 'forward' | 'back'
  }>({ index: 0, from: null, direction: 'forward' })

  const { index, from, direction } = slide
  /* Starts paused under `prefers-reduced-motion`, rather than starting
     playing and being stopped a tick later: the slide-advance timer and any
     video's autoplay both read this same flag, so initialising it correctly
     is what keeps a reduced-motion visitor from ever seeing the first frame
     of unwanted motion at all. Read once, lazily: a plain `useState(false)`
     would run every render, and this only needs to run before the first one.
     Pressing the explicit Play button afterwards still works normally: that
     is a request, not automatic motion, and nothing here distinguishes it
     from an ordinary toggle. */
  const [paused, setPaused] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  /* The YouTube/Netflix confirmation: a big icon that flashes where you just
     clicked and fades. Both toggle paths (the whole frame, the small explicit
     button) go through this one function so the cue never depends on which
     one you used.

     `id` rather than reusing `icon` as the React key: `icon` only has two
     values, and a toggle always alternates between them, but keying on it
     would still work for that reason alone. The id is here so a future third
     trigger of the same icon twice in a row (there isn't one today) remounts
     cleanly instead of silently no-opping because the key didn't change. */
  const [pulse, setPulse] = useState<{
    id: number
    icon: 'play' | 'pause'
  } | null>(null)
  const pulseId = useRef(0)

  /* Reads `paused` directly rather than through a functional update: safe now
     that the focus-driven pause below is gated on `:focus-visible` and can no
     longer land in the same gesture as a mouse click, so the value this
     closure sees is never stale by the time a click actually fires. */
  const toggle = useCallback(() => {
    const next = !paused
    setPaused(next)
    pulseId.current += 1
    setPulse({ id: pulseId.current, icon: next ? 'pause' : 'play' })
  }, [paused])

  const count = images.length

  /**
   * Moves to a slide.
   *
   * `dir` is passed by the buttons, which know their own direction. The bars
   * don't, so they fall back to whichever way is shorter on the strip: jumping
   * from the first bar to the last wipes backwards, which is the way the eye
   * has just travelled.
   */
  const go = useCallback(
    (next: number, dir?: 'forward' | 'back') => {
      setSlide((s) => {
        const target = (next + count) % count
        if (target === s.index) return s
        return {
          index: target,
          from: s.index,
          direction: dir ?? (target > s.index ? 'forward' : 'back'),
        }
      })
    },
    [count],
  )

  // --- Autoplay -------------------------------------------------------------

  /* How much of this slide's time is left, and when the current run began.
     Pausing has to hold the slide where it is, so a plain interval is no good:
     restarting one on resume hands the slide a fresh three seconds regardless
     of how long it had already been up. */
  const remainingRef = useRef(INTERVAL_MS)
  const startedAtRef = useRef(0)

  // A new slide gets the full budget. Declared before the timer effect so that
  // after a slide change this body runs first and the timer reads the reset
  // value rather than the leftovers from the slide before it.
  useEffect(() => {
    remainingRef.current = images[index]?.durationMs ?? INTERVAL_MS
  }, [images, index])

  useEffect(() => {
    if (paused || count < 2) return
    // Read the preference here rather than holding it in state: this is the
    // only place it matters, and it keeps the effect the single source of truth.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    startedAtRef.current = performance.now()
    const id = window.setTimeout(
      // Autoplay always reads forward, including the wrap from the last slide
      // back to the first: the curtain is telling you the reel is still
      // turning the same way, not that it has rewound.
      () =>
        setSlide((s) => ({
          index: (s.index + 1) % count,
          from: s.index,
          direction: 'forward',
        })),
      remainingRef.current,
    )
    return () => {
      window.clearTimeout(id)
      // Bank whatever is left so the next run picks up where this one stopped.
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (performance.now() - startedAtRef.current),
      )
    }
  }, [paused, count, index])

  // Advancing a carousel the viewer can't see is wasted work, and it means they
  // arrive back at a slide that has silently moved on.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const swipe = useSwipe((direction) =>
    go(direction === 'forward' ? index + 1 : index - 1, direction),
  )

  /* One slot per slide, filled only for the ones that are videos. Driving
     playback from here rather than the `autoPlay` attribute means a slide
     that has not been shown yet is never, even briefly, playing in the
     background: the only thing that ever calls `.play()` is this effect,
     and it only calls it on the slide `index` already says is current. */
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    images.forEach((_image, i) => {
      const el = videoRefs.current[i]
      if (!el) return
      if (i === index) {
        // The active slide: play or hold exactly where a manual pause left
        // it. `currentTime` is untouched either way: a video someone paused
        // mid-way is meant to resume from there, not snap back to zero.
        if (paused) el.pause()
        else el.play().catch(() => {})
      } else {
        /* Any other slide. `.pause()` alone stops it wherever it happens to
           be, and nothing else ever moves it from there, so a video that
           had reached, say, its third second before the carousel moved on
           stayed sitting at three seconds, and started from there the next
           time its turn came round rather than from the beginning. Resetting
           the position the moment a slide loses the active spot is what
           guarantees every slide starts at zero whenever it gets picked,
           without needing to remember how it last ended. */
        el.pause()
        el.currentTime = 0
      }
    })
  }, [images, index, paused])

  const current = images[index]
  if (!current) return null

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={groupLabel(label, count, locale)}
      // Read by the CSS so the slide zoom freezes with the timer. The bar
      // carries its own copy because it is a sibling, not a descendant.
      data-paused={paused}
      className="carousel relative h-full w-full"
      /* No pause on hover. The pointer passes over these images constantly on
           the way to everything else on the slide, and a reel that stops every
           time it is crossed reads as broken rather than considerate. The pause
           button below is the control, and it is the one WCAG 2.2.2 asks for.
           Focus still pauses: that one is a keyboard user arriving at the
           controls deliberately, not a cursor passing through.
      
           Gated on `:focus-visible`, which is the one part of that sentence
           this used to get wrong: a plain mouse click also fires `focus`, so
           clicking any button in here paused it a tick before that button's own
           onClick ran, and a click handler that reads `paused` to decide its
           next state (every one below does) was deciding against a value this
           effect had just changed out from under it. The toggle fired, but
           against a state that had already flipped, so it landed back where it
           started. `:focus-visible` is exactly the distinction needed: true for
           a keyboard arrival, false for the click that is already being
           handled on its own terms. */
      onFocusCapture={(event) => {
        if (event.target.matches(':focus-visible')) setPaused(true)
      }}
      onBlurCapture={() => setPaused(false)}
      {...swipe.handlers}
    >
      {/* A curtain, not a crossfade and not a filmstrip. The arriving slide
            is uncovered a strip at a time over the one it replaces, which is
            the same left-to-right wipe the buttons, the rules and the section
            headings all use. Going back runs it the other way, so the control
            you pressed and the motion you see agree.

            `data-under` keeps the outgoing slide painted underneath for the
            length of the wipe. Without it the curtain would open onto whatever
            is behind the carousel. */}
      {images.map((image, i) => (
        <div
          key={image.src}
          data-active={i === index}
          data-under={i === from}
          // Absent until there is somewhere to have come from, which is what
          // keeps the first slide from wiping in on page load.
          data-enter={i === index && from !== null ? direction : undefined}
          aria-hidden={i !== index}
          className="slide absolute inset-0"
        >
          {image.kind === 'video' ? (
            <video
              ref={(el) => {
                videoRefs.current[i] = el
              }}
              src={image.src}
              aria-label={image.alt}
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full object-cover"
              style={{ objectPosition: image.position }}
            />
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes={sizes}
              className="object-cover"
              style={{ objectPosition: image.position }}
              priority={i === 0}
            />
          )}
        </div>
      ))}

      {/* The whole frame is a second way to reach the same control as the
            Pause/Play button below: same action, same label, so a reader who
            lands here by Tab hears exactly what they'd hear from the explicit
            button, not a different offer. There is nothing to enlarge: a click
            only ever pauses or resumes. */}
      <button
        type="button"
        onClick={() => {
          // A swipe ends in a click on this button. It already changed the
          // slide; toggling playback on top of that is not what the gesture
          // asked for.
          if (swipe.justSwiped()) return
          toggle()
        }}
        aria-label={paused ? playSlideshow[locale] : pauseSlideshow[locale]}
        className="absolute inset-0 z-10"
      />

      {/* The pulse itself: decorative and inert. The two real controls already
          carry the accessible name and the lasting state (the icon swap on
          the small button, the frozen zoom on the image); this is a transient
          echo of whichever one you just used, so a screen reader has nothing
          useful to gain from it and a pointer has no business landing on it
          mid-fade. Keyed on `pulse.id`, which is what lets a second click
          restart the animation from zero instead of the state update being a
          no-op because the key didn't change. Cleared via `onAnimationEnd`
          rather than a timer, so its lifetime can never drift from the
          animation's: a timer tuned by hand is one more number to keep in sync
          with the CSS by hand. */}
      {pulse ? (
        <span
          key={pulse.id}
          aria-hidden="true"
          onAnimationEnd={() => setPulse(null)}
          className="carousel-pulse pointer-events-none absolute inset-0 z-30 grid place-items-center"
        >
          <span className="carousel-pulse-ring">
            {pulse.icon === 'pause' ? (
              <PauseIcon size={28} />
            ) : (
              <PlayIcon size={28} />
            )}
          </span>
        </span>
      ) : null}

      {/* Controls sit over the image bottom, on a scrim so they stay legible
            whatever the slide behind them is doing. */}
      {/* The inset scales with the frame. At a flat 12px the controls sat
            almost on the edge of the picture, which was tolerable when the
            media was a small 16:10 card and cramped once the projects became
            full-height slides. The top padding is the gradient's run-up, so it
            grows with the rest. */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-[clamp(10px,1.4vw,18px)] bg-gradient-to-t from-black/45 to-transparent px-[clamp(14px,1.8vw,26px)] pt-[clamp(32px,5vw,72px)] pb-[clamp(14px,1.8vw,26px)]">
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? playSlideshow[locale] : pauseSlideshow[locale]}
          className="carousel-btn"
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>

        {/* The bars are the timer and the manual control at once. */}
        <ol className="flex flex-1 items-center gap-1.5">
          {images.map((image, i) => (
            <li key={image.src} className="flex-1">
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={goToImage(i + 1, locale)}
                aria-current={i === index ? 'true' : undefined}
                className="slide-bar block w-full"
                data-active={i === index}
                data-paused={paused}
              >
                {/* Keyed on the slide only. With `paused` in the key the
                      span remounted every time the pointer arrived, which
                      restarted the CSS animation from zero: the bar jumped
                      back to empty instead of holding. Freezing is handled by
                      `animation-play-state` on the paused bar instead.
                      
                      `animationDuration` inline, not in the stylesheet: the
                      CSS keyframe is shared by every bar, but how long each
                      one takes to fill is a fact about its own slide, set
                      once per gallery entry rather than fixed at 3s for
                      everything: a video gets exactly its own length, so the
                      slide changes on the loop point instead of mid-loop. */}
                <span
                  key={`${i}-${index}`}
                  className="slide-bar-fill"
                  style={{
                    animationDuration: `${image.durationMs ?? INTERVAL_MS}ms`,
                  }}
                />
              </button>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={() => go(index - 1, 'back')}
          aria-label={previousImage[locale]}
          className="carousel-btn"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1, 'forward')}
          aria-label={nextImage[locale]}
          className="carousel-btn"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </div>
  )
}

/* Icons are inline 1px-stroke SVG to match the hairline weight used everywhere
   else on the page. */

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      style={direction === 'left' ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  )
}

/** 14px everywhere this shipped originally; the pulse asks for it bigger. One
    path, two sizes, rather than a second copy of the shape. */
function PauseIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="2.5" height="10" />
      <rect x="9.5" y="3" width="2.5" height="10" />
    </svg>
  )
}

function PlayIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M5 3l8 5-8 5z" />
    </svg>
  )
}
