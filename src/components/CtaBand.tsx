import { SITE } from '../data/site'
import { ButtonLink } from './Button'
import { SplitWords } from './Reveal'
import { FactText } from './Tbc'

/** Closing call to action shared by every page except Contact. */
export function CtaBand({ title = 'Let’s fill', accent = 'your board.' }: { title?: string; accent?: string }) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line py-28 sm:py-36">
      <div
        aria-hidden
        className="hairline-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(60%_70%_at_50%_50%,black,transparent)]"
      />
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[min(70vw,46rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--c-accent)_16%,transparent),transparent_65%)]"
      />
      <div className="shell relative flex flex-col items-center text-center">
        <p className="label mb-8 flex items-center gap-3 text-ink-muted">
          <span className="size-1.5 rounded-full bg-accent animate-pulse-dot" />
          Desk open
          <span className="text-ink-faint">
            · <FactText fact={SITE.hours} />
          </span>
        </p>
        <h2 id="cta-title" className="text-mega font-semibold tracking-[-0.055em]">
          <SplitWords text={title} className="block" />
          <span className="block font-serif font-light italic tracking-[-0.03em]">
            <SplitWords text={accent} delay={0.15} />
          </span>
        </h2>
        <p className="mt-8 max-w-md text-lede text-ink-muted">
          A short, no-obligation intro call. Tell us how you run, and we’ll tell you honestly if we’re a fit.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contact">Book a dispatch consult</ButtonLink>
          <ButtonLink href="/faq" variant="glass">
            Read the FAQ
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
