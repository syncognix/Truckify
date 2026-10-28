import { CtaBand } from '../components/CtaBand'
import { PAGES } from '../data/pages'
import { usePageMeta } from '../lib/page-meta'
import { Capabilities } from '../sections/Capabilities'
import { Faq } from '../sections/Faq'
import { Gallery } from '../sections/Gallery'
import { Hero } from '../sections/Hero'
import { HoursClock } from '../sections/HoursClock'
import { Manifesto } from '../sections/Manifesto'
import { Process } from '../sections/Process'
import { Services } from '../sections/Services'
import { Testimonials } from '../sections/Testimonials'
import { TypeRibbons } from '../sections/TypeRibbons'
import { WhyUs } from '../sections/WhyUs'

/** The overview: one taste of each page, each ending in a link deeper in. */
export default function Home() {
  usePageMeta(PAGES.home)
  return (
    <>
      <Hero />
      <Capabilities />
      <Manifesto />
      <Services index="01" moreLink />
      <TypeRibbons />
      <Process index="02" compact />
      <HoursClock index="03" />
      <WhyUs index="04" compact />
      <Gallery index="05" />
      <Testimonials />
      <Faq index="06" limit={4} />
      <CtaBand />
    </>
  )
}
