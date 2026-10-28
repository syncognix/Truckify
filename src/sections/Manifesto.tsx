import { useRef } from 'react'
import { gsap, MQ, useGSAP } from '../lib/gsap'

/** `*word*` marks an emphasised word (serif italic, signal colour). */
const TEXT =
  'Every *empty* mile, every hour *on hold*, every lost rate con is money leaving your truck. We sit at the desk so you can stay at the *wheel* — finding the freight, fighting for the rate, and filing the paper while you drive.'

const WORDS = TEXT.split(' ').map((raw) => {
  const em = raw.startsWith('*')
  return { text: raw.replace(/\*/g, ''), em }
})

/**
 * Statement block whose words light up in reading order as it scrolls through
 * the viewport (scrubbed, never pinned). Reduced motion shows it fully lit.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionAny, () => {
        gsap.fromTo(
          '[data-word]',
          { opacity: 0.5 }, // unlit words still clear 3:1 large-text contrast
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.08,
            scrollTrigger: { trigger: '[data-manifesto]', start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
          },
        )
        gsap.fromTo(
          '[data-manifesto-rule]',
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-manifesto]', start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} aria-label="Why dispatch matters" className="shell py-28 sm:py-40">
      <div className="grid grid-cols-12 gap-x-6 gap-y-8">
        <div className="label col-span-12 flex items-start gap-3 text-ink-muted md:col-span-3">
          <span className="size-1.5 translate-y-1 rounded-full bg-accent animate-pulse-dot" />
          The dispatch desk, in one breath
        </div>
        <div className="col-span-12 md:col-span-9">
          <p
            data-manifesto
            className="text-[clamp(1.5rem,2.9vw,2.75rem)] leading-[1.15] font-semibold tracking-[-0.04em] text-balance"
          >
            {WORDS.map((w, i) => (
              <span key={i}>
                <span
                  data-word
                  className={w.em ? 'font-serif font-light italic tracking-[-0.02em] text-accent-text' : undefined}
                >
                  {w.text}
                </span>{' '}
              </span>
            ))}
          </p>
          <div className="mt-10 h-px w-full bg-line">
            <div data-manifesto-rule className="h-px w-full origin-left bg-accent" />
          </div>
        </div>
      </div>
    </section>
  )
}
