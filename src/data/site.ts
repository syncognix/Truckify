import type { Fact } from './types'

/**
 * Company facts. Everything flagged `placeholder` was NOT provided by the
 * business — replace it (and drop the flag) before going live.
 */
export const SITE = {
  name: 'Truckify',
  url: 'https://www.truckify.example',
  email: { value: 'dispatch@truckify.example', placeholder: true } satisfies Fact,
  phone: { value: '+1 (000) 000-0000', placeholder: true } satisfies Fact,
  hours: { value: 'Mon–Fri · 06:00–20:00 CT', placeholder: true } satisfies Fact,
  location: { value: 'United States', placeholder: true } satisfies Fact,
  /** Add `{ label, href }` entries once real profiles exist; none render until then. */
  social: [] as { label: string; href: string }[],
}

export const NAV_LINKS = [
  { label: 'Services', href: '/services' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Lanes', href: '/lanes' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
] as const

export const LEGAL_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const
