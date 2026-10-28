import { ButtonLink } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { PAGES } from '../data/pages'
import { usePageMeta } from '../lib/page-meta'
import { Gallery } from '../sections/Gallery'
import { Testimonials } from '../sections/Testimonials'
import { WhyUs } from '../sections/WhyUs'

export default function AboutPage() {
  usePageMeta(PAGES.about)
  return (
    <>
      <PageHero
        page="about"
        code="PG-05 / ABT"
        eyebrow="Why Truckify"
        title="Dispatch, done"
        accent="like a partner."
        lede="Our starting point is simple: the person running your truck’s schedule should know your truck. Everything else follows from that."
        actions={
          <>
            <ButtonLink href="/contact">Meet the desk</ButtonLink>
            <ButtonLink href="/about#why" variant="ghost">
              Our principles
            </ButtonLink>
          </>
        }
      />
      <WhyUs index="01" />
      <Gallery index="02" />
      <Testimonials />
      <CtaBand />
    </>
  )
}
