'use client'

import { Fragment, useEffect, useRef, useState } from 'react'

/** Matches the `gap-2` on the list. Used when packing rows. */
const GAP = 8
/** How close the pointer has to be, in px, before a pill reacts to it. */
const RADIUS = 130
/** The furthest a pill travels toward the pointer. */
const PULL = 10
/** Scale applied to the pill directly under the pointer. */
const HOVER_SCALE = 1.06
/** Per-frame easing. Higher snaps, lower drifts. */
const LERP = 0.18

type Props = {
  tools: readonly string[]
  /** Names the list for screen readers, e.g. "Marketing toolkit". */
  label: string
  /** Spacing above the list, which differs between the two places it appears. */
  className?: string
}

/**
 * Packs items into rows no wider than `limit`, first-fit.
 * Returns one array of indices per row.
 */
function pack(widths: number[], limit: number, gap: number): number[][] {
  const rows: number[][] = []
  let row: number[] = []
  let used = 0

  widths.forEach((width, i) => {
    const cost = row.length ? gap + width : width

    if (row.length && used + cost > limit) {
      rows.push(row)
      row = [i]
      used = width
    } else {
      row.push(i)
      used += cost
    }
  })

  if (row.length) rows.push(row)
  return rows
}

/**
 * Works out where the row breaks go so the rows come out even.
 *
 * Plain `flex-wrap` fills each row to the brim and leaves whatever is left over
 * on the last one, which is how you end up with fourteen pills and then a lonely
 * fifteenth. Balancing means minimising the width of the *widest* row instead:
 * binary search the narrowest limit that still packs into the same number of
 * rows, and every row comes out close to the same length.
 *
 * The floor of two rows is deliberate. A single long row of tags reads as a
 * run-on sentence, and the three disciplines look like siblings when they are
 * all built the same way.
 */
function rowBreaks(widths: number[], container: number, gap: number): number[] {
  if (!widths.length) return []

  // A pill wider than its container can't be packed, and the binary search
  // below would have nowhere to search. Let it wrap on its own.
  const widest = Math.max(...widths)
  if (widest > container) return []

  const rows = Math.max(2, pack(widths, container, gap).length)

  let lo = widest
  let hi = container

  // Half a pixel is well below what anyone can see, and bounded iterations
  // keep this from spinning on a fractional container width.
  while (hi - lo > 0.5) {
    const mid = (lo + hi) / 2
    if (pack(widths, mid, gap).length <= rows) hi = mid
    else lo = mid
  }

  const packed = pack(widths, hi, gap)
  const breaks: number[] = []
  let index = 0

  // The break belongs after the last item of every row but the final one.
  packed.slice(0, -1).forEach((row) => {
    index += row.length
    breaks.push(index - 1)
  })

  return breaks
}

const same = (a: number[], b: number[]) =>
  a.length === b.length && a.every((v, i) => v === b[i])

/**
 * The tag list under each discipline: evenly stacked rows, and pills that lean
 * toward the pointer as it crosses them.
 *
 * The magnet attracts rather than repels. Pushing pills away from the cursor
 * looks livelier in a demo and is miserable in practice: the element under the
 * pointer moves out from under it, loses `:hover`, springs back, and the whole
 * row flickers. Pulling toward the pointer keeps the hovered pill under the
 * pointer, so the accent outline can sweep in undisturbed.
 */
