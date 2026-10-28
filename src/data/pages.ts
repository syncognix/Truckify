/**
 * Route table + per-page metadata. Each page has its own hero clip; the
 * inline script in index.html mirrors `PAGE_VIDEO` to preload the right poster.
 */
export interface PageMeta {
  path: string
  title: string
  description: string
}

export interface HeroClip {
  /** File stem in /public/media/video: `${name}-{480,720}.mp4`, `${name}-poster-{854,1280}.{avif,webp}`. */
  name: string
  /** Describes the footage for the poster image's alt text. */
  alt: string
}

export const PAGES = {
  home: {
    path: '/',
    title: 'Truckify — Truck Dispatching for Owner-Operators & Small Fleets',
    description:
      'Truckify is a truck dispatching partner for owner-operators and small fleets: load sourcing, rate negotiation, broker communication and back-office paperwork, handled.',
  },
  services: {
    path: '/services',
    title: 'Dispatch Services — Truckify',
    description:
      'Load sourcing, rate negotiation, route coordination, dispatch communication, documentation and carrier support for owner-operators and small fleets.',
  },
  process: {
    path: '/how-it-works',
    title: 'How It Works — Truckify',
    description: 'Five steps from your first call to a well-run schedule: how Truckify onboards and dispatches carriers.',
  },
  lanes: {
    path: '/lanes',
    title: 'Lane Plotter — Truckify',
    description: 'Plot the freight lanes you want to run across the contiguous U.S. and bring them to your dispatch consult.',
  },
  about: {
    path: '/about',
    title: 'Why Truckify — Truck Dispatching Built Around Carriers',
    description: 'Personal communication, organized operations and transparent terms. The principles behind how Truckify dispatches.',
  },
  faq: {
    path: '/faq',
    title: 'Dispatch FAQ — Truckify',
    description: 'Answers about truck dispatch services: pricing, agreements, load approval, equipment, onboarding and communication.',
  },
  contact: {
    path: '/contact',
    title: 'Book a Dispatch Consult — Truckify',
    description: 'Tell us about your truck and how you like to run. Request a no-obligation dispatch consultation with Truckify.',
  },
} satisfies Record<string, PageMeta>

export type PageKey = keyof typeof PAGES

export const PAGE_VIDEO: Record<PageKey, HeroClip> = {
  home: { name: 'home', alt: 'A semi-truck hauling a trailer along a highway into the setting sun' },
  services: { name: 'services', alt: 'A yard worker in a hard hat guiding a truck into position beside a trailer' },
  process: { name: 'process', alt: 'Aerial view looking straight down on freight trucks travelling a highway through forest' },
  lanes: { name: 'lanes', alt: 'Aerial view of trucks on a highway winding through dry mountain terrain' },
  about: { name: 'about', alt: 'Box trucks driving along a misty highway at dawn' },
  faq: { name: 'faq', alt: 'A cargo truck travelling an open highway past wind turbines' },
  contact: { name: 'contact', alt: 'Aerial view of a highway cutting through an arid mountain pass' },
}
