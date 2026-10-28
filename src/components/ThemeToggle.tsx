import { AnimatePresence, m } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useTheme } from '../lib/theme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    const r = event.currentTarget.getBoundingClientRect()
    toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="relative grid size-10 place-items-center overflow-hidden rounded-full border border-line text-ink transition-colors duration-300 hover:border-line-strong hover:bg-card-hover"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={theme}
          initial={{ y: 18, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -18, rotate: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="grid place-items-center"
        >
          {theme === 'dark' ? <Moon className="size-[1.05rem]" /> : <Sun className="size-[1.05rem]" />}
        </m.span>
      </AnimatePresence>
    </button>
  )
}