export function ToolPills({ tools, label, className = 'mt-5' }: Props) {
  const listRef = useRef<HTMLUListElement>(null)
  const [breaks, setBreaks] = useState<number[]>([])

  // Row balancing. Runs after mount, which is invisible here: the section sits
  // below the fold behind a scroll reveal, so it has long since settled by the
  // time anyone sees it. Server-rendered and no-JS visitors get plain wrapping,
  // which is untidy but complete.
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () => {
      const pills = list.querySelectorAll<HTMLElement>('[data-pill]')
      if (!pills.length) return

      const widths = [...pills].map((p) => p.getBoundingClientRect().width)
      const next = rowBreaks(widths, list.getBoundingClientRect().width, GAP)

      // Inserting breaks changes the list's height, which wakes the observer
      // again. Bailing on an unchanged result is what stops that being a loop.
      setBreaks((prev) => (same(prev, next) ? prev : next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [tools])

  // The magnet.
  useEffect(() => {
    const list = listRef.current
    if (!list) return

    // No pointer to track on touch, and movement that follows the cursor is
    // exactly what a reduced-motion preference is asking you not to do. The
    // colour and the outline sweep still work in both cases.
    if (!window.matchMedia('(hover: hover)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // One record per pill rather than parallel arrays: every loop below walks
    // them together, and indexed lookups into four arrays is how they drift
    // out of step.
    type Item = {
      el: HTMLElement
      /** Resting centre, relative to the list. */
      bx: number
      by: number
      /** Where it is now. */
      x: number
      y: number
      s: number
      /** Where it is heading. */
      tx: number
      ty: number
      ts: number
    }

    let items: Item[] = []
    let frame = 0

    /**
     * Resting positions, measured relative to the list.
     *
     * These have to be the *untransformed* centres. Reading a pill's live
     * rect while it is displaced feeds the offset back into the next frame:
     * the pill creeps toward the pointer, measures closer, creeps further, and
     * runs away across the page.
     */
    const cache = () => {
      const pills = [...list.querySelectorAll<HTMLElement>('[data-pill]')]
      pills.forEach((el) => {
        el.style.transform = ''
      })

      const box = list.getBoundingClientRect()
      items = pills.map((el) => {
        const r = el.getBoundingClientRect()
        return {
          el,
          bx: r.left - box.left + r.width / 2,
          by: r.top - box.top + r.height / 2,
          x: 0,
          y: 0,
          s: 1,
          tx: 0,
          ty: 0,
          ts: 1,
        }
      })
    }

    const tick = () => {
      let moving = false

      items.forEach((it) => {
        it.x += (it.tx - it.x) * LERP
        it.y += (it.ty - it.y) * LERP
        it.s += (it.ts - it.s) * LERP

        if (
          Math.abs(it.tx - it.x) > 0.05 ||
          Math.abs(it.ty - it.y) > 0.05 ||
          Math.abs(it.ts - it.s) > 0.001
        ) {
          moving = true
        }

        it.el.style.transform = `translate3d(${it.x.toFixed(2)}px, ${it.y.toFixed(2)}px, 0) scale(${it.s.toFixed(3)})`
      })

      if (moving) {
        frame = requestAnimationFrame(tick)
        return
      }

      frame = 0

      // Drop the inline transforms once everything is home, so the browser can
      // retire the compositor layers. Only when the targets are actually zero:
      // a pointer held still also stops the loop, and clearing there would
      // snap the pills back while the cursor is still on them.
      if (items.every((it) => it.tx === 0 && it.ty === 0 && it.ts === 1)) {
        items.forEach((it) => {
          it.el.style.transform = ''
        })
        delete list.dataset.magnet
      }
    }

    const run = () => {
      if (frame) return
      list.dataset.magnet = 'on'
      frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      const box = list.getBoundingClientRect()
      const px = event.clientX - box.left
      const py = event.clientY - box.top
      const over = (event.target as HTMLElement).closest('[data-pill]')

      items.forEach((it) => {
        const dx = px - it.bx
        const dy = py - it.by
        const distance = Math.hypot(dx, dy)

        if (distance < RADIUS && distance > 0) {
          // Normalise to a unit vector, then scale by how close the pointer is.
          // Without the divide, pills far away would travel further than near
          // ones, which reads as a glitch rather than a pull.
          const strength = ((1 - distance / RADIUS) * PULL) / distance
          it.tx = dx * strength
          it.ty = dy * strength
        } else {
          it.tx = 0
          it.ty = 0
        }

        it.ts = it.el === over ? HOVER_SCALE : 1
      })

      run()
    }

    const onLeave = () => {
      items.forEach((it) => {
        it.tx = 0
        it.ty = 0
        it.ts = 1
      })
      run()
    }

    cache()
    list.addEventListener('pointermove', onMove)
    list.addEventListener('pointerleave', onLeave)

    // Re-measure when the rows are rebalanced or the column changes width.
    const observer = new ResizeObserver(cache)
    observer.observe(list)

    return () => {
      list.removeEventListener('pointermove', onMove)
      list.removeEventListener('pointerleave', onLeave)
      observer.disconnect()
      cancelAnimationFrame(frame)
      items.forEach((it) => {
        it.el.style.transform = ''
      })
    }
  }, [tools, breaks])

  return (
    // The row rhythm is carried by a margin on each pill rather than by
    // `row-gap`, because the break below sits on a flex line of its own: with a
    // row gap the browser charges for the gap above it *and* below it, and the
    // rows drift twice as far apart as they do when they wrap naturally. The
    // negative margin on the list absorbs the last row's share.
    <ul
      ref={listRef}
      aria-label={`${label} toolkit`}
      className={`tool-pills -mb-2 flex flex-wrap gap-x-2 gap-y-0 ${className}`}
    >
      {tools.map((tool, i) => (
        <Fragment key={tool}>
          <li
            data-pill=""
            className="tool-pill wipe-stroke border-hair text-mute ease-brand hover:text-accent mb-2 rounded-full border px-3 py-[5px] text-[12.5px] transition-colors duration-300"
          >
            {tool}
          </li>
          {breaks.includes(i) ? (
            // A zero-height, full-width flex item is the only way to force a
            // break inside a single wrapping list.
            <li
              aria-hidden="true"
              className="h-0 basis-full"
              role="presentation"
            />
          ) : null}
        </Fragment>
      ))}
    </ul>
  )
}
