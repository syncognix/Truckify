import { ButtonLink } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { PROCESS } from '../data/content'
import { PAGES } from '../data/pages'
import { usePageMeta } from '../lib/page-meta'
import { Onboarding } from '../sections/Onboarding'
import { Process } from '../sections/Process'

export default function HowItWorksPage() {
  usePageMeta(PAGES.process)
  return (
    <>
      <PageHero
        page="process"
        code="PG-03 / OPS"
        eyebrow="How it works"
        title="A plan from above."
        accent="Wheels on the ground."
        lede="Five steps from your first call to a schedule that runs itself — with your preferences written into every decision we make."
        actions={
          <>
            <ButtonLink href="/contact">Start step one</ButtonLink>
            <ButtonLink href="/how-it-works#process" variant="ghost">
              See the steps
            </ButtonLink>
          </>
        }
        aside={
          <ol className="glass glass-sheen rounded-panel p-5">
            <li className="label mb-3 text-ink-faint">The route</li>
            {PROCESS.map((s, i) => (
              <li key={s.title} className="flex items-baseline gap-4 border-t border-line py-2.5 text-[0.92rem]">
                <span className="label text-accent-text">0{i + 1}</span>
                {s.detail}
              </li>
            ))}
          </ol>
        }
      />
      <Process index="01" />
      <Onboarding index="02" />
      <CtaBand title="Ready for" accent="step one?" />
    </>
  )
}
