import { useEffect, useRef, useState } from 'react'
import { Picture } from '../components/Picture'
import { GALLERY } from '../data/content'
import type { GalleryTile } from '../data/types'
import { gsap, MQ, useGSAP } from '../lib/gsap'
import { useMediaQuery } from '../lib/use-media-query'

/**
 * Mixed-media field notes. Desktop: the section pins and vertical scroll
 * drives the track sideways. Touch / small screens / reduced motion: a native
 * horizontal scroller with snap points, contained so the page never overflows.
 */
export function Gallery({ index = '05' }: { index?: string }) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const scrubbed = useMediaQuery(MQ.motionDesktop)

  useGSAP(
    () => {
      if (!scrubbed || !track.current) return
      const el = track.current
      const distance = () => el.scrollWidth - window.innerWidth
      const travel = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      // Each photo eases from a slight push-in to rest as it crosses the frame.
      gsap.utils.toArray<HTMLElement>('[data-tile-photo]', el).forEach((img) => {
        gsap.fromTo(img, { scale: 1.18 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: img,
            containerAnimation: travel,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        })
      })
    },
    { scope: root, dependencies: [scrubbed], revertOnUpdate: true },
  )

  return (
    <section ref={root} aria-labelledby="gallery-title" className="relative overflow-hidden bg-bg-sunk">
      <div className={`flex flex-col ${scrubbed ? 'h-screen justify-center' : 'py-24'}`}>
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
          <p className="label hidden text-ink-faint md:block">{scrubbed ? 'Scroll to travel →' : 'Swipe →'}</p>
        </div>

        <div
          className={
            scrubbed
              ? ''
              : 'snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
          }
          tabIndex={scrubbed ? undefined : 0}
          aria-label={scrubbed ? undefined : 'Gallery, scroll horizontally'}
          role={scrubbed ? undefined : 'region'}
        >
          <div
            ref={track}
            className="flex w-max items-center gap-4 px-[clamp(1.25rem,4vw,3.5rem)] will-change-transform"
          >
            {GALLERY.map((tile, i) => (
              <Tile key={i} tile={tile} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
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
            data-tile-photo
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
