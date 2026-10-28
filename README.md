# Truckify — Truck Dispatching Website

Multi-page marketing site for a truck dispatching service. React 19 + TypeScript + Vite, Tailwind CSS v4,
GSAP/ScrollTrigger (scroll choreography), Motion (component transitions), Lenis (smooth scroll).

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build → dist/
npm run lint      # oxlint
npm run gen:map   # regenerate the U.S. dot-matrix map data (rarely needed)
```

Deploys to Vercel as a static SPA; `vercel.json` rewrites unknown paths to `index.html` so direct visits
and refreshes on `/services`, `/faq` etc. work (static files are served first).

## Pages

| Route           | Hero clip  | Content                                       |
| --------------- | ---------- | --------------------------------------------- |
| `/`             | `home`     | Overview of every section + links deeper      |
| `/services`     | `services` | Bento grid + per-service detail ledger        |
| `/how-it-works` | `process`  | Pinned 5-step story + onboarding checklist    |
| `/lanes`        | `lanes`    | Interactive lane plotter (feeds contact form) |
| `/about`        | `about`    | Editorial principles + gallery                |
| `/faq`          | `faq`      | Full FAQ                                      |
| `/contact`      | `contact`  | Consultation request form                     |
| `/privacy`, `/terms` | —     | Draft placeholders                            |

Route table: `src/App.tsx` · page metadata and clip mapping: `src/data/pages.ts` (keep the poster-preload map
in `index.html` in sync).

## Where things live

- `src/data/` — all copy and business facts (`site.ts`, `content.ts`, `pages.ts`), separate from presentation
- `src/sections/` — page sections; `src/pages/` — page compositions; `src/components/` — shared UI
- `src/styles/index.css` — design tokens for both themes (`[data-theme]`), surface treatments, keyframes
- Effects: `SplashScreen` (once per session), `SiteCursor` (fine pointers only), `DotWordmark` (footer
  halftone with pointer repulsion + click ripple), `HeroVideo` (poster-first, lazy video, pause control)

All motion respects `prefers-reduced-motion` (no splash, no video, no pinning, static footer, native cursor).

## Before launch — content to confirm

Values flagged `placeholder: true` in `src/data/site.ts` render with a visible **TBC** tag (except in the
footer). Replace them, then remove the flag:

- [ ] Email, phone, desk hours, location (`src/data/site.ts`)
- [ ] Production domain: `SITE.url`, `index.html` canonical/OG tags, `public/sitemap.xml`, `public/robots.txt`
- [ ] Services, principles and process copy match what the business actually offers (`src/data/content.ts`)
- [ ] Supported equipment list, pricing model, agreement terms (FAQ items marked `needsConfirmation`)
- [ ] Onboarding document checklist (`src/sections/Onboarding.tsx`)
- [ ] Privacy Policy and Terms (`src/pages/Legal.tsx`)
- [ ] Testimonials — section stays hidden until real, attributable quotes are added to `TESTIMONIALS`
- [ ] Social links (`SITE.social`) — none render until added
- [ ] Contact form submits via `mailto:`; connect a form backend if you want submissions stored

## Media credits

- Photography: [Unsplash](https://unsplash.com/license) (Unsplash License)
- Hero video: [Mixkit](https://mixkit.co/license/) (Mixkit Free License) — clips 33856, 23852, 26005, 52428,
  1919, 28787, 52430, re-encoded to 10s H.264 loops (720p + 480p) with poster frames in `public/media/video/`
- Map geometry: [us-atlas](https://github.com/topojson/us-atlas) (U.S. Census Bureau data, ISC licence)
