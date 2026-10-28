import { AnimatePresence, m } from 'motion/react'
import { Plus } from 'lucide-react'
import { useId, useState } from 'react'
import { ButtonLink } from '../components/Button'
import { TbcTag } from '../components/Tbc'
import { FAQ } from '../data/content'
import type { FaqItem } from '../data/types'

const EASE = [0.16, 1, 0.3, 1] as const

export function Faq({ index = '06', limit }: { index?: string; limit?: number }) {
  const [open, setOpen] = useState<number | null>(0)
  const items = limit ? FAQ.slice(0, limit) : FAQ

  return (
    <section id="faq" aria-labelledby="faq-title" className="shell py-28 sm:py-36">
      <div className="grid grid-cols-12 gap-x-6 gap-y-12 border-t border-line pt-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="label mb-6 flex items-center gap-3 text-ink-muted">
              <span className="text-accent-text">{index}</span>
              <span className="h-px w-8 bg-line-strong" />
              Questions
            </p>
            <h2 id="faq-title" className="text-title font-semibold tracking-[-0.045em]">
              Straight <span className="font-serif font-light italic">answers.</span>
            </h2>
            <p className="mt-6 max-w-sm text-ink-muted">
              Don’t see yours? Ask it on the intro call — there’s no obligation to sign up.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {limit && (
                <ButtonLink href="/faq" variant="glass">
                  All {FAQ.length} questions
                </ButtonLink>
              )}
              <ButtonLink href="/contact" variant={limit ? 'ghost' : 'glass'}>
                Ask a question
              </ButtonLink>
            </div>
          </div>
        </div>

        <ul className="col-span-12 border-t border-line lg:col-span-8 lg:border-t-0">
          {items.map((item, i) => (
            <FaqRow key={item.q} item={item} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function FaqRow({ item, index, open, onToggle }: { item: FaqItem; index: number; open: boolean; onToggle: () => void }) {
  const id = useId()
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full items-start gap-5 py-6 text-left"
        >
          <span className="label pt-2 text-ink-faint tabular-nums">{String(index + 1).padStart(2, '0')}</span>
          <span
            className={`flex-1 text-[clamp(1.15rem,1.7vw,1.5rem)] leading-snug font-medium tracking-[-0.03em] transition-colors ${
              open ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
            }`}
          >
            {item.q}
          </span>
          <span
            className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-out-expo ${
              open ? 'rotate-45 border-accent bg-accent text-accent-ink' : 'border-line group-hover:border-line-strong'
            }`}
            aria-hidden
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pr-14 pb-7 pl-11 text-ink-muted">
              {item.a}
              {item.needsConfirmation && <TbcTag label="Policy TBC" />}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  )
}
