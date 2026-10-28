import type { RefObject } from 'react'
import { gsap, MQ, useGSAP } from './gsap'

/** Scroll-scrubbed parallax shared by every hero: media drifts, copy lifts, shade deepens. */
export function useHeroParallax(root: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motionAny, () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          })
          .to('[data-hero-media]', { yPercent: 14, scale: 1.06 }, 0)
          .to('[data-hero-copy]', { yPercent: -14, opacity: 0.2 }, 0)
          .to('[data-hero-aside]', { yPercent: -30, opacity: 0 }, 0)
          .to('[data-hero-shade]', { opacity: 0.85 }, 0)
      })
      return () => mm.revert()
    },
    { scope: root },
  )
}
