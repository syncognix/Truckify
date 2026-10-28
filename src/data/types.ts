import type { LucideIcon } from 'lucide-react'

/**
 * A business fact. `placeholder: true` marks values that were not supplied by
 * the business and must be confirmed before launch — they render with a
 * visible "TBC" tag so they can't slip into production unnoticed.
 */
export interface Fact {
  value: string
  placeholder?: boolean
}

export interface Hub {
  code: string
  name: string
  lat: number
  lon: number
  x: number
  y: number
}

export type ServiceVisual = 'board' | 'negotiate' | 'route' | 'comms' | 'docs' | 'support'

export interface Service {
  id: string
  code: string
  title: string
  summary: string
  value: string
  /** What the service covers in practice — shown on the Services page. */
  includes: string[]
  icon: LucideIcon
  visual: ServiceVisual
}

export interface ProcessStep {
  title: string
  body: string
  detail: string
}

export interface Principle {
  numeral: string
  title: string
  body: string
}

export interface FaqItem {
  q: string
  a: string
  /** Answer depends on a business policy that hasn't been confirmed yet. */
  needsConfirmation?: boolean
}

export interface Photo {
  /** File stem in /public/media; renditions are `${src}-${w}.{avif,webp}`. */
  src: string
  widths: [number, number]
  width: number
  height: number
  alt: string
}

export type GalleryTile =
  | { kind: 'photo'; photo: Photo; caption: string; shape: 'wide' | 'tall' | 'square' }
  | { kind: 'type'; eyebrow: string; text: string }
  | { kind: 'terminal' }
  | { kind: 'route' }

export interface Testimonial {
  quote: string
  name: string
  role: string
}
