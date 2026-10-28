import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { TESTIMONIALS } from '../data/content'

/**
 * Renders only verified testimonials. With none on file the section is
 * omitted in production; development builds show a reminder instead.
 */
export function Testimonials() {
  if (TESTIMONIALS.length === 0) {
    if (!import.meta.env.DEV) return null
    return (
      <section aria-label="Testimonials placeholder" className="shell py-16">
        <div className="label rounded-panel border border-dashed border-accent-text/50 p-8 text-center text-ink-muted">
          Dev only · Testimonials hidden until verified client quotes are added to <code>TESTIMONIALS</code> in
          src/data/content.ts
        </div>
      </section>
    )
  }

  return (
    <section aria-labelledby="voices-title" className="shell py-28 sm:py-36">
      <SectionHeader index="—" eyebrow="Carrier voices" id="voices-title" title="In their words." />
      <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <figure className="flex h-full flex-col justify-between rounded-panel border border-line bg-card p-8">
              <blockquote className="font-serif text-[1.5rem] leading-snug font-light">“{t.quote}”</blockquote>
              <figcaption className="label mt-8 text-ink-muted">
                {t.name} · {t.role}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
