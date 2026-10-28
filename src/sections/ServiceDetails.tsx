import { Check } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { SERVICES } from '../data/content'

/** Editorial ledger: one row per service with what it actually includes. Anchor targets for the nav. */
export function ServiceDetails({ index = '02' }: { index?: string }) {
  return (
    <section aria-labelledby="service-details-title" className="shell py-28 sm:py-36">
      <SectionHeader
        index={index}
        eyebrow="In detail"
        id="service-details-title"
        title={
          <>
            What each service <span className="font-serif font-light italic">covers.</span>
          </>
        }
      />
      <ol className="mt-16 border-t border-line">
        {SERVICES.map((s) => (
          <li key={s.id} id={s.id} className="border-b border-line">
            <Reveal className="grid grid-cols-12 gap-x-6 gap-y-6 py-12 md:py-16">
              <div className="col-span-12 flex items-start gap-5 md:col-span-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line text-accent-text">
                  <s.icon className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="label text-ink-faint">{s.code}</p>
                  <h3 className="mt-2 text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
                    {s.title}
                  </h3>
                  <p className="mt-4 font-serif text-[1.2rem] leading-snug font-light italic text-ink-muted">{s.value}</p>
                </div>
              </div>
              <p className="col-span-12 text-ink-muted md:col-span-3 md:col-start-6">{s.summary}</p>
              <ul className="col-span-12 grid gap-3 md:col-span-4">
                {s.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.95rem]">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-accent-ink">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  )
}
