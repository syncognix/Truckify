import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

const QUERY = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const NATIVE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), iframe, video'
const INTERACTIVE = 'a, button, summary, label, [role="button"], canvas'

/**
 * Signal-coloured arrow that replaces the system cursor on fine pointers.
 * Grows over interactive targets, dips on press, and hands back to the native
 * cursor for text fields, keyboard navigation, scrolling and window blur.
 */
export function SiteCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const html = document.documentElement
    const root = rootRef.current

    const hide = () => {
      html.classList.remove('has-site-cursor')
      if (root) root.dataset.visible = 'false'
    }
    const onMove = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null
      if (!mql.matches || e.pointerType !== 'mouse' || target?.closest(NATIVE)) {
        hide()
        return
      }
      pointerRef.current?.style.setProperty('transform', `translate3d(${e.clientX - 1}px, ${e.clientY - 2}px, 0)`)
      html.classList.add('has-site-cursor')
      if (root) {
        root.dataset.visible = 'true'
        root.dataset.interactive = String(!!target?.closest(INTERACTIVE))
      }
    }
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) hide()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Tab' && hide()
    const onDown = () => root && (root.dataset.pressed = 'true')
    const onUp = () => root && (root.dataset.pressed = 'false')

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onOut)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('keydown', onKey)
    document.addEventListener('visibilitychange', hide)
    window.addEventListener('blur', hide)
    mql.addEventListener('change', hide)
    return () => {
      hide()
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerout', onOut)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('visibilitychange', hide)
      window.removeEventListener('blur', hide)
      mql.removeEventListener('change', hide)
    }
  }, [])

  return createPortal(
    <div ref={rootRef} className="site-cursor" data-visible="false" aria-hidden>
      <div ref={pointerRef} className="site-cursor-pointer">
        <svg width="26" height="26" viewBox="0 0 40 40" fill="none">
          <path
            fill="var(--c-accent)"
            stroke="#0a0a09"
            strokeWidth="1.6"
            strokeLinejoin="round"
            d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
          />
        </svg>
      </div>
    </div>,
    document.body,
  )
}
