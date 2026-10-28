import { useEffect, type RefObject } from 'react'

const FINE = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

/**
 * Magnetic pull: the element leans toward the cursor (via the independent
 * `translate` property, so it composes with Tailwind transforms) and springs
 * back on leave. Fine pointers only; touch keeps a plain tap target.
 */
export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.28) {
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia(FINE).matches) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      el.style.transition = 'translate 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`
    }
    const leave = () => {
      el.style.transition = 'translate 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
      el.style.translate = '0px 0px'
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      el.style.translate = ''
    }
  }, [ref, strength])
}

/**
 * Headlight: writes the pointer position into `--hx`/`--hy` (and toggles
 * `data-lit`) on the element so CSS can paint a beam that follows the cursor.
 */
export function useHeadlight(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia(FINE).matches) return
    let frame = 0
    let x = 0
    let y = 0
    const paint = () => {
      frame = 0
      el.style.setProperty('--hx', `${x}px`)
      el.style.setProperty('--hy', `${y}px`)
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      x = e.clientX - r.left
      y = e.clientY - r.top
      el.dataset.lit = 'true'
      if (!frame) frame = requestAnimationFrame(paint)
    }
    const leave = () => {
      el.dataset.lit = 'false'
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [ref])
}
