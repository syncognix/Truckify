import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Picture } from '../components/Picture'
import { GALLERY } from '../data/content'
import type { GalleryTile } from '../data/types'
import { useMediaQuery } from '../lib/use-media-query'

/**
 * Mixed-media field notes in a native horizontal scroller: a visible signal
 * scrollbar underneath, prev/next buttons, mouse drag, trackpad and touch
 * swipe. Deliberately not scroll-jacked so it behaves the same everywhere.
 */
export function Gallery({ index = '05' }: { index?: string }) {
  const scroller = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const [progress, setProgress] = useState(0)
  const [ratio, setRatio] = useState(0.3)
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')

  const measure = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2 })
    setProgress(max > 0 ? el.scrollLeft / max : 0)
    setRatio(el.scrollWidth > 0 ? Math.min(1, el.clientWidth / el.scrollWidth) : 1)
  }, [])

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    measure()
    el.addEventListener('scroll', measure, { passive: true })
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', measure)
      ro.disconnect()
    }
  }, [measure])

  const railControls: RailControls = {
    metrics: () => {
      const el = scroller.current
      return { left: el?.scrollLeft ?? 0, max: el ? el.scrollWidth - el.clientWidth : 0 }
    },
    setLeft: (px, smooth = false) =>
      scroller.current?.scrollTo({ left: px, behavior: smooth && !reduce ? 'smooth' : 'auto' }),
    setDragging: (dragging) => {
      if (scroller.current) scroller.current.dataset.dragging = String(dragging)
    },
  }

  const step = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: reduce ? 'auto' : 'smooth' })
  }

  // Click-and-drag for mouse users (touch and trackpads scroll natively).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !scroller.current) return
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = scroller.current
    if (!d || !el) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true
      el.setPointerCapture(e.pointerId)
      el.dataset.dragging = 'true'
    }
    if (d.moved) el.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    drag.current = null
    if (scroller.current) scroller.current.dataset.dragging = 'false'
  }

  return (
    <section aria-labelledby="gallery-title" className="relative overflow-hidden bg-bg-sunk py-24 sm:py-32">
      <div className="shell mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="label mb-4 flex items-center gap-3 text-ink-muted">
            <span className="text-accent-text">{index}</span>
            <span className="h-px w-8 bg-line-strong" />
            Field notes
          </p>
          <h2 id="gallery-title" className="text-title font-semibold tracking-[-0.045em]">
            Life on the <span className="font-serif font-light italic">long haul.</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="label mr-3 hidden text-ink-faint tabular-nums md:inline">
            {String(Math.round(progress * 100)).padStart(3, '0')}% · Drag or scroll →
          </span>
          <GalleryButton label="Previous photos" disabled={edge.start} onClick={() => step(-1)}>
            <ArrowLeft className="size-4" />
          </GalleryButton>
          <GalleryButton label="Next photos" disabled={edge.end} onClick={() => step(1)}>
            <ArrowRight className="size-4" />
          </GalleryButton>
        </div>
      </div>

      <div
        ref={scroller}
        role="region"
        aria-label="Field notes gallery, scroll horizontally"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="gallery-scroller snap-x snap-proximity overflow-x-auto overscroll-x-contain data-[dragging=true]:cursor-grabbing data-[dragging=true]:snap-none data-[dragging=true]:select-none"
      >
        <div className="flex w-max items-center gap-4 px-[clamp(1.25rem,4vw,3.5rem)]">
          {GALLERY.map((tile, i) => (
            <Tile key={i} tile={tile} index={i} />
          ))}
        </div>
      </div>

      <div className="shell mt-8">
        <ScrollRail controls={railControls} progress={progress} ratio={ratio} />
      </div>
    </section>
  )
}

interface RailControls {
  /** Current scroll offset and maximum, in px. */
  metrics: () => { left: number; max: number }
  setLeft: (px: number, smooth?: boolean) => void
  setDragging: (dragging: boolean) => void
}

/**
 * Always-visible scrollbar for the gallery (native ones hide on macOS and many
 * trackpads). Drag the thumb, or click the rail to jump; mirrors scrollLeft.
 */
function ScrollRail({ controls, progress, ratio }: { controls: RailControls; progress: number; ratio: number }) {
  const rail = useRef<HTMLDivElement>(null)
  const grab = useRef<{ x: number; left: number } | null>(null)
  const usableWidth = () => (rail.current?.getBoundingClientRect().width ?? 1) * (1 - ratio) || 1

  const jump = (clientX: number) => {
    const r = rail.current?.getBoundingClientRect()
    if (!r) return
    const p = Math.min(1, Math.max(0, (clientX - r.left - (r.width * ratio) / 2) / usableWidth()))
    controls.setLeft(p * controls.metrics().max, true)
  }

  const onThumbDown = (e: PointerEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    grab.current = { x: e.clientX, left: controls.metrics().left }
    controls.setDragging(true)
  }
  const onThumbMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = grab.current
    if (!g) return
    controls.setLeft(g.left + ((e.clientX - g.x) * controls.metrics().max) / usableWidth())
  }
  const onThumbUp = () => {
    grab.current = null
    controls.setDragging(false)
  }

  return (
    <div
      ref={rail}
      aria-hidden
      onPointerDown={(e) => jump(e.clientX)}
      className="group relative h-6 cursor-pointer touch-none"
    >
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line-strong" />
      <div
        onPointerDown={onThumbDown}
        onPointerMove={onThumbMove}
        onPointerUp={onThumbUp}
        onPointerCancel={onThumbUp}
        style={{ width: `${ratio * 100}%`, left: `${progress * (1 - ratio) * 100}%` }}
        className="absolute top-1/2 h-1.5 -translate-y-1/2 cursor-grab rounded-full bg-accent shadow-[0_0_18px_color-mix(in_oklab,var(--c-accent)_55%,transparent)] transition-[height] duration-300 group-hover:h-2.5 active:cursor-grabbing"
      />
    </div>
  )
}

function GalleryButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-line-strong text-ink transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

const TILE_H = 'h-[min(62vh,560px)] max-lg:h-[440px] max-sm:h-[380px]'

function Tile({ tile, index }: { tile: GalleryTile; index: number }) {
  const fig = `FIG.${String(index + 1).padStart(2, '0')}`
  switch (tile.kind) {
    case 'photo': {
      const w = tile.shape === 'wide' ? 'aspect-[3/2]' : tile.shape === 'tall' ? 'aspect-[2/3]' : 'aspect-square'
      return (
        <figure className={`group relative shrink-0 snap-center overflow-hidden rounded-panel ${TILE_H} ${w}`}>
          <Picture
            draggable={false}
            photo={tile.photo}
            sizes="(min-width: 1024px) 50vw, 85vw"
            className="photo h-full w-full object-cover group-hover:[filter:none]"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,rgb(0_0_0/0.55),transparent_45%)]" />
          <figcaption className="label absolute right-5 bottom-5 left-5 flex justify-between text-[#ede8dd]">
            <span>{tile.caption}</span>
            <span className="opacity-60">{fig}</span>
          </figcaption>
        </figure>
      )
    }
    case 'type':
      return (
        <div className={`flex w-[min(80vw,26rem)] shrink-0 snap-center flex-col justify-between rounded-panel bg-accent p-8 text-accent-ink ${TILE_H}`}>
          <span className="label flex justify-between">
            <span>{tile.eyebrow}</span>
            <span className="opacity-60">{fig}</span>
          </span>
          <p className="font-serif text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.05] font-light tracking-[-0.03em]">
            {tile.text}
          </p>
          <span className="label opacity-70">FMCSA 11-hour driving limit</span>
        </div>
      )
    case 'terminal':
      return <TerminalTile fig={fig} />
    case 'route':
      return (
        <div className={`relative w-[min(80vw,24rem)] shrink-0 snap-center overflow-hidden rounded-panel border border-line bg-bg ${TILE_H}`}>
          <div aria-hidden className="dot-field absolute inset-0" />
          <svg viewBox="0 0 240 360" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M30 330 C 60 250, 190 260, 170 180 S 60 110, 210 30" fill="none" stroke="var(--c-line-strong)" strokeWidth="14" strokeLinecap="round" />
            <path d="M30 330 C 60 250, 190 260, 170 180 S 60 110, 210 30" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeDasharray="6 10" className="animate-dash" />
            <rect x="24" y="324" width="12" height="12" fill="var(--c-accent)" />
            <circle cx="210" cy="30" r="7" fill="none" stroke="var(--c-ink)" strokeWidth="2" />
          </svg>
          <span className="label absolute top-6 left-6 text-ink-muted">Lane study</span>
          <span className="label absolute right-6 bottom-6 text-ink-faint">{fig}</span>
        </div>
      )
  }
}

const LOG = [
  '> desk.open --carrier owner-op',
  '  preferences loaded: lanes, floor rate, home time',
  '> board.scan --equipment dry_van',
  '  matches found · ranked by fit',
  '> broker.call --negotiate',
  '  counter sent · awaiting confirm',
  '> ratecon.sign && driver.notify',
  '  ✓ booked — paperwork filed',
]

/** Typed-out dispatch log (sample). Starts when visible, runs once. */
function TerminalTile({ fig }: { fig: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [lines, setLines] = useState(reduce ? LOG.length : 0)

  useEffect(() => {
    if (reduce || !ref.current) return
    let id = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      id = window.setInterval(() => {
        setLines((n) => {
          if (n >= LOG.length) window.clearInterval(id)
          return Math.min(LOG.length, n + 1)
        })
      }, 420)
    })
    io.observe(ref.current)
    return () => {
      io.disconnect()
      window.clearInterval(id)
    }
  }, [reduce])

  return (
    <div
      ref={ref}
      className={`flex w-[min(85vw,30rem)] shrink-0 snap-center flex-col overflow-hidden rounded-panel border border-line bg-[#0c0c0b] text-[#ede8dd] ${TILE_H}`}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-white/15" />
        <span className="size-2.5 rounded-full bg-[#d4ff3f]" />
        <span className="label ml-auto text-white/40">dispatch.log · sample · {fig}</span>
      </div>
      <pre className="flex-1 overflow-hidden p-5 font-mono text-[0.78rem] leading-[1.9] whitespace-pre-wrap">
        {LOG.slice(0, lines).map((l) => (
          <span key={l} className={`block ${l.startsWith('>') ? 'text-[#d4ff3f]' : 'text-white/55'}`}>
            {l}
          </span>
        ))}
        <span className="inline-block h-4 w-2 translate-y-0.5 bg-[#d4ff3f] animate-caret" />
      </pre>
    </div>
  )
}
