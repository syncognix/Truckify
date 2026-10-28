import { useRef } from 'react'
import { ButtonLink } from '../components/Button'
import { Picture } from '../components/Picture'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { PHOTOS, PRINCIPLES } from '../data/content'
import { gsap, MQ, useGSAP } from '../lib/gsap'

export function WhyUs({ index = '04', compact = false }: { index?: string; compact?: boolean }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionAny, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: '[data-why-band]', start: 'top bottom', end: 'bottom top', scrub: true },
        })
        tl.fromTo('[data-why-photo]', { yPercent: -12, scale: 1.15 }, { yPercent: 12, scale: 1.05 }, 0)
          .fromTo('[data-why-reed]', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.28 }, 0.04)
          .fromTo('[data-why-tint]', { opacity: 0.65 }, { opacity: 0.15, duration: 0.5 }, 0)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="why" ref={root} aria-labelledby="why-title" className="py-28 sm:py-36">
      <div className="shell">
        <SectionHeader
          index={index}
          eyebrow="Why Truckify"
          id="why-title"
          title={
            <>
              Built for carriers who would rather <span className="font-serif font-light italic">drive</span> than
              dial.
            </>
          }
        />
      </div>

      {/* Editorial band: photograph seen through a sheet of fluted glass. */}
      <figure data-why-band className="relative mt-16 h-[78svh] min-h-[520px] overflow-hidden">
        <div data-why-photo className="absolute inset-0 will-change-transform">
          <Picture photo={PHOTOS.desert} sizes="100vw" className="photo h-full w-full object-cover" />
        </div>
        <div data-why-tint aria-hidden className="absolute inset-0 bg-bg" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,var(--c-bg),transparent_35%,transparent_80%,var(--c-bg))]" />

        <div data-why-reed className="reeded absolute inset-y-0 right-0 w-full md:w-[56%]">
          <div className="flex h-full flex-col justify-between p-6 sm:p-10 lg:p-14">
            <span className="label text-ink-muted">Fig. 04 — A dispatcher’s view</span>
            <blockquote className="max-w-xl">
              <p className="font-serif text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.02] font-light tracking-[-0.03em] text-balance">
                “Dispatch is a relationship,
                <span className="italic text-accent-text"> not a transaction.</span>”
              </p>
              <footer className="label mt-8 flex items-center gap-3 text-ink-muted">
                <span className="h-px w-10 bg-current" />
                The Truckify operating principle
              </footer>
            </blockquote>
          </div>
        </div>
      </figure>

      {compact ? (
        <div className="shell mt-10 flex justify-end">
          <ButtonLink href="/about" variant="glass">
            Our operating principles
          </ButtonLink>
        </div>
      ) : (
      /* Principles in a Swiss ledger. */
      <div className="shell mt-20">
        <ol className="border-t border-line">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.numeral} delay={i * 0.04} className="group border-b border-line">
              <div className="grid grid-cols-12 gap-x-6 gap-y-3 py-8 transition-[padding] duration-700 ease-out-expo md:py-10 md:group-hover:pl-4">
                <span
                  aria-hidden
                  className="col-span-3 font-serif text-[clamp(2.4rem,4vw,3.6rem)] leading-none font-light text-ink-faint transition-colors duration-500 group-hover:text-accent-text md:col-span-2"
                >
                  {p.numeral}
                </span>
                <h3 className="col-span-9 text-[clamp(1.4rem,2.3vw,2.2rem)] leading-[1.05] font-semibold tracking-[-0.04em] md:col-span-4">
                  {p.title}
                </h3>
                <p className="col-span-12 max-w-xl text-ink-muted md:col-span-5 md:col-start-8 md:pt-2">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
      )}
    </section>
  )
}
