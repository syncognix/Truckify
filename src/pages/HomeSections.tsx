import { useEffect } from 'react'
import { CtaBand } from '../components/CtaBand'
import { ScrollTrigger } from '../lib/gsap'
import { Capabilities } from '../sections/Capabilities'
import { Faq } from '../sections/Faq'
import { Gallery } from '../sections/Gallery'
import { HoursClock } from '../sections/HoursClock'
import { Manifesto } from '../sections/Manifesto'
import { Process } from '../sections/Process'
import { Services } from '../sections/Services'
import { Testimonials } from '../sections/Testimonials'
import { TypeRibbons } from '../sections/TypeRibbons'
import { WhyUs } from '../sections/WhyUs'

/** Everything on Home below the hero — its own chunk so the hero paints without waiting on it. */
export default function HomeSections() {
  // These arrive after the route-level refresh in App, so re-measure once they've painted.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <>
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
