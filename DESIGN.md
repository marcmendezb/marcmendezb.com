# DESIGN.md

Committed system. Changes here should be deliberate, not incidental.

## Color

**Strategy: restrained.** Monochrome surface, one accent. Deliberate for this
register: the Swiss lineage this design comes from earns its impact from
structure and type, not palette. The accent is the only chromatic event.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--surface` | `#ffffff` | `#0a0a0a` | Page ground |
| `--ink` | `#0a0a0a` | `#f4f4f2` | Primary text |
| `--soft` | `#333333` | `#c4c4c0` | Body copy |
| `--mute` | `#717171` | `#8f8f8b` | Secondary text: **AA floor, do not lighten** |
| `--hair` | `rgb(0 0 0 / .10)` | `rgb(255 255 255 / .14)` | Rules and borders |
| `--accent` | `#2438e0` | `#6c7bff` | Interaction + availability |

**One palette, light.** No dark scheme, and that is a decision rather than an
omission: this is a portfolio read in a few minutes, the imagery and the brand
mark were drawn for a white ground, and a second palette is a second set of
contrast figures to keep honest for no gain. `color-scheme: light` makes it
hold on a device set to dark.

**Accent rule:** blue marks *interaction* (hover, focus, selection, nav pill,
skip link) plus exactly one status signal (the availability dot). Nothing
static, nothing decorative. `#2438e0` is 7.73:1 on white.

Every pairing must clear WCAG AA. Verified with axe-core.

## Typography

**Inter**, single family, with `"Helvetica Neue", Helvetica, Arial` leading the
fallback stack. Helvetica is the typeface this design descends from and the one
it was drawn in; Inter is the reliable, self-hosted stand-in that renders the
same everywhere.

Inter appears on the reflex-reject list. It stays: it is already shipping as
part of this identity, and the Swiss-grotesque lineage is the point rather than
a default. Identity preservation wins over the greenfield ban.

Hierarchy comes from scale and weight inside one family. Fluid `clamp()`
throughout, tight negative tracking on display sizes (`-0.035em` at hero,
`-0.02em` at section headings).

## Layout

Strict, visible grid: the Swiss option, not the asymmetric one. Hairline rules
separate sections and carry the structure. Left-aligned; nothing centered.

`--edge: clamp(22px, 4.5vw, 64px)` is the single page gutter. Single breakpoint
at **880px**.

## Motion

`--ease: cubic-bezier(.16, 1, .3, 1)` (ease-out-expo) on everything. One curve
across the whole site is most of why the motion reads as a single system.

Choreography over quantity. One rehearsed page-load overture, scroll-driven
reveals, and micro-interactions only where they mark interaction.

Scroll-linked motion uses native CSS `animation-timeline` where supported, with
an IntersectionObserver fallback. Everything collapses to its final state under
`prefers-reduced-motion`.

## Bans for this project

- No cards. The grid and the hairlines do the separating.
- No shadows. This design has no elevation model; depth would contradict it.
- No border radius except fully-round pills (buttons, tags, nav).
- No gradient text, no glass, no icon grids.
