# Abhyudh Solanki — portfolio

A single-page, art-directed portfolio. React + Vite, no backend, no database,
no analytics. Deploys as static files.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build
```

---

## The domain

Live at `https://abhyudhsolanki.in`, set once in `SITE_ORIGIN` in
`vite.config.ts`. That single value feeds the canonical URL, the Open Graph
image and URL, `robots.txt` and `sitemap.xml` — all four are generated at
build time, so changing the domain again only means editing that one
constant and rebuilding.

Contact links (`src/data/site.ts` → `LINKS`) and the book (`BOOK`, referenced
from `TIMELINE`) are filled in with real values already.

---

## Editing content

`src/data/site.ts` is the single source of truth. Notable exports:

- `LINKS` — Connect section rows. A non-empty `href` renders a live link; an
  empty one renders a visible `not linked yet` chip instead of a fabricated URL.
- `PROJECTS[].link` (optional) — shows a "View project ↗" pill in that
  project's chapter header. Only set on Minti Finance today.
- `PROJECTS[].note` (optional) — a small factual note under the stack chips.
  Only set where something is actually confirmed (e.g. the Minti ideathon win).
- `BOOK` — title, one-line description and link for MECHCORPS, referenced from
  the matching `TIMELINE` entry.

## Certificates

Not included. The specific certificates were not documented, and the site does
not claim any. If you want a certificates section, drop the files somewhere in
the repo and the section can be built from the real name / issuer / year / what
it demonstrates.

---

## What is claimed, and what isn't

`src/data/site.ts` is the single source of truth for every factual statement on
the page. The rule at the top of that file: no award, metric, user count,
client, employer, publication or certification unless it is confirmed.

Concretely, as shipped:

| Shown as | Item |
| --- | --- |
| **Award** | Minti Finance — ideathon win (the only award claimed) |
| **Submission, not an award** | Lumo → INSPIRE Awards MANAK |
| **Status, plainly stated** | Prototype · In progress · Concept · Workbench |
| **Live links** | Minti Finance (`mintifinance.lovable.app`), MECHCORPS (bribooks.com) |
| **Not claimed anywhere** | users, revenue, funding, clients, jobs, internships, patents, publications, certificates |

Project visuals are original schematic drawings (`src/components/artifacts/`),
not mock product screenshots — nothing on the page pretends to be a shipped
interface.

---

## Structure

```
src/
  data/site.ts        every factual claim, all copy
  data/nav.ts         section order
  styles/tokens.css   colour, type, space, motion tokens
  styles/base.css     reset + shared primitives
  lib/                hooks, smooth scroll, sound
  components/         one .tsx + .css per section
    artifacts/        per-project schematic SVGs
```

### Design system

Two surfaces (`paper` / `void`) swapped by `[data-surface]`, which re-points
every semantic token. The fixed nav and cursor invert automatically by
observing which surface is under the top of the viewport.

- **Display** Bricolage Grotesque, 800, lowercase, leading below 1.0
- **Body** Instrument Sans · **Technical** JetBrains Mono
- **Accent** vermilion on paper, acid on void. `--accent` is for display sizes
  and marks; `--accent-text` is the AA-safe variant for small text.
- Per-project accents (`PROJECTS[].accent`) tint each chapter and its artifact.
  All are checked to clear 4.5:1 on the void surface.

### Motion

- Masked line reveals, scroll-linked parallax, drag — Motion (`motion/react`)
- Marquee, artifact animation, ambient loops — CSS only
- The pinned horizontal work index — `position: sticky` plus one scroll-driven
  transform. No scroll library; the browser does the pinning.
- `prefers-reduced-motion` disables smooth scroll, the boot sequence, the
  custom cursor and every non-essential animation, and the horizontal index
  degrades to a plain vertical list.

### Sound

Off by default, toggled in the nav, persisted to `localStorage`. Three tones
synthesised with WebAudio — no audio files. Never required to understand
anything.

---

## Deploying

`dist/` is static, so any host works. `vercel.json` ships a CSP, HSTS and the
usual hardening headers plus immutable caching for hashed assets — if you
deploy somewhere else, port those headers to that host's config.
