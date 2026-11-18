import Image from 'next/image'

type Props = {
  /** Path under `public/`, or `null` to render the placeholder. */
  src: string | null
  alt: string
  /** Responsive hint for the browser's image picker. */
  sizes: string
  /** Set on the LCP image only: it opts out of lazy loading and preloads. */
  priority?: boolean
  /** Extra classes on the image, for choosing where `object-cover` crops. */
  className?: string
}

/**
 * A project or portrait image.
 *
 * When `src` is null this renders a tonal panel instead of a broken image.
 * That's deliberate: the site should look finished before every screenshot
 * exists, and the placeholder costs zero bytes and zero requests: the original
 * markup inlined 162KB of base64 placeholder gradients to achieve the same
 * thing.
 *
 * The parent must be `position: relative` with a fixed aspect ratio.
 */
export function Media({
  src,
  alt,
  sizes,
  priority = false,
  className = '',
}: Props) {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className="placeholder-fill parallax bg-placeholder absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,var(--hair)_100%)]"
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`parallax object-cover ${className}`}
    />
  )
}
