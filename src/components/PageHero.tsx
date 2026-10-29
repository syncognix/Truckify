import { m } from 'motion/react'
import { useRef, type ReactNode } from 'react'
import { PAGE_VIDEO, type PageKey } from '../data/pages'
import { Link } from '../lib/router'
import { useHeroParallax } from '../lib/use-hero-parallax'
import { useHeadlight } from '../lib/use-pointer-fx'
import { HeroVideo } from './HeroVideo'
import { SplitWords } from './Reveal'

const EASE = [0.16, 1, 0.3, 1] as const

/** Gradient stack that keeps copy legible over footage in either theme. */
export function HeroShade() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(100deg,var(--c-bg)_4%,color-mix(in_oklab,var(--c-bg)_72%,transparent)_40%,color-mix(in_oklab,var(--c-bg)_18%,transparent)_78%)]"
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,var(--c-bg)_0%,transparent_45%)]" />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--c-bg)_55%,transparent),transparent_30%)]" />
      <div aria-hidden data-hero-shade className="absolute inset-0 bg-bg opacity-0" />
      <div aria-hidden className="hairline-grid absolute inset-0 opacity-40 [mask-image:linear-gradient(180deg,black,transparent_85%)]" />
      <div aria-hidden className="headlight absolute inset-0" />
    </>
  )
}

interface PageHeroProps {
  page: PageKey
  code: string
  eyebrow: string
  title: string
  /** Second headline line, set in the editorial serif italic. */
  accent: string
  lede: ReactNode
  actions?: ReactNode
  aside?: ReactNode
}

export function PageHero({ page, code, eyebrow, title, accent, lede, actions, aside }: PageHeroProps) {
  const root = useRef<HTMLElement>(null)
  useHeroParallax(root)
  useHeadlight(root)

  return (
    <section ref={root} aria-labelledby="page-title" className="relative isolate overflow-hidden">
      <HeroVideo clip={PAGE_VIDEO[page]} />
      <div className="absolute inset-0 -z-10">
        <HeroShade />
      </div>

      <div className="shell relative flex min-h-[max(78svh,600px)] flex-col pt-28 pb-12 sm:pt-32 lg:pb-16">
        <nav aria-label="Breadcrumb" className="label flex items-center gap-3 text-ink-faint">
          <Link href="/" className="-my-3 py-3 transition-colors hover:text-ink">
            Truckify
          </Link>
          <span aria-hidden>/</span>
          <span aria-current="page" className="text-ink-muted">
            {eyebrow}
          </span>
          <span className="ml-auto hidden sm:inline">{code}</span>
        </nav>

        <div className="mt-auto grid grid-cols-12 items-end gap-x-6 gap-y-10 pt-16">
          <div data-hero-copy className="col-span-12 lg:col-span-8">
            <p className="label mb-5 flex items-center gap-3 text-accent-text">
              <span className="size-1.5 rounded-full bg-accent" />
              {eyebrow}
            </p>
            <h1 id="page-title" className="text-hero font-semibold tracking-[-0.05em]">
              <SplitWords text={title} onMount delay={0.15} className="block" />
              <span className="block font-serif font-light italic tracking-[-0.03em]">
                <SplitWords text={accent} onMount delay={0.4} />
              </span>
            </h1>
            <m.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.75 }}
              className="mt-8 flex flex-col gap-8"
            >
              <div className="max-w-xl text-lede text-ink-muted">{lede}</div>
              {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
            </m.div>
          </div>
          {aside && (
            <m.div
              data-hero-aside
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.9 }}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            >
              {aside}
            </m.div>
          )}
        </div>
      </div>
    </section>
  )
}

/** Compact glass index of what's on the page — doubles as in-page navigation. */
export function HeroIndex({ items }: { items: { label: string; href: string }[] }) {
  return (
    <nav aria-label="On this page" className="glass glass-sheen rounded-panel p-2">
      <p className="label px-4 pt-3 pb-2 text-ink-faint">On this page</p>
      <ul>
        {items.map((item, i) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center justify-between rounded-xl px-4 py-3 transition-colors hover:bg-card-hover"
            >
              <span className="flex items-center gap-4">
                <span className="label text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[0.95rem] font-medium">{item.label}</span>
              </span>
              <span aria-hidden className="text-ink-faint transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:text-accent-text">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
