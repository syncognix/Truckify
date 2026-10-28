import { useRef } from 'react'
import { SectionHeader } from '../components/SectionHeader'
import { gsap, MQ, useGSAP } from '../lib/gsap'

/**
 * Federal hours-of-service limits for property-carrying CMV drivers
 * (FMCSA, 49 CFR Part 395). Regulatory facts — not company metrics.
 */
const LIMITS = [
  { value: 11, max: 14, unit: 'hrs', label: 'Driving limit', note: 'Max driving after 10 consecutive hours off duty.' },
  { value: 14, max: 14, unit: 'hrs', label: 'On-duty window', note: 'Driving must stop once the 14-hour window closes.' },
  { value: 30, max: 60, unit: 'min', label: 'Break', note: 'Required after 8 cumulative hours of driving.' },
  { value: 70, max: 70, unit: 'hrs', label: 'Weekly cap', note: 'On duty in 8 days (60 in 7 for non-daily carriers).' },
]

const R = 54
const C = 2 * Math.PI * R

export function HoursClock({ index = '03' }: { index?: string }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionAny, () => {
        gsap.utils.toArray<HTMLElement>('[data-gauge]', root.current).forEach((g) => {
          const arc = g.querySelector<SVGCircleElement>('[data-arc]')
          const num = g.querySelector<HTMLElement>('[data-num]')
          const target = Number(g.dataset.value)
          const frac = Number(g.dataset.frac)
          const counter = { v: 0 }
          const tl = gsap.timeline({ scrollTrigger: { trigger: g, start: 'top 85%', once: true } })
          tl.fromTo(arc, { strokeDashoffset: C }, { strokeDashoffset: C * (1 - frac), duration: 1.6, ease: 'expo.out' }, 0)
          tl.to(counter, {
            v: target,
            duration: 1.6,
            ease: 'expo.out',
            onUpdate: () => {
              if (num) num.textContent = String(Math.round(counter.v))
            },
          }, 0)
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-labelledby="hos-title" className="shell py-28 sm:py-36">
      <SectionHeader
        index={index}
        eyebrow="Hours of service"
        id="hos-title"
        title={
          <>
            Built around <span className="font-serif font-light italic">your clock.</span>
          </>
        }
        aside={
          <p className="text-[0.95rem]">
            Your hours are regulated and finite. We plan loads, appointments and reloads around them.
          </p>
        }
      />
      <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {LIMITS.map((l) => {
          const frac = l.value / l.max
          return (
            <li
              key={l.label}
              data-gauge
              data-value={l.value}
              data-frac={frac}
              className="group flex flex-col gap-8 bg-bg p-7 transition-colors duration-500 hover:bg-bg-elev"
            >
              <div className="relative mx-auto grid size-44 place-items-center">
                <svg viewBox="0 0 128 128" className="absolute inset-0 size-full -rotate-90" aria-hidden>
                  <circle cx="64" cy="64" r={R} fill="none" stroke="var(--c-line)" strokeWidth="6" />
                  <circle
                    cx="64"
                    cy="64"
                    r={R}
                    fill="none"
                    stroke="var(--c-line-strong)"
                    strokeWidth="1"
                    strokeDasharray="1 7.43"
                  />
                  <circle
                    data-arc
                    cx="64"
                    cy="64"
                    r={R}
                    fill="none"
                    stroke="var(--c-accent)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={C * (1 - frac)}
                  />
                </svg>
                <p className="text-center">
                  <span
                    data-num
                    className="block text-[3.4rem] leading-none font-semibold tracking-[-0.06em] tabular-nums"
                  >
                    {l.value}
                  </span>
                  <span className="label mt-1 block text-ink-faint">{l.unit}</span>
                </p>
              </div>
              <div>
                <h3 className="text-[1.3rem] font-semibold tracking-[-0.035em]">{l.label}</h3>
                <p className="mt-2 text-[0.92rem] text-ink-muted">{l.note}</p>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="label mt-4 text-ink-faint">
        Source: FMCSA hours-of-service rules for property-carrying drivers (49 CFR Part 395).
      </p>
    </section>
  )
}
