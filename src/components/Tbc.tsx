import type { Fact } from '../data/types'

/** Renders a business fact; unconfirmed placeholders get a visible TBC tag. */
export function FactText({ fact, className }: { fact: Fact; className?: string }) {
  return (
    <span className={className}>
      {fact.value}
      {fact.placeholder && <TbcTag />}
    </span>
  )
}

export function TbcTag({ label = 'TBC' }: { label?: string }) {
  return (
    <span
      title="Placeholder — confirm with the business before launch"
      className="label ml-2 inline-flex translate-y-[-1px] items-center rounded-[3px] border border-dashed border-accent-text/60 px-1.5 py-[3px] align-middle text-[0.58rem] text-accent-text"
    >
      {label}
    </span>
  )
}
