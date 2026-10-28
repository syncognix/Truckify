import { CtaBand } from '../components/CtaBand'
import { PAGES } from '../data/pages'
import { usePageMeta } from '../lib/page-meta'
import { Capabilities } from '../sections/Capabilities'
import { Faq } from '../sections/Faq'
import { Gallery } from '../sections/Gallery'
import { Hero } from '../sections/Hero'
import { Process } from '../sections/Process'
import { Services } from '../sections/Services'
import { Testimonials } from '../sections/Testimonials'
import { WhyUs } from '../sections/WhyUs'

/** The overview: one taste of each page, each ending in a link deeper in. */
export default function Home() {
  usePageMeta(PAGES.home)
  return (
    <>
      <Hero />
      <Capabilities />
      <Services index="01" moreLink />
      <Process index="02" compact />
      <WhyUs index="03" compact />
      <Gallery index="04" />
      <Testimonials />
      <Faq index="05" limit={4} />
      <CtaBand />
    </>
  )
}
