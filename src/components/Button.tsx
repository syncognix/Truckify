import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from '../lib/router'

type Variant = 'signal' | 'glass' | 'ghost'

const base =
  'group relative inline-flex items-center gap-3 overflow-hidden rounded-full font-medium tracking-[-0.01em] transition-[transform,background-color,color,border-color] duration-500 ease-out-expo active:scale-[0.98] select-none'

const variants: Record<Variant, string> = {
  signal: 'bg-accent text-accent-ink pl-6 pr-2 py-2 hover:bg-ink hover:text-bg',
  glass: 'glass text-ink pl-6 pr-2 py-2 hover:border-line-strong',
  ghost: 'text-ink px-1 py-2 underline decoration-line-strong underline-offset-8 hover:decoration-accent',
}

const knob: Record<Variant, string> = {
  signal: 'bg-accent-ink text-accent group-hover:bg-bg group-hover:text-ink',
  glass: 'bg-ink text-bg',
  ghost: 'hidden',
}

interface ButtonLinkProps {
  href: string
  children: ReactNode
  variant?: Variant
  className?: string
  icon?: ReactNode
  onClick?: () => void
}

/** Pill CTA with a circular "knob" whose arrow slides through on hover. */
export function ButtonLink({ href, children, variant = 'signal', className = '', icon, onClick }: ButtonLinkProps) {
  return (
    <Link href={href} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      <span className="relative z-10 text-[0.95rem]">{children}</span>
      <Knob variant={variant}>{icon}</Knob>
    </Link>
  )
}

export function Knob({ variant = 'signal', children }: { variant?: Variant; children?: ReactNode }) {
  return (
    <span
      aria-hidden
      className={`relative z-10 grid size-10 place-items-center overflow-hidden rounded-full transition-colors duration-500 ${knob[variant]}`}
    >
      {children ?? (
        <>
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-6 group-hover:-translate-y-6" />
          <ArrowUpRight className="absolute size-4 -translate-x-6 translate-y-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
        </>
      )}
    </span>
  )
}
