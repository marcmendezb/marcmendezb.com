/**
 * Where each project card sits in the document.
 *
 * Shared because two things need the same answer and must not disagree: the
 * wheel handler that moves one card per gesture, and the arrows on the deck
 * badge.
 *
 * Neither `getBoundingClientRect()` nor `offsetTop` can be asked directly. The
 * cards are `position: sticky`, and both report a pinned element where it is
 * currently painted rather than where it belongs — a pinned card claims the
 * position of the one below it, which produced duplicate values and left the
 * deck unable to find anything behind the current position.
 *
 * So the walk happens on the cards' container, which is never pinned, and the
 * cards are laid out from there by their own heights. `offsetHeight` is a
 * layout measurement and sticky does not touch it.
 */
export function cardTops(): number[] {
  const section = document.getElementById('work')
  if (!section) return []

  const cards = Array.from(section.querySelectorAll<HTMLElement>('[data-snap]'))
  const wrapper = cards[0]?.parentElement
  if (!wrapper) return []

  let y = 0
  let node: HTMLElement | null = wrapper
  while (node) {
    y += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }

  return cards.map((card) => {
    const top = y
    y += card.offsetHeight
    return top
  })
}
