import { ButtonLink } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { HeroIndex, PageHero } from '../components/PageHero'
import { SERVICES } from '../data/content'
import { PAGES } from '../data/pages'
import { usePageMeta } from '../lib/page-meta'
import { Capabilities } from '../sections/Capabilities'
import { ServiceDetails } from '../sections/ServiceDetails'
import { Services } from '../sections/Services'

export default function ServicesPage() {
  usePageMeta(PAGES.services)
  return (
    <>
      <PageHero
        page="services"
        code="PG-02 / SVC"
        eyebrow="Services"
        title="Six disciplines."
        accent="One dispatch desk."
        lede="From the first load-board search to the last signed POD — the work that keeps a truck earning, handled by people who know your operation."
        actions={
          <>
            <ButtonLink href="/contact">Book a dispatch consult</ButtonLink>
            <ButtonLink href="/how-it-works" variant="ghost">
              How it works
            </ButtonLink>
          </>
        }
        aside={<HeroIndex items={SERVICES.slice(0, 4).map((s) => ({ label: s.title, href: `/services#${s.id}` }))} />}
      />
      <Capabilities />
      <Services index="01" />
      <ServiceDetails index="02" />
      <CtaBand title="Put the desk" accent="to work." />
    </>
  )
}
