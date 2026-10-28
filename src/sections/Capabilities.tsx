import { Asterisk } from 'lucide-react'
import { CAPABILITIES, EQUIPMENT } from '../data/content'
import { TbcTag } from '../components/Tbc'

/**
 * Credibility strip. No client logos or performance numbers exist yet, so this
 * states only what the service covers — swap in verified credentials (e.g.
 * years in business, FMCSA-registered entities) once the business supplies them.
 */
export function Capabilities() {
  const items = [...CAPABILITIES, ...CAPABILITIES]
  return (
    <section aria-label="What we handle" className="relative border-y border-line bg-bg-elev/60">
      <div className="flex items-stretch">
        <div className="label relative z-10 hidden shrink-0 items-center gap-3 border-r border-line bg-bg-elev px-6 text-ink-muted sm:flex">
          <span className="size-1.5 rounded-full bg-accent" />
          On the desk
        </div>
        <div className="group relative flex-1 overflow-hidden py-5 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
          <ul className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
            {items.map((item, i) => (
              <li
                key={`${item}-${i}`}
                aria-hidden={i >= CAPABILITIES.length}
                className="flex items-center gap-8 pr-8 text-[clamp(1.1rem,2vw,1.6rem)] font-medium tracking-[-0.03em] whitespace-nowrap"
              >
                {i % 3 === 1 ? <span className="font-serif font-light italic">{item}</span> : item}
                <Asterisk className="size-4 text-accent-text" aria-hidden />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="shell flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line py-3">
        <span className="label text-ink-faint">Equipment</span>
        <ul className="label flex flex-wrap gap-x-5 gap-y-1 text-ink-muted">
          {EQUIPMENT.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <TbcTag label="Confirm list" />
      </div>
    </section>
  )
}
