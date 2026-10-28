import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { ButtonLink } from '../components/Button'
import { HeroVideo } from '../components/HeroVideo'
import { HeroShade } from '../components/PageHero'
import { SplitWords } from '../components/Reveal'
import { PAGE_VIDEO } from '../data/pages'
import { useHeroParallax } from '../lib/use-hero-parallax'
import { useHeadlight } from '../lib/use-pointer-fx'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const root = useRef<HTMLElement>(null)
  useHeroParallax(root)
  useHeadlight(root)

  return (
    <section ref={root} aria-labelledby="hero-title" className="relative isolate min-h-[max(100svh,680px)] overflow-hidden">
      {/* Footage develops from blur like a print in the tray; the poster is the LCP image. */}
      <HeroVideo clip={PAGE_VIDEO.home} className="motion-safe:animate-[hero-develop_2.4s_var(--ease-out-expo)_backwards]" />
      <div className="absolute inset-0 -z-10">
        <HeroShade />
      </div>

      <HeroRoute />

      <div className="shell relative flex min-h-[max(100svh,680px)] flex-col pt-28 pb-10 sm:pt-32 lg:pb-14">
        <TopReadout />

        <div className="relative mt-auto grid grid-cols-12 items-end gap-x-6 gap-y-10">
          <div data-hero-copy className="col-span-12 lg:col-span-9">
            <p className="label mb-6 flex items-center gap-3 text-ink-muted">
              <span className="size-1.5 rounded-full bg-accent animate-pulse-dot" />
              Truck dispatching for owner-operators &amp; small fleets
            </p>
            <h1 id="hero-title" className="text-display font-semibold tracking-[-0.055em]">
              <SplitWords text="You run the road." onMount delay={0.25} className="block" />
              <span className="mt-[0.06em] block font-serif text-[0.92em] font-light italic tracking-[-0.035em]">
                <SplitWords text="We run the" onMount delay={0.55} />{' '}
                <m.span
                  initial={{ backgroundSize: '0% 0.12em' }}
                  animate={{ backgroundSize: '100% 0.12em' }}
                  transition={{ duration: 1.1, ease: EASE, delay: 1.35 }}
                  className="bg-[linear-gradient(var(--c-accent),var(--c-accent))] bg-no-repeat [background-position:0_88%]"
                >
                  <SplitWords text="board." onMount delay={0.76} />
                </m.span>
              </span>
            </h1>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1 }}
              className="mt-10 grid gap-8 md:grid-cols-[minmax(0,30rem)_auto] md:items-end md:gap-12"
            >
              <p className="text-lede text-ink-muted">
                We find the freight, negotiate the rate and handle the back-office — so your hours go into miles,
                not phone calls.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact">Book a dispatch consult</ButtonLink>
                <ButtonLink href="/how-it-works" variant="ghost">
                  How it works
                </ButtonLink>
              </div>
            </m.div>
          </div>

          <div data-hero-aside className="col-span-12 hidden md:col-span-5 md:block lg:col-span-3">
            <DispatchTicket />
          </div>
        </div>
      </div>
    </section>
  )
}

function TopReadout() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setTime(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  const clock = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

  return (
    <div className="label grid grid-cols-2 gap-4 text-ink-faint sm:grid-cols-12 sm:gap-6">
      <span className="sm:col-span-4">
        <span className="text-ink-muted">39°50′N 98°35′W</span>
        <span className="hidden sm:inline"> — geographic centre, contiguous U.S.</span>
      </span>
      <span className="hidden sm:col-span-3 sm:block">Desk / TRK-01</span>
      <span className="text-right tabular-nums sm:col-span-5" aria-label={`Your local time ${clock}`}>
        Local <span className="text-ink-muted">{clock}</span>
      </span>
    </div>
  )
}

const STAGES = ['Sourced', 'Negotiated', 'Booked', 'In transit', 'Delivered'] as const

/** A sample load moving through the dispatch pipeline. Clearly labelled as illustrative. */
function DispatchTicket() {
  const reduce = useReducedMotion()
  const [stage, setStage] = useState(reduce ? STAGES.length - 1 : 0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2200)
    return () => window.clearInterval(id)
  }, [reduce])

  return (
    <m.figure
      initial={{ opacity: 0, y: 30, filter: 'blur(12px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 1.2, ease: EASE, delay: 1.2 }}
      className="glass glass-sheen rounded-panel p-5"
      aria-label="Illustrative example of a load moving through the dispatch process"
    >
      <div className="label flex items-center justify-between text-ink-faint">
        <span>Sample load</span>
        <span className="rounded-full border border-line px-2 py-1">Illustrative</span>
      </div>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-[1.9rem] leading-none font-semibold tracking-[-0.04em]">DAL → ATL</p>
          <p className="label mt-2 text-ink-muted">Dry van · 53′</p>
        </div>
        <p className="label text-right text-ink-faint">
          REF
          <br />
          <span className="text-ink-muted">SMPL-0142</span>
        </p>
      </div>

      <div className="mt-6 flex gap-1" aria-hidden>
        {STAGES.map((s, i) => (
          <span key={s} className="relative h-1 flex-1 overflow-hidden rounded-full bg-line-strong">
            <m.span
              className="absolute inset-0 origin-left bg-accent"
              initial={false}
              animate={{ scaleX: i <= stage ? 1 : 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="label text-ink-faint">Status</span>
        <span className="relative h-5 overflow-hidden text-right text-[0.9rem] font-medium">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span
              key={STAGES[stage]}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="block"
            >
              {STAGES[stage]}
            </m.span>
          </AnimatePresence>
        </span>
      </div>
    </m.figure>
  )
}

/** A single lane line drawn across the frame, with a signal dot travelling it. */
function HeroRoute() {
  const reduce = useReducedMotion()
  const d = 'M-40 610 C 240 560, 420 660, 700 560 S 1160 420, 1480 470'
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-70"
    >
      <path d={d} fill="none" stroke="var(--c-line-strong)" strokeWidth="1" />
      <path
        d={d}
        fill="none"
        stroke="var(--c-accent)"
        strokeWidth="1.4"
        strokeDasharray="2 22"
        strokeLinecap="round"
        className="animate-dash"
      />
      {!reduce && (
        <circle r="4" fill="var(--c-accent)">
          <animateMotion dur="14s" repeatCount="indefinite" path={d} />
        </circle>
      )}
    </svg>
  )
}
