import { AnimatePresence, m } from 'motion/react'
import { ChevronDown, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { SERVICES } from '../data/content'
import { NAV_LINKS, SITE } from '../data/site'
import { Link, useRouter } from '../lib/router'
import { ButtonLink } from './Button'
import { Logo } from './Logo'
import { FactText } from './Tbc'
import { ThemeToggle } from './ThemeToggle'

const EASE = [0.16, 1, 0.3, 1] as const

/** Transparent over the hero, liquid glass once scrolled; tucks away while scrolling down. */
export function Nav() {
  const { path } = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        setScrolled(y > 24)
        if (Math.abs(y - last) > 6) setHidden(y > last && y > 400)
        last = y
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <m.header
        initial={false}
        animate={{ y: hidden && !menuOpen ? '-120%' : '0%' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-[1520px] items-center justify-between gap-4 rounded-full py-2 pr-2 pl-4 transition-[background-color,border-color,box-shadow] duration-500 sm:pl-5 ${
            scrolled || menuOpen ? 'glass glass-sheen' : 'border border-transparent'
          }`}
        >
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            <li>
              <ServicesMenu />
            </li>
            {NAV_LINKS.slice(1).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={path === link.href ? 'page' : undefined}
                  className="relative rounded-full px-4 py-2 text-[0.92rem] text-ink-muted transition-colors duration-300 hover:bg-card-hover hover:text-ink aria-[current=page]:text-ink"
                >
                  {link.label}
                  {path === link.href && (
                    <span aria-hidden className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden sm:block">
              <ButtonLink href="/contact">Book a consult</ButtonLink>
            </span>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full bg-ink text-bg lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <X className="size-4" />
              ) : (
                <span className="flex w-4 flex-col gap-[5px]" aria-hidden>
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-2/3 bg-current" />
                </span>
              )}
            </button>
          </div>
        </nav>
      </m.header>

      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
    </>
  )
}

function ServicesMenu() {
  const active = useRouter().path === '/services'
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | undefined>(undefined)

  const show = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hide = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) hide()
      }}
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.92rem] transition-colors duration-300 hover:bg-card-hover hover:text-ink ${
          active ? 'text-ink' : 'text-ink-muted'
        }`}
      >
        Services
        <ChevronDown className={`size-3.5 transition-transform duration-500 ease-out-expo ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            id={id}
            initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: EASE }}
            className="glass glass-sheen absolute top-[calc(100%+14px)] left-1/2 w-[34rem] -translate-x-1/2 rounded-[1.4rem] p-2"
          >
            <ul className="grid grid-cols-2 gap-1">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="group flex gap-3 rounded-2xl p-3 transition-colors duration-300 hover:bg-card-hover"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-line text-ink-muted transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink">
                      <s.icon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-[0.9rem] font-medium">{s.title}</span>
                      <span className="mt-0.5 block text-[0.78rem] leading-snug text-ink-muted">{s.value}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="label mt-1 flex items-center justify-between rounded-2xl bg-card px-4 py-3 text-ink-faint">
              <span>6 services · one desk</span>
              <Link href="/services" onClick={() => setOpen(false)} className="text-accent-text hover:underline">
                All services →
              </Link>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const links = [{ label: 'Home', href: '/' }, ...NAV_LINKS, { label: 'Contact', href: '/contact' }]
  return (
    <m.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      initial={{ clipPath: 'inset(0 0 100% 0 round 0 0 2rem 2rem)' }}
      animate={{ clipPath: 'inset(0 0 0% 0 round 0 0 0rem 0rem)' }}
      exit={{ clipPath: 'inset(0 0 100% 0 round 0 0 2rem 2rem)' }}
      transition={{ duration: 0.7, ease: EASE }}
      className="fixed inset-0 z-40 flex flex-col bg-bg-elev px-6 pt-28 pb-8 lg:hidden"
    >
      <ul className="flex flex-col">
        {links.map((link, i) => (
          <m.li
            key={link.href}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
            className="border-b border-line"
          >
            <Link href={link.href} onClick={onClose} className="flex items-baseline justify-between py-4">
              <span className="text-[2.2rem] font-semibold tracking-[-0.045em]">{link.label}</span>
              <span className="label text-ink-faint">0{i + 1}</span>
            </Link>
          </m.li>
        ))}
      </ul>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.45 }}
        className="mt-auto flex flex-col gap-4"
      >
        <ButtonLink href="/contact" onClick={onClose} className="self-start">
          Book a consult
        </ButtonLink>
        <p className="label text-ink-faint">
          <FactText fact={SITE.phone} />
        </p>
      </m.div>
    </m.div>
  )
}
