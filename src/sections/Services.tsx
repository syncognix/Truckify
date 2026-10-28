import { m } from 'motion/react'
import { FileCheck2, FileText, Receipt } from 'lucide-react'
import type { PointerEvent } from 'react'
import { ButtonLink } from '../components/Button'
import { Picture } from '../components/Picture'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { PHOTOS, SERVICES } from '../data/content'
import type { Service, ServiceVisual } from '../data/types'

/** Bento placement per card: deliberately uneven weights on a 12-col grid. */
const LAYOUT: Record<ServiceVisual, string> = {
  board: 'md:col-span-6 lg:col-span-7 lg:row-span-2',
  negotiate: 'md:col-span-6 lg:col-span-5',
  route: 'md:col-span-6 lg:col-span-5',
  comms: 'md:col-span-6 lg:col-span-4',
  docs: 'md:col-span-6 lg:col-span-4',
  support: 'md:col-span-12 lg:col-span-4',
}

export function Services({ index = '01', moreLink = false }: { index?: string; moreLink?: boolean }) {
  return (
    <section id="services" aria-labelledby="services-title" className="shell py-28 sm:py-36">
      <SectionHeader
        index={index}
        eyebrow="Services"
        id="services-title"
        title={
          <>
            Everything between <span className="font-serif font-light italic">the load board</span> and the
            loading dock.
          </>
        }
        aside={<p className="text-[0.95rem]">Six disciplines, one dispatch desk working for your truck.</p>}
      />

      <div className="mt-16 grid grid-cols-1 gap-3 md:grid-cols-12 lg:auto-rows-[minmax(17rem,auto)]">
        {SERVICES.map((service, i) => (
          <Reveal key={service.id} delay={(i % 3) * 0.08} className={LAYOUT[service.visual]}>
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
      {moreLink && (
        <div className="mt-10 flex justify-end">
          <ButtonLink href="/services" variant="glass">
            Explore every service
          </ButtonLink>
        </div>
      )}
    </section>
  )
}

function trackPointer(event: PointerEvent<HTMLElement>) {
  const r = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty('--mx', `${event.clientX - r.left}px`)
  event.currentTarget.style.setProperty('--my', `${event.clientY - r.top}px`)
}

function ServiceCard({ service }: { service: Service }) {
  const isFeature = service.visual === 'board'
  const isPhoto = service.visual === 'support'
  return (
    <article
      onPointerMove={trackPointer}
      className={`spotlight group relative flex h-full min-h-[17rem] flex-col overflow-hidden rounded-panel border border-line transition-[border-color,background-color,transform] duration-700 ease-out-expo hover:-translate-y-1 hover:border-line-strong ${
        isPhoto ? 'bg-bg-sunk' : 'bg-card hover:bg-card-hover'
      }`}
    >
      {isPhoto && (
        <>
          <Picture
            photo={PHOTOS.cab}
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="photo absolute inset-0 h-full w-full object-cover opacity-70 group-hover:scale-105 group-hover:opacity-85"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,var(--c-bg)_15%,transparent_85%)]" />
        </>
      )}

      <div className="relative flex items-start justify-between p-6">
        <span className="grid size-11 place-items-center rounded-2xl border border-line bg-bg/40 text-ink transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
          <service.icon className="size-[1.15rem]" strokeWidth={1.6} />
        </span>
        <span className="label text-ink-faint">{service.code}</span>
      </div>

      {!isPhoto && (
        <div className={`relative flex-1 px-6 ${isFeature ? 'flex flex-col justify-center py-4' : ''}`} aria-hidden>
          <Visual kind={service.visual} />
        </div>
      )}
      {isPhoto && <div className="flex-1" />}

      <div className="relative p-6 pt-4">
        <h3 className={`${isFeature ? 'text-[clamp(1.9rem,3vw,2.8rem)]' : 'text-[1.55rem]'} leading-[1.02] font-semibold tracking-[-0.04em]`}>
          {service.title}
        </h3>
        <p className={`mt-3 text-ink-muted ${isFeature ? 'max-w-md text-[1.02rem]' : 'text-[0.94rem]'} leading-relaxed`}>
          {service.summary}
        </p>
        <p className="label mt-5 flex items-center gap-2 text-accent-text">
          <span className="h-px w-5 bg-current" />
          {service.value}
        </p>
      </div>
    </article>
  )
}

function Visual({ kind }: { kind: ServiceVisual }) {
  switch (kind) {
    case 'board':
      return <BoardVisual />
    case 'negotiate':
      return <NegotiateVisual />
    case 'route':
      return <RouteVisual />
    case 'comms':
      return <CommsVisual />
    case 'docs':
      return <DocsVisual />
    default:
      return null
  }
}

const BOARD_ROWS = [
  ['DAL', 'ATL', 'Dry van', '12:00'],
  ['MEM', 'CHI', 'Reefer', '14:30'],
  ['PHX', 'LAX', 'Flatbed', '09:15'],
  ['KC', 'DEN', 'Dry van', '17:45'],
  ['HOU', 'JAX', 'Step deck', '07:00'],
]

/** Mock load board: rows scan past, one lights up as the match. Sample data only. */
function BoardVisual() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg/50 font-mono text-[0.72rem]">
      <div className="label flex justify-between border-b border-line px-4 py-2.5 text-ink-faint">
        <span>Board · sample</span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-accent animate-pulse-dot" /> scanning
        </span>
      </div>
      <ul>
        {BOARD_ROWS.map(([o, d, eq, t], i) => (
          <m.li
            key={o + d}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.09, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={`grid grid-cols-[1fr_1fr_1.4fr_auto] gap-2 border-b border-line px-4 py-2.5 last:border-0 ${
              i === 1 ? 'bg-accent text-accent-ink' : 'text-ink-muted'
            }`}
          >
            <span>{o}</span>
            <span>→ {d}</span>
            <span>{eq}</span>
            <span className="tabular-nums">{t}</span>
          </m.li>
        ))}
      </ul>
      <div className="label grid grid-cols-3 border-t border-line text-ink-faint">
        {['Filter · your lanes', 'Floor · your rate', 'Approve · your call'].map((t) => (
          <span key={t} className="border-r border-line px-4 py-3 last:border-0">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/** Offer and counter converging on an agreed line. */
function NegotiateVisual() {
  return (
    <svg viewBox="0 0 320 90" className="h-24 w-full">
      <line x1="0" x2="320" y1="45" y2="45" stroke="var(--c-line-strong)" strokeDasharray="3 5" />
      <m.path
        d="M0 12 C 80 14, 150 30, 230 43 L 320 45"
        fill="none"
        stroke="var(--c-ink-faint)"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      <m.path
        d="M0 80 C 80 78, 150 60, 230 47 L 320 45"
        fill="none"
        stroke="var(--c-accent)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.15 }}
      />
      <circle cx="232" cy="45" r="4" fill="var(--c-accent)" />
      <text x="0" y="8" className="fill-ink-faint font-mono text-[9px] uppercase">Offer</text>
      <text x="0" y="90" className="fill-ink-faint font-mono text-[9px] uppercase">Ask</text>
      <text x="320" y="36" textAnchor="end" className="fill-ink-muted font-mono text-[9px] uppercase">Agreed</text>
    </svg>
  )
}

function RouteVisual() {
  return (
    <svg viewBox="0 0 320 90" className="h-24 w-full">
      <m.path
        d="M10 70 L 90 70 Q 110 70 120 52 L 150 26 Q 160 18 176 18 L 230 18 Q 250 18 260 34 L 300 70"
        fill="none"
        stroke="var(--c-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
      />
      {[
        [10, 70, 'PU'],
        [176, 18, 'DEL'],
        [300, 70, 'RELOAD'],
      ].map(([x, y, l]) => (
        <g key={l as string}>
          <rect x={(x as number) - 4} y={(y as number) - 4} width="8" height="8" fill="var(--c-bg)" stroke="var(--c-ink)" strokeWidth="1.5" />
          <text x={x as number} y={(y as number) + 20} textAnchor="middle" className="fill-ink-faint font-mono text-[9px]">
            {l}
          </text>
        </g>
      ))}
    </svg>
  )
}

function CommsVisual() {
  const lines = [
    { who: 'Broker', text: 'Pickup window confirmed 08:00–10:00.', mine: false },
    { who: 'Desk', text: 'Driver notified. Rate con signed.', mine: true },
  ]
  return (
    <div className="flex flex-col gap-2 text-[0.8rem]">
      {lines.map((l, i) => (
        <m.div
          key={l.text}
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
            l.mine ? 'self-end rounded-br-sm bg-ink text-bg' : 'self-start rounded-bl-sm border border-line bg-bg/50 text-ink-muted'
          }`}
        >
          <span className="label mb-1 block text-[0.55rem] opacity-60">{l.who} · sample</span>
          {l.text}
        </m.div>
      ))}
    </div>
  )
}

function DocsVisual() {
  const docs = [
    { icon: FileText, label: 'Rate con' },
    { icon: Receipt, label: 'BOL' },
    { icon: FileCheck2, label: 'POD' },
  ]
  return (
    <div className="flex h-24 items-center justify-center">
      {docs.map((d, i) => (
        <div
          key={d.label}
          style={{ ['--r' as string]: `${(i - 1) * 9}deg` }}
          className="-mx-2 flex h-24 w-[4.6rem] [transform:rotate(var(--r))] flex-col justify-between rounded-lg border border-line bg-bg-elev p-2.5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.4)] transition-transform duration-700 ease-out-expo group-hover:[transform:rotate(calc(var(--r)*1.6))_translateY(-6px)]"
        >
          <d.icon className={`size-4 ${i === 2 ? 'text-accent-text' : 'text-ink-muted'}`} strokeWidth={1.6} />
          <span className="space-y-1">
            <span className="block h-px w-full bg-line-strong" />
            <span className="block h-px w-2/3 bg-line-strong" />
          </span>
          <span className="label text-[0.55rem] text-ink-muted">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
