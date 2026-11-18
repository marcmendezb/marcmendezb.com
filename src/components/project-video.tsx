'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/modal'
import type { ProjectVideo as Video } from '@/content/projects'

type Props = {
  label: string
  /** Project name, for the dialog's accessible name. */
  title: string
  video: Video
  /** True when the copy is set ragged-left against media on the right. */
  mirrored: boolean
}

/**
 * The project link that opens a film instead of going somewhere.
 *
 * A button, not an anchor. It has no destination and never will: it opens a
 * dialog in place. An anchor here would be announced as a link and would offer
 * "open in a new tab" on a middle click, neither of which is true.
 *
 * It is dressed exactly like the real links beside it, because to a reader it
 * is the same kind of offer: a thing on this card you can go and look at. The
 * difference is where it takes you, not what it is.
 *
 * While `video.src` is null the dialog holds the poster frame on its own. No
 * play button is drawn over it: a play triangle that does nothing when pressed
 * is a worse placeholder than a still picture, which at least promises nothing.
 * The day a file lands in `src`, the same dialog renders a player instead and
 * uses this image as its poster, with no other change.
 */
export function ProjectVideo({ label, title, video, mirrored }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group/link ease-brand hover:text-accent inline-flex items-center gap-2.5 text-[15px] font-medium transition-colors duration-400 ${
          mirrored ? 'min-[880px]:flex-row-reverse' : ''
        }`}
      >
        {label}
        {/* One string with its own leading space: a bare {' '} between elements
            is collapsed out of the accessible name. */}
        <span className="sr-only">{` for ${title}, opens a video`}</span>
        <span
          aria-hidden="true"
          className="bg-ink ease-brand group-hover/link:bg-accent block h-px w-[26px] transition-[width,background-color] duration-400 group-hover/link:w-[44px]"
        />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        label={`${title}, video`}
      >
        {/* 16:9 and capped against the viewport's height as well as its width,
            so a wide short window does not push the frame off the top and
            bottom. */}
        <div className="bg-placeholder relative aspect-video max-h-[78svh] w-[min(92vw,1100px)] overflow-hidden rounded-[clamp(8px,1.2vw,16px)]">
          {video.src ? (
            <video
              src={video.src}
              poster={video.poster}
              controls
              playsInline
              // No autoplay. Sound starting on its own is the thing people
              // close a tab over, and WCAG 1.4.2 would want a stop control for
              // anything that ran past three seconds anyway.
              className="h-full w-full object-cover"
            />
          ) : (
            <Image
              src={video.poster}
              alt={video.posterAlt}
              fill
              sizes="(max-width: 880px) 92vw, 1100px"
              className="object-cover"
            />
          )}
        </div>
      </Modal>
    </>
  )
}
