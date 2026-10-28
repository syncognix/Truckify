import { AnimatePresence, m } from 'motion/react'
import { useRef, useState } from 'react'
import { ButtonLink } from '../components/Button'
import { SectionHeader } from '../components/SectionHeader'
import { PROCESS } from '../data/content'
import { MQ, ScrollTrigger, useGSAP } from '../lib/gsap'
import { useMediaQuery } from '../lib/use-media-query'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Desktop: the stage pins and scroll advances through the five steps
 * (GSAP owns scroll → index; Framer Motion owns the crossfades).
 * Mobile / reduced motion: an ordinary readable list.
 */
export function Process({ index = '02', compact = false }: { index?: string; compact?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const canPin = useMediaQuery(MQ.motionDesktop)
  const pinned = canPin && !compact

  useGSAP(
    () => {
      if (!pinned) return
      const st = ScrollTrigger.create({
        trigger: stage.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (PROCESS.length - 0.4)}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(PROCESS.length - 1, Math.floor(self.progress * PROCESS.length))
          setActive((prev) => (prev === i ? prev : i))
          stage.current?.style.setProperty('--p', String(self.progress))
        },
      })
      return () => {
        st.kill()
        setActive(0)
      }
    },
    { scope: root, dependencies: [pinned], revertOnUpdate: true },
  )

  const step = PROCESS[active]

  return (
    <section id="process" ref={root} aria-labelledby="process-title" className="relative bg-bg-sunk">
      <div className="shell pt-28 sm:pt-36">
        <SectionHeader
          index={index}
          eyebrow="Process"
          id="process-title"
          title={
            <>
              Five steps from <span className="font-serif font-light italic">first call</span> to a full schedule.
            </>
          }
        />
      </div>

      {pinned ? (
        <div ref={stage} className="relative h-screen overflow-hidden">
          <div aria-hidden className="dot-field absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_60%_at_30%_50%,black,transparent)]" />
          <div className="shell relative grid h-full grid-cols-12 items-center gap-6">
            <div className="col-span-6 flex flex-col">
              <div className="relative h-[clamp(12rem,26vw,24rem)] overflow-hidden" aria-hidden>
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.span
                    key={active}
                    initial={{ y: '100%', opacity: 0, filter: 'blur(12px)' }}
                    animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: '-60%', opacity: 0, filter: 'blur(12px)' }}
                    transition={{ duration: 0.9, ease: EASE }}
                    className="absolute inset-0 block text-[clamp(12rem,26vw,24rem)] leading-[0.82] font-semibold tracking-[-0.08em]"
                  >
                    <span className="text-outline">0</span>
                    <span className="text-accent-text">{active + 1}</span>
                  </m.span>
                </AnimatePresence>
              </div>
              <p className="label mt-6 flex items-center gap-3 text-ink-faint">
                <span className="text-ink-muted">Stage {active + 1} / {PROCESS.length}</span>
                <span className="h-px w-10 bg-line-strong" />
                <span>{step.detail}</span>
              </p>
            </div>

            <ol className="relative col-span-6 col-start-7 flex flex-col">
              <span aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-line" />
              <span
                aria-hidden
                className="absolute top-0 bottom-0 left-0 w-px origin-top bg-accent [transform:scaleY(var(--p,0))]"
              />
              {PROCESS.map((s, i) => {
                const isActive = i === active
                return (
                  <li key={s.title} className="relative py-5 pl-10" aria-current={isActive ? 'step' : undefined}>
                    <span
                      aria-hidden
                      className={`absolute top-[1.85rem] left-[-4px] size-[9px] rounded-full border transition-colors duration-500 ${
                        i <= active ? 'border-accent bg-accent' : 'border-line-strong bg-bg-sunk'
                      }`}
                    />
                    <h3
                      className={`text-[clamp(1.4rem,2.2vw,2.1rem)] leading-tight font-semibold tracking-[-0.04em] transition-colors duration-500 ${
                        isActive ? 'text-ink' : 'text-ink-faint'
                      }`}
                    >
                      {s.title}
                    </h3>
                    <m.div
                      initial={false}
                      animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-md pt-3 text-ink-muted">{s.body}</p>
                    </m.div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      ) : (
        <div ref={stage} className="shell pt-14 pb-28 sm:pb-36">
          <ol className="grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-2 lg:grid-cols-5">
            {PROCESS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-6 bg-bg-sunk p-6">
                <span className="text-[3.5rem] leading-none font-semibold tracking-[-0.06em]">
                  <span className="text-outline">0</span>
                  <span className="text-accent-text">{i + 1}</span>
                </span>
                <div>
                  <p className="label mb-2 text-ink-faint">{s.detail}</p>
                  <h3 className="text-[1.35rem] leading-tight font-semibold tracking-[-0.035em]">{s.title}</h3>
                  <p className="mt-3 text-[0.95rem] text-ink-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
          {compact && (
            <div className="mt-10 flex justify-end">
              <ButtonLink href="/how-it-works" variant="glass">
                See the full process
              </ButtonLink>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
