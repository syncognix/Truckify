import { useEffect, useRef } from 'react'

/** Floats per dot: x, y, vx, vy, homeX, homeY, radius. */
const STRIDE = 7
const FONT_FAMILY = '"Geist Variable", ui-sans-serif, system-ui, sans-serif'
const RIPPLE_MS = 900

interface DotWordmarkProps {
  text: string
  /** Fraction of the glyph height pushed below the bottom edge (0–0.6). */
  crop?: number
  className?: string
}

/** Resolve any CSS colour (incl. custom properties) to [r, g, b]. */
function cssColor(probe: CanvasRenderingContext2D, value: string): [number, number, number] {
  probe.fillStyle = '#000'
  probe.fillStyle = value.trim() || '#000'
  const hex = String(probe.fillStyle)
  if (hex.startsWith('#')) return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
  const m = hex.match(/\d+/g)
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [0, 0, 0]
}

/**
 * The footer's closing wordmark as a halftone dot field, cropped by the page
 * edge. Dots flee the pointer and spring home, warming to the signal colour as
 * they move; a click drops a ripple ring through the field (one drop plays the
 * first time the footer scrolls into view). Colours follow the theme tokens.
 * Static, non-interactive render for reduced motion.
 */
export function DotWordmark({ text, crop = 0.18, className = '' }: DotWordmarkProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 1
    let h = 1
    let dpr = 1
    let dots = new Float32Array()
    let count = 0
    let ink: [number, number, number] = [237, 232, 221]
    let warm: [number, number, number] = [212, 255, 63]
    let pointerX = -1e5
    let pointerY = -1e5
    let ripple = { x: 0, y: 0, t: -1 }
    let frame = 0
    let visible = true
    let dirty = true
    let dropped = false
    let alive = true

    const readColors = () => {
      const styles = getComputedStyle(document.documentElement)
      ink = cssColor(ctx, styles.getPropertyValue('--c-ink'))
      warm = cssColor(ctx, styles.getPropertyValue('--c-accent'))
    }

    const layout = () => {
      const rect = wrap.getBoundingClientRect()
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)

      // Rasterise the word offscreen, then sample coverage on a dot grid.
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const o = off.getContext('2d', { willReadFrequently: true })
      if (!o) return
      o.font = `700 100px ${FONT_FAMILY}`
      const size = (w * 1.01) / Math.max(1, o.measureText(text).width) * 100
      o.font = `700 ${size}px ${FONT_FAMILY}`
      const metrics = o.measureText(text)
      const ascent = metrics.actualBoundingBoxAscent || size * 0.72
      o.fillStyle = '#000'
      o.fillText(text, (w - metrics.width) / 2, h + ascent * Math.min(0.6, Math.max(0, crop)))
      const alpha = o.getImageData(0, 0, w, h).data

      const gap = w < 640 ? 5 : 6
      const cols = Math.ceil(w / gap)
      const rows = Math.ceil(h / gap)
      const out: number[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let sum = 0
          for (let sy = 0; sy < 3; sy++)
            for (let sx = 0; sx < 3; sx++) {
              const px = Math.min(w - 1, Math.floor(c * gap + ((sx + 0.5) * gap) / 3))
              const py = Math.min(h - 1, Math.floor(r * gap + ((sy + 0.5) * gap) / 3))
              sum += alpha[(py * w + px) * 4 + 3]
            }
          const coverage = sum / (9 * 255)
          if (coverage < 0.06) continue
          const x = c * gap + gap / 2
          const y = r * gap + gap / 2
          out.push(x, y, 0, 0, x, y, Math.sqrt(coverage) * gap * 0.56)
        }
      }
      dots = new Float32Array(out)
      count = out.length / STRIDE
      dirty = true
    }

    const draw = (now: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const radius = reduce ? 0 : Math.min(110, w * 0.09)
      const age = ripple.t < 0 ? 1e9 : now - ripple.t
      const front = age * 0.9
      let moving = false

      for (let i = 0; i < count; i++) {
        const k = i * STRIDE
        let x = dots[k]
        let y = dots[k + 1]
        let vx = dots[k + 2]
        let vy = dots[k + 3]
        const hx = dots[k + 4]
        const hy = dots[k + 5]

        if (!reduce) {
          // Ripple ring: dots near the expanding front get an outward kick.
          if (age < RIPPLE_MS) {
            const dx = hx - ripple.x
            const dy = hy - ripple.y
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.001
            const band = 1 - Math.min(1, Math.abs(dist - front) / 26)
            if (band > 0) {
              const kick = band * 3.2 * (1 - age / RIPPLE_MS)
              vx += (dx / dist) * kick
              vy += (dy / dist) * kick
            }
          }
          // Pointer repulsion.
          const px = x - pointerX
          const py = y - pointerY
          const d2 = px * px + py * py
          if (radius > 0 && d2 < radius * radius) {
            const d = Math.sqrt(d2) + 0.001
            const push = (1 - d / radius) * 2.6
            vx += (px / d) * push
            vy += (py / d) * push
          }
          // Damped spring home.
          vx = (vx + (hx - x) * 0.05) * 0.84
          vy = (vy + (hy - y) * 0.05) * 0.84
          x += vx
          y += vy
          if (Math.abs(vx) + Math.abs(vy) > 0.02 || Math.abs(x - hx) + Math.abs(y - hy) > 0.05) moving = true
          else {
            x = hx
            y = hy
            vx = 0
            vy = 0
          }
          dots[k] = x
          dots[k + 1] = y
          dots[k + 2] = vx
          dots[k + 3] = vy
        }

        const heat = Math.min(1, Math.hypot(x - hx, y - hy) / 28)
        ctx.fillStyle =
          heat > 0.02
            ? `rgb(${ink[0] + (warm[0] - ink[0]) * heat | 0},${ink[1] + (warm[1] - ink[1]) * heat | 0},${ink[2] + (warm[2] - ink[2]) * heat | 0})`
            : `rgb(${ink[0]},${ink[1]},${ink[2]})`
        ctx.beginPath()
        ctx.arc(x, y, dots[k + 6], 0, Math.PI * 2)
        ctx.fill()
      }
      dirty = moving || age < RIPPLE_MS || pointerX > -1e4
    }

    const loop = (now: number) => {
      frame = 0
      if (!visible || !alive) return
      draw(now)
      if (dirty) frame = requestAnimationFrame(loop)
    }
    const wake = () => {
      dirty = true
      if (!frame && visible) frame = requestAnimationFrame(loop)
    }

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return [e.clientX - r.left, e.clientY - r.top] as const
    }
    const onMove = (e: PointerEvent) => {
      ;[pointerX, pointerY] = local(e)
      wake()
    }
    const onLeave = () => {
      pointerX = -1e5
      pointerY = -1e5
      wake()
    }
    const drop = (x: number, y: number) => {
      ripple = { x, y, t: performance.now() }
      wake()
    }
    const onDown = (e: PointerEvent) => {
      const [x, y] = local(e)
      drop(x, y)
    }

    readColors()
    layout()
    draw(performance.now())

    if (!reduce) {
      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerleave', onLeave)
      wrap.addEventListener('pointerdown', onDown)
    }
    const ro = new ResizeObserver(() => {
      layout()
      wake()
    })
    ro.observe(wrap)
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (!visible) return
        if (!dropped && !reduce && entry.intersectionRatio > 0.5) {
          dropped = true
          drop(w / 2, h * 0.85)
        }
        wake()
      },
      { threshold: [0, 0.55] },
    )
    io.observe(wrap)
    const themeWatch = new MutationObserver(() => {
      readColors()
      wake()
    })
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    document.fonts?.ready.then(() => {
      if (!alive) return
      layout()
      wake()
    })

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      themeWatch.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      wrap.removeEventListener('pointerdown', onDown)
    }
  }, [text, crop])

  return (
    <div ref={wrapRef} className={`relative select-none ${className}`}>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block h-full w-full" />
      <span className="sr-only">{text}</span>
    </div>
  )
}
