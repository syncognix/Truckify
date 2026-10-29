import { Link } from '../lib/router'

/** Wordmark: a "T" stamped like a trailer placard, with the hi-vis signal block. */
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="7" className="fill-ink" />
      <path d="M8 10h16v3.2h-6.4V23h-3.2v-9.8H8z" className="fill-bg" />
      <rect x="19.6" y="19.8" width="4.4" height="3.2" className="fill-accent" />
    </svg>
  )
}

export function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-3">
      <LogoMark className="size-8 transition-transform duration-700 ease-out-expo group-hover:rotate-[-8deg]" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.05rem] font-semibold tracking-[-0.04em]">Truckify</span>
        <span className="label mt-1 text-[0.6rem] text-ink-faint">Dispatch Desk</span>
      </span>
    </Link>
  )
}
