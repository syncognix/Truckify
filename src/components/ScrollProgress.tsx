import { useEffect, useRef } from 'react'

/**
 * Replaces the hidden native scrollbar: a hairline rail on the right edge with
 * a signal-coloured fill and a mono read-out. Desktop shows the rail; small
 * screens get a 2px bar under the nav. Writes to the DOM directly — no React
 * re-render per scroll frame.
 */
export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      fillRef.current?.style.setProperty('transform', `scaleY(${p})`)
      barRef.current?.style.setProperty('transform', `scaleX(${p})`)
      if (readoutRef.current) readoutRef.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      ro.disconnect()
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none">
      <div className="fixed inset-x-0 top-0 z-[70] h-[2px] lg:hidden">
        <div ref={barRef} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
      <div className="fixed top-1/2 right-3 z-[70] hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
        <span className="label text-[0.55rem] text-ink-faint [writing-mode:vertical-rl]">Odometer</span>
        <div className="relative h-40 w-px overflow-hidden bg-line-strong">
          <div ref={fillRef} className="absolute inset-0 origin-top scale-y-0 bg-accent" />
        </div>
        <span ref={readoutRef} className="label text-[0.6rem] tabular-nums text-ink-muted">
          000
        </span>
      </div>
    </div>
  )
}
