import { ButtonLink } from '../components/Button'
import { CtaBand } from '../components/CtaBand'
import { PageHero } from '../components/PageHero'
import { PAGES } from '../data/pages'
import { usePageMeta } from '../lib/page-meta'
import { Faq } from '../sections/Faq'

export default function FaqPage() {
  usePageMeta(PAGES.faq)
  return (
    <>
      <PageHero
        page="faq"
        code="PG-06 / FAQ"
        eyebrow="FAQ"
        title="Fair questions."
        accent="Straight answers."
        lede="Pricing, agreements, load approval, equipment and what it takes to get started. Anything still marked TBC will be confirmed in writing."
        actions={<ButtonLink href="/contact">Ask us directly</ButtonLink>}
      />
      <Faq index="01" />
      <CtaBand title="Still" accent="wondering?" />
    </>
  )
}
