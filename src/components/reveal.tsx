'use client'

import { useInView } from '@/lib/use-in-view'

type Props = {
  children: React.ReactNode
  /**
   * Add `reveal` for a fade-and-rise, or `curtain` for the wipe used on media.
   * Both are defined in globals.css and key off the `data-visible` attribute
   * this component sets.
   */
  className?: string
  /** Tag to render. Defaults to a div. */
  as?: 'div' | 'figure' | 'article' | 'section' | 'p'
}

/**
 * Sets `data-visible` on its element the first time it scrolls into view.
 *
 * The animation itself lives in CSS, so this component stays presentation-free
 * and the whole thing degrades to "always visible" when motion is reduced.
 */
export function Reveal({ children, className = '', as: Tag = 'div' }: Props) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    // @ts-expect-error: a single ref type can't satisfy every tag in the union,
    // and narrowing it properly costs more than it's worth for four tags.
    <Tag ref={ref} data-visible={inView} className={className}>
      {children}
    </Tag>
  )
}
