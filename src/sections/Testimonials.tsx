import { m, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Quote, Truck } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { TESTIMONIALS } from '../data/content'

/**
 * Carrier voices: equal, self-contained cards in a snap carousel (3 visible on
 * desktop, 2 on tablet, 1 on phones) with prev/next buttons and position dots.
 * Swipe, trackpad and keyboard scrolling stay native. Cards fade in only, so
 * they never overlap while revealing. Renders nothing when the list is empty.
 */
export function Testimonials({ index = '—' }: { index?: string }) {
  const reduce = useReducedMotion()
  const scroller = useRef<HTMLUListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const [active, setActive] = useState(0)

  const measure = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 })
    const cards = [...el.children] as HTMLElement[]
    const left = el.getBoundingClientRect().left
    // The active card is the left-most one that is mostly in view.
    const first = cards.findIndex((c) => c.getBoundingClientRect().right - left > c.offsetWidth * 0.5)
    setActive(max - el.scrollLeft <= 2 ? cards.length - 1 : Math.max(0, first))
  }, [])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', measure)
      ro.disconnect()
    }
  }, [measure])

  const behavior: ScrollBehavior = reduce ? 'auto' : 'smooth'
  const goTo = (i: number) => {
    const el = scroller.current
    const card = el?.children[i] as HTMLElement | undefined
    if (!el || !card) return
    el.scrollTo({ left: card.offsetLeft - (el.firstElementChild as HTMLElement).offsetLeft, behavior })
  }
  const step = (dir: 1 | -1) => {
    const el = scroller.current
    const card = el?.firstElementChild as HTMLElement | null
    if (!el || !card) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior })
  }

  if (TESTIMONIALS.length === 0) return null

  return (
    <section aria-labelledby="voices-title" className="shell py-28 sm:py-36">
      <SectionHeader
        index={index}
        eyebrow="Carrier voices"
        id="voices-title"
        title={
          <>
            In their <span className="font-serif font-light italic">own words.</span>
          </>
        }
      />

      <div className="mt-16">
        <ul
          ref={scroller}
          aria-label="Carrier testimonials, scroll horizontally"
          tabIndex={0}
          className="-mx-1 flex snap-x snap-mandatory scroll-px-1 gap-4 overflow-x-auto overscroll-x-contain px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TESTIMONIALS.map((t, i) => (
            <m.li
              key={t.quote}
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.12 }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${TESTIMONIALS.length}`}
              className="flex w-[86%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
            >
              <figure className="group flex w-full flex-col rounded-panel border border-line bg-card transition-colors duration-500 hover:border-line-strong hover:bg-card-hover">
                <div className="flex items-center justify-between border-b border-line px-7 py-4">
                  <span className="label text-ink-faint">Voice {String(i + 1).padStart(2, '0')}</span>
                  <Quote aria-hidden className="size-5 text-accent-text" strokeWidth={1.6} />
                </div>

                <blockquote className="flex-1 px-7 py-8">
                  <p className="font-serif text-[clamp(1.2rem,1.6vw,1.45rem)] leading-[1.35] font-light tracking-[-0.01em] text-ink">
                    “{t.quote}”
                  </p>
                </blockquote>

                <figcaption className="flex items-center gap-4 border-t border-line px-7 py-5">
                  <span
                    aria-hidden
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg]"
                  >
                    <Truck className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.98rem] font-semibold tracking-[-0.02em]">{t.name}</span>
                    <span className="label mt-1 block leading-relaxed text-ink-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </m.li>
          ))}
        </ul>

        {/* Controls: position dots + prev/next. */}
        <div className="mt-8 flex items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-1 sm:gap-2" role="group" aria-label="Choose testimonial">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => goTo(i)}
                className="group/dot grid h-8 min-w-6 place-items-center px-1"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ease-out-expo ${
                    i === active ? 'w-8 bg-accent' : 'w-1.5 bg-line-strong group-hover/dot:bg-ink-muted'
                  }`}
                />
              </button>
            ))}
            <span className="label ml-3 hidden text-ink-faint tabular-nums sm:inline">
              {String(active + 1).padStart(2, '0')} / {String(TESTIMONIALS.length).padStart(2, '0')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CarouselButton label="Previous testimonial" disabled={edge.start} onClick={() => step(-1)}>
              <ArrowLeft className="size-4" />
            </CarouselButton>
            <CarouselButton label="Next testimonial" disabled={edge.end} onClick={() => step(1)}>
              <ArrowRight className="size-4" />
            </CarouselButton>
          </div>
        </div>
      </div>
    </section>
  )
}

function CarouselButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-12 place-items-center rounded-full border border-line-strong text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}
