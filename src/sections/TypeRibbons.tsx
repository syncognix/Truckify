import { Asterisk } from 'lucide-react'
import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '../lib/gsap'

const STAGES = ['Load sourced', 'Rate negotiated', 'Rate con signed', 'Booked', 'In transit', 'Delivered', 'POD filed']
const LANES = ['DAL → ATL', 'MEM → CHI', 'PHX → LAX', 'KC → DEN', 'HOU → JAX', 'SEA → SLC', 'CMH → NYC']

function Band({ items, tone, dir }: { items: string[]; tone: 'signal' | 'ink'; dir: 1 | -1 }) {
  const row = [...items, ...items, ...items]
  return (
    <div
      data-band={dir}
      className={`flex w-max items-center py-4 sm:py-5 ${tone === 'signal' ? 'bg-accent text-accent-ink' : 'bg-ink text-bg'}`}
    >
      {row.map((item, i) => (
        <span
          key={i}
          className={`flex items-center gap-6 pr-6 text-[clamp(1.5rem,3.4vw,3rem)] leading-none whitespace-nowrap ${
            tone === 'signal' ? 'font-semibold tracking-[-0.045em]' : 'font-serif font-light italic tracking-[-0.02em]'
          }`}
        >
          {item}
          <Asterisk className="size-[0.7em] opacity-60" aria-hidden />
        </span>
      ))}
    </div>
  )
}

/**
 * Two crossing tilted ribbons — the dispatch pipeline and sample lanes — that
 * slide in opposite directions as the page scrolls. Purely decorative.
 */
export function TypeRibbons() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionAny, () => {
        const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.4 }
        gsap.fromTo('[data-band="1"]', { xPercent: -8 }, { xPercent: -30, ease: 'none', scrollTrigger: st })
        gsap.fromTo('[data-band="-1"]', { xPercent: -30 }, { xPercent: -8, ease: 'none', scrollTrigger: st })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden className="relative h-[clamp(11rem,22vw,17rem)] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[130vw] -translate-x-1/2 -translate-y-1/2 rotate-[-4deg] shadow-[0_20px_60px_-20px_rgb(0_0_0/0.5)]">
        <Band items={STAGES} tone="signal" dir={1} />
      </div>
      <div className="absolute top-1/2 left-1/2 w-[130vw] -translate-x-1/2 -translate-y-1/2 rotate-[3deg] opacity-95">
        <Band items={LANES} tone="ink" dir={-1} />
      </div>
    </div>
  )
}
