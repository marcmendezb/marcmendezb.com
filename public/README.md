# Static assets

Everything in this folder is served from the site root: `public/portrait.jpg`
becomes `/portrait.jpg`.

## What to add

| File | Referenced from | Notes |
| --- | --- | --- |
| `images/marcmendez.jpeg` ✓ | `src/components/hero.tsx` | In place. Shot 3:4, framed 4:5, cropped from the top. |
| `work/<slug>/*.jpg` | `src/content/projects.ts` | Project shots, 4:5 portrait. ~1200×1500. The frame in `work.tsx` matches, so nothing is cropped: supply a different shape and it will be. |
| `marc-mendez-cv.pdf` | `src/content/site.ts` (`cvPath`) | Then set `cvPath: '/marc-mendez-cv.pdf'`. |

Until a file exists, the site renders a tonal placeholder rather than a broken
image, so nothing looks unfinished while you gather assets.

Don't optimise these by hand: `next/image` emits responsive AVIF and WebP at
build time. Give it the largest good-quality original you have.
