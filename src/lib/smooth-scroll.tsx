import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from './gsap'

interface SmoothScrollValue {
  /** Scroll to a selector, element or pixel offset. `instant` skips easing. */
  scrollTo: (target: string | number | HTMLElement, instant?: boolean) => void
  /** Freeze page scrolling (e.g. while the splash screen is up). */
  setLocked: (locked: boolean) => void
}

const SmoothScrollContext = createContext<SmoothScrollValue>({ scrollTo: () => {}, setLocked: () => {} })

const NAV_OFFSET = -80

/**
 * Lenis drives the window's native scroll position (so keyboard, touch and
 * assistive tech keep working) and is ticked by GSAP so ScrollTrigger and the
 * smoothed position never drift apart. Disabled for reduced motion and touch.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const lockedRef = useRef(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduce || coarse) return

    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, anchors: false })
    lenisRef.current = lenis
    if (lockedRef.current) lenis.stop()
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollTo = useCallback((target: string | number | HTMLElement, instant = false) => {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
    if (typeof target === 'string' && !el) return

    const lenis = lenisRef.current
    if (lenis) {
      // Lenis caches the scroll limit; a freshly rendered route may be taller than it knows.
      lenis.resize()
      lenis.scrollTo(el ?? (target as number), { offset: NAV_OFFSET, immediate: instant, duration: 1.4 })
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior: ScrollBehavior = instant || reduce ? 'auto' : 'smooth'
    if (el instanceof HTMLElement) el.scrollIntoView({ behavior, block: 'start' })
    else window.scrollTo({ top: target as number, behavior })
  }, [])

  const setLocked = useCallback((locked: boolean) => {
    lockedRef.current = locked
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    if (locked) lenisRef.current?.stop()
    else lenisRef.current?.start()
  }, [])

  const value = useMemo(() => ({ scrollTo, setLocked }), [scrollTo, setLocked])
  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
}

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}
