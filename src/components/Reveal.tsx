import { m, useReducedMotion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const EASE = [0.16, 1, 0.3, 1] as const

const blurUp: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  shown: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.1, ease: EASE } },
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'li' | 'p' | 'span'
}

/** Blur-to-sharp entrance for a block, triggered once as it enters the viewport. */
export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const Tag = m[as]
  if (reduce) {
    const Static = as
    return <Static className={className}>{children}</Static>
  }
  return (
    <Tag
      className={className}
      variants={blurUp}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ delay }}
    >
      {children}
    </Tag>
  )
}

interface SplitWordsProps {
  text: string
  className?: string
  /** Seconds before the first word starts. */
  delay?: number
  /** Animate immediately on mount instead of on scroll-into-view. */
  onMount?: boolean
}

/** Masked word-by-word rise. Words stay in the accessibility tree as one string. */
export function SplitWords({ text, className, delay = 0, onMount = false }: SplitWordsProps) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  if (reduce) return <span className={className}>{text}</span>

  const trigger = onMount
    ? { initial: 'hidden', animate: 'shown' }
    : { initial: 'hidden', whileInView: 'shown', viewport: { once: true, margin: '0px 0px -10% 0px' } }

  return (
    <m.span className={className} {...trigger}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <m.span
              className="inline-block"
              variants={{
                hidden: { y: '105%', rotate: 4 },
                shown: { y: '0%', rotate: 0, transition: { duration: 1, ease: EASE, delay: delay + i * 0.07 } },
              }}
            >
              {word}
            </m.span>
          </span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </m.span>
  )
}
