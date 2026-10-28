import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useSmoothScroll } from '../lib/smooth-scroll'

const SEEN_KEY = 'truckify-intro-seen'
const DURATION_MS = 3000
const LEAVE_MS = 450

function shouldShow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try {
    return sessionStorage.getItem(SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

/**
 * Once-per-session intro: the wordmark assembles as particles that then
 * scatter like road dust (some catching the signal colour), with a timeline
 * bar and a skip control. Skipped for reduced motion; Esc dismisses. The page
 * underneath is inert and scroll-locked while it shows.
 */
export function SplashScreen({ children }: { children: ReactNode }) {
  const [showing, setShowing] = useState(shouldShow)
  const [leaving, setLeaving] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { setLocked } = useSmoothScroll()

  const dismiss = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* storage unavailable — the intro may show again next visit */
    }
    setLeaving(true)
  }, [])

  useEffect(() => {
    if (!showing) return
    setLocked(true)
    const timer = window.setTimeout(dismiss, DURATION_MS)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss()
    document.addEventListener('keydown', onKey)
    return () => {
      setLocked(false)
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
    }
  }, [showing, dismiss, setLocked])

  useEffect(() => {
    if (!leaving) return
    const timer = window.setTimeout(() => setShowing(false), LEAVE_MS)
    return () => window.clearTimeout(timer)
  }, [leaving])

  // Particle wordmark.
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!showing || !canvas || !ctx) return
    let frame = 0
    let cancelled = false
    const start = performance.now()

    document.fonts.ready.then(() => {
      if (cancelled) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const styles = getComputedStyle(document.documentElement)
      const ink = styles.getPropertyValue('--c-ink').trim() || '#ede8dd'
      const signal = styles.getPropertyValue('--c-accent').trim() || '#d4ff3f'

      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const o = off.getContext('2d')
      if (!o) return
      o.font = `700 ${Math.min(w / 5.2, 150)}px "Geist Variable", system-ui, sans-serif`
      o.textAlign = 'center'
      o.textBaseline = 'middle'
      o.fillStyle = '#fff'
      o.fillText('Truckify', w / 2, h / 2)
      const data = o.getImageData(0, 0, w, h).data
      const step = w < 500 ? 2 : 3
      const particles: { x: number; y: number; vx: number; vy: number; delay: number; size: number; signal: boolean }[] = []
      for (let y = 0; y < h; y += step)
        for (let x = 0; x < w; x += step)
          if (data[(y * w + x) * 4 + 3] > 100)
            particles.push({
              x,
              y,
              vx: 20 + Math.random() * 95,
              vy: -25 - Math.random() * 100,
              delay: (x / w) * 0.45,
              size: 0.8 + Math.random() * 1.3,
              signal: Math.random() > 0.65,
            })
      canvas.dataset.ready = 'true'

      const draw = (now: number) => {
        if (cancelled) return
        const t = (now - start) / 1000
        ctx.clearRect(0, 0, w, h)
        for (const p of particles) {
          const life = Math.max(0, t - 0.9 - p.delay)
          ctx.globalAlpha = Math.max(0, 1 - life / 1.6) * Math.min(1, t * 4)
          ctx.fillStyle = p.signal && life > 0 ? signal : ink
          const sway = Math.sin(life * 3 + p.y * 0.03) * life * 14
          ctx.beginPath()
          ctx.arc(p.x + p.vx * life + sway, p.y + p.vy * life, p.size + life * 0.4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
        if (t < 3.4) frame = requestAnimationFrame(draw)
      }
      frame = requestAnimationFrame(draw)
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
    }
  }, [showing])

  return (
    <>
      <div className="contents" inert={showing || undefined}>
        {children}
      </div>
      {showing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Welcome to Truckify"
          className={`fixed inset-0 z-[90] flex flex-col justify-between overflow-hidden bg-bg-sunk p-[clamp(24px,4vw,56px)] text-ink transition-[opacity,visibility] duration-[450ms] ${
            leaving ? 'invisible opacity-0' : 'opacity-100'
          }`}
        >
          <div aria-hidden className="hairline-grid pointer-events-none absolute inset-0 opacity-50" />
          <div className="label relative flex items-center justify-between gap-5 text-ink-faint">
            <span className="text-ink">Truckify · Dispatch Desk</span>
            <span className="hidden sm:inline">Owner-operators / Small fleets</span>
          </div>

          <div className="relative w-full text-center">
            <p className="label text-accent-text">You run the road</p>
            <div className="relative mx-auto -my-3 grid h-[clamp(160px,26vw,300px)] max-w-[1100px] place-items-center">
              <canvas ref={canvasRef} aria-hidden className="peer absolute inset-0 h-full w-full" />
              <span className="text-[clamp(2.4rem,9vw,8rem)] leading-none font-bold tracking-[-0.05em] peer-data-[ready=true]:opacity-0">
                Truckify
              </span>
            </div>
            <p className="font-serif text-[1.15rem] font-light italic text-ink-muted">We run the board.</p>
          </div>

          <div className="label relative flex items-center justify-between gap-5 text-ink-faint">
            <span>Truck dispatching</span>
            <button
              type="button"
              onClick={dismiss}
              className="min-h-11 py-2.5 pl-4 text-[0.75rem] tracking-normal text-ink normal-case transition-colors hover:text-accent-text"
            >
              Skip intro <span className="ml-2 text-accent-text" aria-hidden>↗</span>
            </button>
          </div>
          <div
            aria-hidden
            className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-accent motion-safe:animate-[splash-timeline_3s_linear_both]"
          />
        </div>
      )}
    </>
  )
}
