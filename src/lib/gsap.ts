import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Media queries shared by every scroll choreography, so they degrade identically. */
export const MQ = {
  motionDesktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  motionAny: '(prefers-reduced-motion: no-preference)',
} as const

export { gsap, ScrollTrigger, useGSAP }
