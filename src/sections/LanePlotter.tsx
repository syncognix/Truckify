import { m, useReducedMotion } from 'motion/react'
import { ArrowLeftRight } from 'lucide-react'
import { useId, useMemo, useRef, useState } from 'react'
import { ButtonLink } from '../components/Button'
import { SectionHeader } from '../components/SectionHeader'
import { HUBS, MAP_DOTS, MAP_HEIGHT, MAP_WIDTH } from '../data/map.generated'
import type { Hub } from '../data/types'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { setPlottedLane } from '../lib/lane-store'

const EASE = [0.16, 1, 0.3, 1] as const
const R_MILES = 3958.8

const hubByCode = (code: string) => HUBS.find((h) => h.code === code) ?? HUBS[0]

/** Great-circle (haversine) distance in miles and initial compass bearing. */
function geodesic(a: Hub, b: Hub) {
  const rad = Math.PI / 180
  const φ1 = a.lat * rad
  const φ2 = b.lat * rad
  const dφ = (b.lat - a.lat) * rad
  const dλ = (b.lon - a.lon) * rad
  const h = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2
  const miles = 2 * R_MILES * Math.asin(Math.sqrt(h))
  const y = Math.sin(dλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(dλ)
  const bearing = ((Math.atan2(y, x) / rad + 360) % 360)
  return { miles, bearing }
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
const compass = (deg: number) => COMPASS[Math.round(deg / 45) % 8]

const fmtCoord = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`

/** A gentle arc between two projected points, bowed to the left of travel. */
function arcPath(a: Hub, b: Hub) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const k = 0.22
  return `M${a.x} ${a.y} Q${mx + dy * k} ${my - dx * k} ${b.x} ${b.y}`
}

export function LanePlotter({ index = '01' }: { index?: string }) {
  const root = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [origin, setOrigin] = useState('DAL')
  const [dest, setDest] = useState('ATL')
  const [pickNext, setPickNext] = useState<'origin' | 'dest'>('origin')
  const ids = { o: useId(), d: useId() }

  const a = hubByCode(origin)
  const b = hubByCode(dest)
  const { miles, bearing } = useMemo(() => geodesic(a, b), [a, b])
  const path = arcPath(a, b)
  const laneLabel = `${a.name} → ${b.name}`

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionAny, () => {
        gsap.fromTo(
          '[data-map-dots]',
          { clipPath: 'circle(0% at 50% 55%)' },
          {
            clipPath: 'circle(75% at 50% 55%)',
            ease: 'none',
            scrollTrigger: { trigger: '[data-map]', start: 'top 85%', end: 'top 25%', scrub: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const pickHub = (code: string) => {
    if (pickNext === 'origin') {
      if (code === dest) setDest(origin)
      setOrigin(code)
      setPickNext('dest')
    } else {
      if (code === origin) return
      setDest(code)
      setPickNext('origin')
    }
  }

  const swap = () => {
    setOrigin(dest)
    setDest(origin)
  }

  return (
    <section id="lanes" ref={root} aria-labelledby="lanes-title" className="shell py-28 sm:py-36">
      <SectionHeader
        index={index}
        eyebrow="Lane plotter"
        id="lanes-title"
        title={
          <>
            Plot the lanes <span className="font-serif font-light italic">you</span> want to run.
          </>
        }
        aside={<p className="text-[0.95rem]">Pick two hubs or tap the map. Bring the lane to your consult.</p>}
      />

      <div className="mt-14 grid grid-cols-12 gap-3">
        {/* Map */}
        <div
          data-map
          className="relative col-span-12 overflow-hidden rounded-panel border border-line bg-bg-elev lg:col-span-8"
        >
          <div className="label absolute top-5 left-5 z-10 flex items-center gap-2 text-ink-faint">
            <span className="size-1.5 rounded-full bg-accent" />
            Contiguous U.S. · Albers projection
          </div>
          <div className="label absolute top-5 right-5 z-10 hidden text-ink-faint sm:block">
            Tap to set {pickNext === 'origin' ? 'origin' : 'destination'}
          </div>

          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            className="relative block h-auto w-full"
            role="img"
            aria-label={`Map of the contiguous United States showing a lane from ${laneLabel}`}
          >
            <g data-map-dots>
              <path d={MAP_DOTS} stroke="var(--c-dot)" strokeWidth="4.2" strokeLinecap="round" />
            </g>

            {/* Faint spokes from every hub to the origin, for a network feel. */}
            {HUBS.filter((h) => h.code !== a.code).map((h) => (
              <path key={h.code} d={arcPath(a, h)} fill="none" stroke="var(--c-line)" strokeWidth="1" />
            ))}

            <m.path
              key={path}
              d={path}
              fill="none"
              stroke="var(--c-accent)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: EASE }}
            />
            <path
              d={path}
              fill="none"
              stroke="var(--c-accent)"
              strokeWidth="10"
              strokeOpacity="0.12"
              strokeLinecap="round"
            />
            {!reduce && (
              <circle key={`truck-${path}`} r="6" fill="var(--c-accent)" stroke="var(--c-bg)" strokeWidth="2">
                <animateMotion dur="4.5s" begin="1.2s" repeatCount="indefinite" path={path} />
              </circle>
            )}

            {HUBS.map((h) => {
              const isO = h.code === a.code
              const isD = h.code === b.code
              const on = isO || isD
              return (
                <g key={h.code} className="cursor-pointer" onClick={() => pickHub(h.code)}>
                  <circle cx={h.x} cy={h.y} r="18" fill="transparent" />
                  {on && <circle cx={h.x} cy={h.y} r="14" fill="none" stroke="var(--c-accent)" strokeOpacity="0.5" />}
                  <rect
                    x={h.x - 5}
                    y={h.y - 5}
                    width="10"
                    height="10"
                    fill={on ? 'var(--c-accent)' : 'var(--c-bg)'}
                    stroke={on ? 'var(--c-accent)' : 'var(--c-ink-muted)'}
                    strokeWidth="1.5"
                    className="transition-[fill] duration-300"
                  />
                  <text
                    x={h.x + 12}
                    y={h.y + 4}
                    className={`font-mono text-[13px] tracking-wider ${on ? 'fill-ink' : 'fill-ink-faint'}`}
                  >
                    {h.code}
                    {isO ? ' · O' : isD ? ' · D' : ''}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Readout */}
        <div className="col-span-12 flex flex-col rounded-panel border border-line bg-card p-6 lg:col-span-4">
          <div className="label flex items-center justify-between text-ink-faint">
            <span>Lane readout</span>
            <span>LN-{a.code}-{b.code}</span>
          </div>

          <div className="mt-6 grid grid-cols-1 items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <HubSelect id={ids.o} label="Origin" value={origin} exclude={dest} onChange={setOrigin} />
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="grid size-11 place-items-center justify-self-center rounded-full border border-line transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink sm:mb-1 sm:size-10"
            >
              <ArrowLeftRight className="size-4 rotate-90 sm:rotate-0" />
            </button>
            <HubSelect id={ids.d} label="Destination" value={dest} exclude={origin} onChange={setDest} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
            <Stat term="Straight-line" value={`${Math.round(miles).toLocaleString()} mi`} />
            <Stat term="Heading" value={`${Math.round(bearing)}° ${compass(bearing)}`} />
            <Stat term="Origin" value={fmtCoord(a.lat, a.lon)} small />
            <Stat term="Destination" value={fmtCoord(b.lat, b.lon)} small />
          </dl>
          <p className="mt-3 text-[0.78rem] text-ink-faint">
            Great-circle distance between city centres. Road miles are longer and vary by route.
          </p>

          <div className="mt-auto pt-8">
            <ButtonLink href="/contact" onClick={() => setPlottedLane(laneLabel)} className="w-full justify-between">
              Discuss this lane
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function HubSelect({
  id,
  label,
  value,
  exclude,
  onChange,
}: {
  id: string
  label: string
  value: string
  exclude: string
  onChange: (code: string) => void
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="label mb-2 block text-ink-faint">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none truncate rounded-xl border border-line bg-bg px-3 py-2.5 text-[1.05rem] font-semibold tracking-[-0.02em] text-ink transition-colors hover:border-line-strong"
      >
        {HUBS.map((h) => (
          <option key={h.code} value={h.code} disabled={h.code === exclude}>
            {h.code} — {h.name}
          </option>
        ))}
      </select>
    </div>
  )
}

function Stat({ term, value, small = false }: { term: string; value: string; small?: boolean }) {
  return (
    <div className="bg-bg-elev p-4">
      <dt className="label text-ink-faint">{term}</dt>
      <dd className={`mt-2 font-semibold tracking-[-0.03em] tabular-nums ${small ? 'font-mono text-[0.78rem] font-normal tracking-normal text-ink-muted' : 'text-[1.5rem]'}`}>
        {value}
      </dd>
    </div>
  )
}
