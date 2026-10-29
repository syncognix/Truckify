# Truckify — Truck Dispatching Website

Multi-page marketing site for **Truckify**, a truck dispatching service for owner-operators and small fleets
("You run the road. We run the board."). It is a client-rendered single-page app: React 19 + TypeScript,
built with Vite and styled with Tailwind CSS v4, with GSAP/ScrollTrigger for scroll choreography, Motion for
component transitions and Lenis for smooth scrolling. Deployed to Vercel as static files.

---

## Contents

1. [Quick start](#1-quick-start)
2. [Scripts](#2-scripts)
3. [Tech stack](#3-tech-stack)
4. [Project structure](#4-project-structure)
5. [Pages and routing](#5-pages-and-routing)
6. [Sections catalogue](#6-sections-catalogue)
7. [Shared components and hooks](#7-shared-components-and-hooks)
8. [Editing content](#8-editing-content)
9. [Design system — colours, type, themes](#9-design-system--colours-type-themes)
10. [Motion and interactive effects](#10-motion-and-interactive-effects)
11. [Accessibility](#11-accessibility)
12. [Performance](#12-performance)
13. [SEO and metadata](#13-seo-and-metadata)
14. [Media: images, video, map](#14-media-images-video-map)
15. [Contact form and lane plotter](#15-contact-form-and-lane-plotter)
16. [Deployment](#16-deployment)
17. [Launch checklist](#17-launch-checklist)
18. [Troubleshooting](#18-troubleshooting)
19. [Credits and licences](#19-credits-and-licences)

---

## 1. Quick start

Requirements: **Node.js `^20.19` or `>=22.12`** (Vite 8 requirement; developed on Node 24) and npm.

```bash
npm install        # or `npm ci` for a clean install from package-lock.json
npm run dev        # http://localhost:5173
```

Production check before shipping:

```bash
npm run build      # type-check (tsc -b) + production build → dist/
npm run preview    # serve dist/ at http://localhost:4173
npm run lint       # oxlint
```

## 2. Scripts

| Script            | What it does                                                                        |
| ----------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`     | Vite dev server with HMR                                                            |
| `npm run build`   | `tsc -b` type-check, then `vite build` into `dist/`                                 |
| `npm run preview` | Serves the built `dist/` locally (what Vercel will serve)                           |
| `npm run lint`    | oxlint with the React, TypeScript and oxc plugins (`.oxlintrc.json`)                |
| `npm run gen:map` | Regenerates `src/data/map.generated.ts` (U.S. dot map + hub positions). Rarely needed |

## 3. Tech stack

| Concern              | Choice                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| UI                   | React 19 (`StrictMode`), TypeScript 7                                     |
| Build                | Vite 8 (Rolldown), `@vitejs/plugin-react`                                 |
| Styling              | Tailwind CSS v4 via `@tailwindcss/vite`; design tokens as CSS variables   |
| Scroll choreography  | GSAP 3 + ScrollTrigger (`@gsap/react` `useGSAP`)                          |
| Component animation  | Motion (`motion/react`) loaded through `LazyMotion` (`m.*` components)    |
| Smooth scroll        | Lenis, ticked by GSAP so ScrollTrigger and scroll position stay in sync   |
| Icons                | `lucide-react`                                                            |
| Fonts (self-hosted)  | Geist Variable (sans), Geist Mono Variable, Fraunces Variable (serif + italic) via Fontsource |
| Routing              | Tiny custom History-API router (`src/lib/router.tsx`) — no router library |
| Lint                 | oxlint                                                                    |
| Hosting              | Vercel (static SPA, `vercel.json`)                                        |

There is **no backend, database or API**. The contact form opens the visitor's email app (`mailto:`).

## 4. Project structure

```
index.html                 Document shell: meta/OG tags, hero-poster preload script, pre-paint theme script
vercel.json                Vercel config (SPA rewrite to index.html)
vite.config.ts             Plugins + manual chunks (react / scroll runtime)
scripts/generate-map.mjs   Builds the U.S. dot-matrix map data (d3-geo + us-atlas, dev-only deps)
public/
  favicon.svg, og.jpg      Favicon and 1200×630 social share image
  robots.txt, sitemap.xml  Crawler files (example domain — update before launch)
  media/                   Photos as {name}-{width}.{avif,webp}
  media/video/             Hero loops {page}-{480,720}.mp4 + posters {page}-poster-{854,1280}.{avif,webp}
src/
  main.tsx                 Mounts <App/>, imports global CSS
  App.tsx                  Providers, route table (lazy pages), skip link, nav/footer, grain overlay
  styles/index.css         Design tokens (both themes), surface utilities, keyframes, cursor, grain
  data/                    ALL copy and business facts — edit content here
    site.ts                Company facts (email, phone, hours…), nav + legal links
    pages.ts               Per-page title/description/path + hero video mapping
    content.ts             Capabilities, equipment, services, process, principles, FAQ, photos, gallery, testimonials
    types.ts               Content types (Fact, Service, FaqItem, Photo, GalleryTile…)
    map.generated.ts       Generated map dots + hub coordinates (do not edit by hand)
  pages/                   Page compositions (one per route) — HomeSections.tsx is Home below the hero
  sections/                Page sections (Hero, Services, Process, Gallery, LanePlotter, Contact…)
  components/              Shared UI (Nav, Footer, Button, PageHero, HeroVideo, Reveal, SplashScreen…)
  lib/                     Router, theme, smooth scroll, GSAP setup, page meta, small hooks/stores
colors_to_use/             Palette reference images (git-ignored, not part of the site)
```

## 5. Pages and routing

Routes are declared in `src/App.tsx`. Home ships in the entry bundle (its below-the-fold sections are a
separate chunk, see §12); every other page is lazy-loaded as its own chunk. Unknown paths render `NotFound`.

| Route           | Page file            | Hero clip  | Sections (in order)                                                                 |
| --------------- | -------------------- | ---------- | ----------------------------------------------------------------------------------- |
| `/`             | `Home.tsx` + `HomeSections.tsx` | `home` | Hero · Capabilities · Manifesto · Services · TypeRibbons · Process (compact) · HoursClock · WhyUs (compact) · Gallery · Testimonials · FAQ (first 4) · CtaBand |
| `/services`     | `ServicesPage.tsx`   | `services` | PageHero (+ on-page index) · Capabilities · Services bento · ServiceDetails ledger · CtaBand |
| `/how-it-works` | `HowItWorksPage.tsx` | `process`  | PageHero · Process (pinned 5 steps) · TypeRibbons · HoursClock · Onboarding · CtaBand |
| `/lanes`        | `LanesPage.tsx`      | `lanes`    | PageHero · LanePlotter · Capabilities · CtaBand                                     |
| `/about`        | `AboutPage.tsx`      | `about`    | PageHero · WhyUs (principles) · Gallery · Testimonials · CtaBand                    |
| `/faq`          | `FaqPage.tsx`        | `faq`      | PageHero · FAQ (all) · CtaBand                                                      |
| `/contact`      | `ContactPage.tsx`    | `contact`  | PageHero (email/hours) · Contact form                                               |
| `/privacy`, `/terms` | `Legal.tsx`     | —          | Draft legal page with a TBC notice                                                  |
| anything else   | `NotFound.tsx`       | —          | 404 page                                                                            |

**Router** (`src/lib/router.tsx`): `<Link href>` renders a real `<a>` (crawlable, opens in new tabs) and
navigates client-side on plain left clicks. Hash links (`/services#rate-negotiation`) wait up to ~2 s for the
lazy page to render, then smooth-scroll to the anchor (80 px nav offset). `ScrollTrigger.refresh()` runs after
every route change.

**Adding a page:** create `src/pages/MyPage.tsx` (call `usePageMeta(PAGES.x)`), add an entry to `PAGES`
(and `PAGE_VIDEO` if it has a hero clip) in `src/data/pages.ts`, add the route to `ROUTES` in `App.tsx`, add it
to the poster-preload map in `index.html`, `NAV_LINKS` if it belongs in the nav, and `public/sitemap.xml`.

## 6. Sections catalogue

All in `src/sections/`. Each section takes an optional `index` ("01", "02"…) shown in its header.

| Section          | What it is                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `Hero`           | Home hero: background video, split-word headline, live local clock, animated sample "dispatch ticket", lane line with travelling dot, cursor headlight |
| `Capabilities`   | Credibility strip of what the service covers (no invented stats or logos)                  |
| `Manifesto`      | Statement whose words light up in reading order as you scroll (scrubbed, not pinned)       |
| `Services`       | Bento grid of six services with mini visuals (load board, negotiation, route, comms, docs, support), 3D tilt + spotlight on hover |
| `ServiceDetails` | Editorial ledger: one row per service with what it includes; anchor targets for nav links |
| `TypeRibbons`    | Two crossing tilted ribbons (pipeline stages / sample lanes) sliding with scroll; decorative |
| `Process`        | Five-step process. Desktop: pinned stage advanced by scroll. Mobile/reduced motion: plain list |
| `HoursClock`     | FMCSA hours-of-service limits (11 h driving, 14 h window, 30 min break, 70 h weekly) as rings — regulatory facts, not company metrics |
| `Onboarding`     | Documents-to-start checklist + highlighted next-steps card                                 |
| `WhyUs`          | Five principles (I–V) with a parallax photo                                                |
| `Gallery`        | Native horizontal scroller: photos, type cards, a typing "dispatch.log" terminal, a route drawing; custom always-visible scrollbar, drag, buttons |
| `Testimonials`   | Snap carousel (3/2/1 cards by width) with dots and prev/next. Renders nothing if the list is empty |
| `Faq`            | Accordion; `limit` shows only the first N (Home shows 4)                                   |
| `LanePlotter`    | Interactive U.S. dot map: pick two of 14 hubs, see distance/bearing, send the lane to the contact form |
| `Contact`        | Consultation request form (validation, equipment select, fleet size, lanes) → `mailto:`   |

## 7. Shared components and hooks

`src/components/`

| Component        | Purpose                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `Nav`            | Transparent over the hero, glass once scrolled, hides while scrolling down; Services dropdown, mobile menu, theme toggle, CTA |
| `Footer`         | Link columns, contact facts, back-to-top, interactive `DotWordmark`, legal links            |
| `PageHero`       | Hero for inner pages (video, breadcrumb, split headline, actions, optional aside). Also exports `HeroShade`, `HeroIndex` |
| `HeroVideo`      | Poster-first background loop: poster is the LCP image; video attaches after idle, pauses off-screen, skipped for reduced motion / Save-Data |
| `Button` (`ButtonLink`, `Knob`) | Pill CTA in `signal` / `glass` / `ghost` variants with magnetic hover and sliding arrow |
| `Reveal`, `SplitWords` | Blur-up block entrance and masked word-by-word headline rise (once, on view or on mount) |
| `SectionHeader`  | Index + eyebrow in the margin column, title across eight columns                            |
| `CtaBand`        | Closing call to action on every page except Contact                                         |
| `Picture`        | `<picture>` with AVIF + WebP, explicit width/height (no layout shift), lazy by default      |
| `SplashScreen`   | Once-per-session particle intro (3 s, Esc / "Skip intro" to dismiss)                        |
| `SiteCursor`     | Orange arrow cursor on fine pointers; native cursor returns for text fields, keyboard, touch |
| `DotWordmark`    | Footer halftone "Truckify": dots flee the pointer, click drops a ripple; draws only when visible |
| `ScrollProgress` | "Odometer" scroll rail (desktop) / 2 px bar (mobile)                                        |
| `ThemeToggle`    | Dark/light switch with a circular View-Transitions reveal                                   |
| `Logo`, `Tbc`    | Wordmark; `FactText` / `TbcTag` render placeholder facts with a visible **TBC** tag          |

`src/lib/`

| Module              | Purpose                                                                       |
| ------------------- | ----------------------------------------------------------------------------- |
| `router.tsx`        | `RouterProvider`, `useRouter`, `Link`                                         |
| `theme.tsx`         | `ThemeProvider`/`useTheme`; persists to `localStorage` (`truckify-theme`), updates `theme-color` |
| `smooth-scroll.tsx` | Lenis provider (`scrollTo`, `setLocked`); off for touch and reduced motion    |
| `gsap.ts`           | Registers ScrollTrigger + `useGSAP`; shared media queries `MQ`                |
| `motion-features.ts`| Motion's `domAnimation` features, loaded asynchronously by `LazyMotion`       |
| `page-meta.ts`      | `usePageMeta` — title, description, canonical, OG tags per route              |
| `lane-store.ts`     | Tiny store passing the plotted lane from LanePlotter to the contact form      |
| `use-hero-parallax.ts`, `use-pointer-fx.ts`, `use-media-query.ts` | Hero parallax, magnetic/headlight pointer effects, live media query |

## 8. Editing content

**All copy and business facts live in `src/data/` — no need to touch components to change text.**

- `site.ts` → company email, phone, desk hours, location, social links, nav links, legal links.
  A `Fact` with `placeholder: true` shows a dashed **TBC** tag wherever it renders (except the footer).
  Replace the value and delete the flag once confirmed.
- `pages.ts` → each page's `<title>`, meta description and hero clip/alt text.
- `content.ts` →
  - `CAPABILITIES`, `EQUIPMENT` (dry van, reefer, flatbed, step deck, power only, box truck)
  - `SERVICES` (6): load sourcing, rate negotiation, route & load coordination, dispatch communication,
    documentation & admin, carrier support — title, summary, value line, `includes[]`, icon, visual
  - `PROCESS` (5 steps), `PRINCIPLES` (5, numerals I–V)
  - `FAQ` (8) — items with `needsConfirmation: true` (pricing, contract, equipment) describe policies the
    business still has to confirm
  - `PHOTOS`, `GALLERY` tiles, `TESTIMONIALS`
- Hero, page-hero and section headings are written inline in each page/section file.
- Onboarding document checklist: `src/sections/Onboarding.tsx`. Legal copy: `src/pages/Legal.tsx`.

> **Testimonials are currently demo copy** (`sample: true`, generic names like "Owner-operator") and they
> **are visible** on Home and About. Replace them with real, permitted quotes — or empty the
> `TESTIMONIALS` array to hide the section — before launch.

## 9. Design system — colours, type, themes

### Palette: Asphalt & Safety Orange

Chosen after testing three reference palettes (Asphalt & Safety Orange, Interstate Blue & Midnight Navy,
Freight Red & Navy Cab) on the real pages: it gives the darkest charcoal base, the strongest accent contrast
(6.2 : 1 on the dark base) and carries the site's "hi-vis signal" concept. It replaced an earlier lime-green
signal colour.

| Role                 | Name           | Hex       |
| -------------------- | -------------- | --------- |
| Accent (buttons, highlights) | Safety Orange | `#FF6B1A` |
| Primary dark (headlines, dark base) | Asphalt | `#16181D` |
| Body text (light theme) | Gunmetal    | `#3D424A` |
| Background (light theme) | Concrete White | `#F4F2EE` |
| Secondary surface / cards | Light Steel | `#E3E1DC` |
| Muted text / labels  | Road Grey      | `#7A7E85` (tuned per theme for contrast, see below) |

### Tokens

Defined in `src/styles/index.css` for `[data-theme='dark']` (default) and `[data-theme='light']`, exposed to
Tailwind through `@theme inline` (e.g. `bg-accent`, `text-ink-muted`, `border-line`). **Never hard-code hex
values in components — use a token.**

| Token (`--c-*` / Tailwind) | Dark      | Light     | Used for                                         |
| -------------------------- | --------- | --------- | ------------------------------------------------ |
| `bg`                       | `#16181d` | `#f4f2ee` | Page background                                  |
| `bg-elev`                  | `#1d2026` | `#e3e1dc` | Raised surfaces, cards                           |
| `bg-sunk`                  | `#101216` | `#dfdcd6` | Footer, splash                                   |
| `ink`                      | `#f4f2ee` | `#16181d` | Headings, primary text                           |
| `ink-muted`                | `#a9adb4` | `#3d424a` | Body / secondary text                            |
| `ink-faint`                | `#8a8e95` | `#5b5f66` | Labels, captions                                 |
| `line`, `line-strong`      | ink @ 10% / 20% | ink @ 12% / 24% | Borders, dividers, inactive tracks     |
| `accent`                   | `#ff6b1a` | `#ff6b1a` | Primary buttons, fills, lines, focus ring (dark) |
| `accent-ink`               | `#16181d` | `#16181d` | Text/icons **on** orange (white on orange fails contrast) |
| `accent-text`              | `#ff7d36` | `#a3400c` | Orange used **as text** on the page background; focus ring (light) |
| `accent-2`                 | `#ff7d36` | `#a3400c` | Secondary signal: TBC/draft badges, terminal status dot |
| `dark`, `on-dark`, `accent-on-dark` | `#101216` / `#f4f2ee` / `#ff7d36` | `#16181d` / `#f4f2ee` / `#ff7d36` | Always-dark surfaces (terminal tile, cursor outline, photo captions) |
| `danger`, `danger-text`    | `#ff5468` | `#c8102e` | Form errors — a cooler red so it never reads as the accent |
| `glass*`, `card*`, `photo-*`, `video-filter`, `dot`, `shadow-float` | — | — | Glass panels, cards, photo/video grading, dot fields |

Every text token clears **WCAG AA (≥ 4.5 : 1)** on the surfaces it is used on.
Buttons: primary = orange with Asphalt text, hover inverts to ink/bg; `glass` and `ghost` variants for secondary actions.

**Changing the palette:** edit the two token blocks at the top of `index.css`, then update the three places
outside CSS that need literal colours: `theme-color` metas in `index.html`, `apply()` in `src/lib/theme.tsx`,
and `public/favicon.svg` (canvas effects read the tokens at runtime; their fallbacks are in
`SplashScreen.tsx` / `DotWordmark.tsx`). Re-check contrast for any text token you change.

### Typography

- **Geist Variable** — UI and headlines (tight negative tracking)
- **Fraunces Variable** (light italic) — the editorial second line of headlines ("*We run the board.*")
- **Geist Mono Variable** — `.label` eyebrows, codes, read-outs (uppercase, 0.14em tracking)
- Fluid scale tokens: `text-display`, `text-hero`, `text-mega`, `text-title`, `text-lede`, `text-label`

### Themes

Dark is the default. The inline script in `index.html` applies the saved choice (`localStorage`
`truckify-theme`) or the OS preference **before first paint** to avoid a flash. The toggle animates with a
circular reveal via the View Transitions API where supported.

### Layout utilities

`.shell` (max 1520 px container with fluid gutters), 12-column grids, `.glass` / `.glass-sheen` (liquid
glass), `.reeded`, `.hairline-grid`, `.dot-field`, `.spotlight`, `.beam` (rotating border on hover), `.grain`
(film-grain overlay), `.photo` / `.video-tone` (monochrome grading).

### Responsive design

Mobile-first Tailwind breakpoints: base (phones) → `sm` 640 px → `md` 768 px (tablet) → `lg` 1024 px
(desktop nav, 12-column footer, pinned Process) → `xl`/`2xl`. Verified with no horizontal scrolling at
320, 360, 375, 414, 768, 1024 and 1440 px.

- Phones: hamburger menu, stacked hero, single-column cards, swipeable gallery/testimonial carousels,
  lane-plotter pickers stacked with a vertical swap button, 2-column footer.
- Tablet: 2-column grids, desktop-style hero copy, footer stays 2-column until `lg`.
- Touch targets are ≥ 24 px (padding added with matching negative margins where needed, so layout is unchanged).
- When adding UI, test at **320 px**: anything wider than the viewport makes mobile browsers widen the
  whole page, which also pushes the fixed header's menu button off screen.

## 10. Motion and interactive effects

- **Entrances:** `Reveal` (blur-up), `SplitWords` (masked word rise) via Motion, once per element.
- **Scroll:** hero parallax, Manifesto word lighting, TypeRibbons, Process pin (desktop), WhyUs photo
  parallax — all GSAP ScrollTrigger inside `gsap.matchMedia` so they disappear under reduced motion.
- **Smooth scroll:** Lenis on mouse/trackpad devices only (touch keeps native scrolling).
- **Pointer:** custom cursor, magnetic buttons, hero headlight, card tilt/spotlight, footer dot repulsion.
- **Ambient:** pulsing beacon dots, dashed lane lines, typing terminal, sample dispatch ticket.
- **Splash:** once per browser session (`sessionStorage` `truckify-intro-seen`).

**`prefers-reduced-motion: reduce` turns off:** splash, hero video (poster only), pinning and scrubbing,
smooth scroll, custom cursor, pointer physics; entrances render final states; CSS animations are reduced to
a single instant frame.

## 11. Accessibility

- Skip link ("Skip to content"), landmark structure, one `h1` per page, labelled navs (breadcrumb, on-page index)
- Visible `:focus-visible` ring in the accent colour; keyboard-operable menus, accordion, carousels, map
- Split headlines keep the full sentence in the accessibility tree (`sr-only`), animated copies are `aria-hidden`
- Decorative canvases/SVGs are `aria-hidden`; meaningful images have alt text (`pages.ts`, `content.ts`)
- Splash is a labelled modal; page behind it is `inert` and scroll-locked; Esc dismisses
- Contact form: labelled fields, inline errors linked with `aria-describedby`, focus moves to the first error
- Touch targets ≥ 24 px; colour contrast AA throughout (see §9)
- Lighthouse accessibility: 100 on inner pages, 96 on Home

## 12. Performance

Architecture choices that keep the site fast:

- **Code splitting:** every route except Home is lazy; Home's below-the-fold sections (`HomeSections.tsx`)
  are a separate chunk requested at module load, so the hero renders without waiting for them.
  `react` and the `scroll` runtime (gsap + lenis) are long-cacheable vendor chunks; Motion's animation
  features load asynchronously through `LazyMotion`.
- **LCP:** each page's hero poster (AVIF, 854/1280 w) is preloaded from `index.html` with
  `fetchpriority="high"`; the hero video only attaches after the page is idle and pauses off-screen.
- **Images:** AVIF + WebP at two widths with `srcset`/`sizes`, explicit dimensions, lazy below the fold.
- **Fonts:** self-hosted variable fonts with `unicode-range` subsets (only Latin downloads for English).
  Font preloading was tested and made things worse — don't add it back without measuring.
- **Runtime:** no permanent `will-change` on animated text/blocks; looping beacons animate `transform`/
  `opacity` only; canvas effects batch drawing into a few paths per frame; the footer canvas does no work
  until it scrolls into view; scroll listeners are passive and rAF-throttled and write to the DOM directly.

Measured with Lighthouse 13.6 (simulated mobile, 4× CPU slowdown), original vs. optimised build back to back:

| Page            | Perf     | Total Blocking Time | LCP            | CLS     |
| --------------- | -------- | ------------------- | -------------- | ------- |
| Home (mobile, 5 runs) | 56 → 61 | 2,289 → 1,531 ms | 4.20 → 4.05 s | ≈ 0     |
| Home (desktop)  | 85 → 87  | 339 → 305 ms        | 0.23 → 0.21 s  | ≈ 0     |
| Services        | 78 → 81  | 512 → 452 ms        | 3.49 → 3.24 s  | ≈ 0     |
| Contact         | 73 → 79  | 737 → 576 ms        | 3.34 → 3.16 s  | ≈ 0     |
| How it works    | 72 → 69  | 844 → 1,065 ms      | ≈ 3.4 s        | ≈ 0     |
| Lanes           | 73 → 70  | 776 → 963 ms        | ≈ 3.4 s        | ≈ 0     |

Run-to-run variance is large; small differences are within noise. **Known limit:** mobile LCP (~3–4 s) is
dominated by the intentional ~1 s hero entrance delay plus client-side rendering. Shortening the entrance
or pre-rendering the HTML are the next levers.

## 13. SEO and metadata

- `usePageMeta` sets title, description, canonical and `og:*` per route from `src/data/pages.ts`.
- Static OG/Twitter tags and `og.jpg` (1200×630) in `index.html`; `robots.txt` and `sitemap.xml` in `public/`.
- All of these use the placeholder domain **`truckify.example`** — see the launch checklist.
- Being a client-rendered SPA, crawlers see content after JS runs (Google renders JS); a pre-render step
  would improve this if SEO becomes a priority.

## 14. Media: images, video, map

**Photos** — `public/media/{name}-{w}.{avif,webp}`, two widths per photo (800/1400, trailer 600/1100).
Register them in `PHOTOS` (`content.ts`) with intrinsic width/height and alt text; render with `<Picture>`.

**Hero videos** — per page in `public/media/video/`: `{name}-480.mp4` (phones), `{name}-720.mp4`, and posters
`{name}-poster-854` / `-1280` in AVIF + WebP. 10-second muted H.264 loops. To swap a clip, keep the same file
names, or add a new name to `PAGE_VIDEO` (`pages.ts`) **and** the preload map in `index.html`.

**Map** — `npm run gen:map` projects the contiguous U.S. (Albers) into a dot matrix plus 14 freight hubs
(SEA, LAX, PHX, SLC, DEN, DAL, HOU, CHI, MEM, ATL, CLT, JAX, CMH, NYC) and writes
`src/data/map.generated.ts`. The output is committed, so no geo libraries ship to the browser.

## 15. Contact form and lane plotter

- **Form** (`src/sections/Contact.tsx`): Name\*, Email\*, Phone, MC/DOT number, Equipment\* (select),
  Fleet size (1 / 2–5 / 6–15 / 16+), Preferred lanes, Anything else. Required fields are validated inline.
- **Submission:** builds a pre-filled email to `SITE.email` and opens the visitor's mail app (`mailto:`).
  Nothing is stored on the site. To collect submissions, replace the `submit` function with a call to a form
  backend or API.
- **Lane plotter → form:** "Discuss this lane" on `/lanes` stores the plotted lane (`lane-store.ts`) and the
  contact form arrives with it pre-filled.

## 16. Deployment

Vercel, as a static SPA (`vercel.json`): build command `npm run build`, output `dist/`, and a rewrite of all
paths to `index.html` so deep links and refreshes on `/services`, `/faq`, etc. work (real static files are
served first). Any static host works if it has the same SPA fallback.

## 17. Launch checklist

- [ ] Real email, phone, desk hours, location in `src/data/site.ts` (remove `placeholder: true`)
- [ ] Production domain: `SITE.url`, canonical + OG URLs in `index.html`, `public/sitemap.xml`, `public/robots.txt`
- [ ] Services, process, principles and capabilities copy matches what the business offers (`content.ts`)
- [ ] Confirm FAQ answers marked `needsConfirmation` (pricing model, contract terms, equipment list)
- [ ] Onboarding document checklist (`src/sections/Onboarding.tsx`)
- [ ] Real Privacy Policy and Terms (`src/pages/Legal.tsx`)
- [ ] Replace sample testimonials with real, permitted quotes — or empty `TESTIMONIALS`
- [ ] Add social links to `SITE.social` (none render until added)
- [ ] Decide whether the `mailto:` form is enough or connect a form backend
- [ ] Optional: verified credentials for the Capabilities strip (years in business, FMCSA registration)
- [ ] Final check: `npm run build && npm run lint`, Lighthouse on the deployed URL

## 18. Troubleshooting

- **`npm ci` fails with `EPERM … .node` on Windows** — a running dev/preview server is holding native
  binaries (Rolldown, Tailwind oxide). Stop all `vite` processes, then reinstall.
- **`node_modules` vanished / thousands of untracked files on `main`** — `main` is still at the initial commit,
  whose `.gitignore` doesn't exclude `node_modules`. Switching to `main` in a Git GUI can stash or delete
  them. Work on `feat/truckify-website`, and run `npm install` if it happens.
- **Scroll animations misaligned after content changes** — `ScrollTrigger.refresh()` runs on route change and
  after Home's sections mount; call it after any other late layout change.
- **Hash link doesn't scroll** — the target `id` must exist within ~2 s of navigation (router retry window).
- **Intro splash not showing** — it shows once per session; clear `sessionStorage` key `truckify-intro-seen`.

## 19. Credits and licences

- Photography: [Unsplash](https://unsplash.com/license) (Unsplash License)
- Hero video: [Mixkit](https://mixkit.co/license/) (Mixkit Free License) — clips 33856, 23852, 26005, 52428,
  1919, 28787, 52430, re-encoded to 10 s H.264 loops (720p + 480p) with poster frames in `public/media/video/`
- Map geometry: [us-atlas](https://github.com/topojson/us-atlas) (U.S. Census Bureau data, ISC licence)
- Fonts: Geist and Geist Mono (SIL OFL), Fraunces (SIL OFL), via Fontsource
