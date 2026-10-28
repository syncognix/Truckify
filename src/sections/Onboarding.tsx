import { FileBadge, FileSignature, FileText, ShieldCheck } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { SectionHeader } from '../components/SectionHeader'
import { TbcTag } from '../components/Tbc'

const DOCUMENTS = [
  { icon: FileBadge, title: 'MC / DOT authority', body: 'Your active operating authority and DOT number.' },
  { icon: ShieldCheck, title: 'Certificate of insurance', body: 'Current COI listing your liability and cargo coverage.' },
  { icon: FileText, title: 'W-9', body: 'Needed for broker setups and payment.' },
  { icon: FileSignature, title: 'Dispatch agreement', body: 'Plain-language terms, signed before any load is booked.' },
]

const AGREED = ['Target lanes and regions', 'Minimum rate per mile', 'Home-time schedule', 'Freight you won’t haul', 'How and when we update you']

export function Onboarding({ index = '02' }: { index?: string }) {
  return (
    <section aria-labelledby="onboarding-title" className="shell py-28 sm:py-36">
      <SectionHeader
        index={index}
        eyebrow="Getting started"
        id="onboarding-title"
        title={
          <>
            What you’ll need on <span className="font-serif font-light italic">day one.</span>
          </>
        }
        aside={
          <p className="text-[0.95rem]">
            Typical requirements — the full checklist is confirmed on your intro call. <TbcTag />
          </p>
        }
      />
      <div className="mt-16 grid grid-cols-12 gap-3">
        <ul className="col-span-12 grid gap-3 sm:grid-cols-2 lg:col-span-8">
          {DOCUMENTS.map((d, i) => (
            <Reveal as="li" key={d.title} delay={i * 0.06} className="rounded-panel border border-line bg-card p-6">
              <d.icon className="size-6 text-accent-text" strokeWidth={1.5} />
              <h3 className="mt-10 text-[1.35rem] font-semibold tracking-[-0.035em]">{d.title}</h3>
              <p className="mt-2 text-[0.95rem] text-ink-muted">{d.body}</p>
            </Reveal>
          ))}
        </ul>
        <Reveal className="col-span-12 flex flex-col rounded-panel bg-accent p-7 text-accent-ink lg:col-span-4">
          <p className="label">Agreed up front</p>
          <p className="mt-4 font-serif text-[1.9rem] leading-[1.05] font-light tracking-[-0.03em]">
            Your rules become our dispatch brief.
          </p>
          <ol className="mt-auto grid gap-0 pt-10">
            {AGREED.map((a, i) => (
              <li key={a} className="flex items-baseline gap-4 border-t border-accent-ink/15 py-3 text-[0.95rem] font-medium">
                <span className="label opacity-60">{String(i + 1).padStart(2, '0')}</span>
                {a}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
