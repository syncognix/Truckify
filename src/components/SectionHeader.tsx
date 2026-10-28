import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionHeaderProps {
  index: string
  eyebrow: string
  title: ReactNode
  aside?: ReactNode
  id?: string
}

/** Swiss-grid section opener: index + eyebrow in the margin column, title across eight. */
export function SectionHeader({ index, eyebrow, title, aside, id }: SectionHeaderProps) {
  return (
    <header className="grid grid-cols-12 gap-x-6 gap-y-6 border-t border-line pt-6">
      <div className="label col-span-12 flex items-center gap-3 text-ink-muted md:col-span-3">
        <span className="text-accent-text">{index}</span>
        <span className="h-px w-8 bg-line-strong" />
        <span>{eyebrow}</span>
      </div>
      <Reveal className="col-span-12 md:col-span-9 lg:col-span-7">
        <h2 id={id} className="text-title font-semibold tracking-[-0.045em]">
          {title}
        </h2>
      </Reveal>
      {aside && (
        <div className="col-span-12 text-ink-muted md:col-span-6 md:col-start-4 lg:col-span-2 lg:col-start-11 lg:self-end">
          {aside}
        </div>
      )}
    </header>
  )
}
