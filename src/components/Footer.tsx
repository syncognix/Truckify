import { ArrowUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { SERVICES } from '../data/content'
import { LEGAL_LINKS, NAV_LINKS, SITE } from '../data/site'
import { Link } from '../lib/router'
import { useSmoothScroll } from '../lib/smooth-scroll'
import { Logo } from './Logo'
import { DotWordmark } from './DotWordmark'

const YEAR = new Date().getFullYear()

const linkClass =
  'group/link relative inline-flex items-center gap-2 text-ink-muted transition-colors duration-300 hover:text-ink'

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={linkClass}>
      <span className="h-px w-0 bg-accent transition-[width] duration-500 ease-out-expo group-hover/link:w-4" />
      {children}
    </Link>
  )
}

export function Footer() {
  const { scrollTo } = useSmoothScroll()

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-sunk pt-20">
      <div className="shell">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 flex flex-col gap-6 md:col-span-4">
            <Logo />
            <p className="max-w-xs text-[0.95rem] text-ink-muted">
              Truck dispatching for owner-operators and small fleets. You run the road — we run the board.
            </p>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="label group inline-flex w-fit items-center gap-3 text-ink-muted hover:text-ink"
            >
              <span className="grid size-9 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                <ArrowUp className="size-4" />
              </span>
              Back to top
            </button>
          </div>

          <FooterCol title="Navigate" className="md:col-span-2 md:col-start-6">
            {NAV_LINKS.map((l) => (
              <FooterLink key={l.href} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterCol>

          <FooterCol title="Services" className="md:col-span-3">
            {SERVICES.map((s) => (
              <FooterLink key={s.id} href={`/services#${s.id}`}>
                {s.title}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Desk" className="col-span-2 md:col-span-2">
            <a href={`mailto:${SITE.email.value}`} className={`${linkClass} break-all`}>
              {SITE.email.value}
            </a>
            <a href={`tel:${SITE.phone.value.replace(/[^\d+]/g, '')}`} className={linkClass}>
              {SITE.phone.value}
            </a>
            <span className="text-ink-muted">{SITE.hours.value}</span>
            {SITE.social.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={linkClass}>
                {s.label}
              </a>
            ))}
          </FooterCol>
        </div>
      </div>

      {/* Closing wordmark — halftone dots that scatter from the pointer; click to drop a ripple. */}
      <div className="relative mt-16 border-t border-line">
        <DotWordmark text="Truckify" className="h-[clamp(9rem,24vw,24rem)] cursor-crosshair" />
        <p aria-hidden className="label pointer-events-none absolute top-4 right-[clamp(1.25rem,4vw,3.5rem)] hidden text-ink-faint sm:block">
          Move · click to drop
        </p>
      </div>

      <div className="shell flex flex-col gap-4 border-t border-line py-6 text-[0.8rem] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <p>© {YEAR} Truckify. All rights reserved.</p>
        <ul className="flex gap-6">
          {LEGAL_LINKS.map((l) => (
            <li key={l.href}>
              <FooterLink href={l.href}>{l.label}</FooterLink>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}

function FooterCol({ title, className = '', children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <p className="label mb-5 text-ink-faint">{title}</p>
      <div className="flex flex-col items-start gap-3 text-[0.95rem]">{children}</div>
    </div>
  )
}
