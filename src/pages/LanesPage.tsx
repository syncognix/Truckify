import { ButtonLink } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { PAGES } from '../data/pages'
import { usePageMeta } from '../lib/page-meta'
import { Capabilities } from '../sections/Capabilities'
import { LanePlotter } from '../sections/LanePlotter'

export default function LanesPage() {
  usePageMeta(PAGES.lanes)
  return (
    <>
      <PageHero
        page="lanes"
        code="PG-04 / LN"
        eyebrow="Lanes"
        title="Your lanes."
        accent="Your call."
        lede="Where you run shapes everything — rates, reloads, home time. Plot the lanes you want and we’ll build the dispatch plan around them."
        actions={
          <>
            <ButtonLink href="/lanes#lanes">Open the plotter</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">
              Talk lanes with us
            </ButtonLink>
          </>
        }
      />
      <LanePlotter index="01" />
      <Capabilities />
      <CtaBand title="Got a lane" accent="in mind?" />
    </>
  )
}
