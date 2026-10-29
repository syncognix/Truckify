import { PageHero } from '../components/PageHero'
import { FactText } from '../components/Tbc'
import { PAGES } from '../data/pages'
import { SITE } from '../data/site'
import { usePageMeta } from '../lib/page-meta'
import { Contact } from '../sections/Contact'

export default function ContactPage() {
  usePageMeta(PAGES.contact)
  return (
    <>
      <PageHero
        page="contact"
        code="PG-07 / CNT"
        eyebrow="Contact"
        title="Open road ahead."
        accent="Let’s talk."
        lede="A short, no-obligation intro call. Tell us about your truck below and we’ll set up a time that works around your driving."
        aside={
          <dl className="glass glass-sheen grid gap-4 rounded-panel p-5 text-[0.95rem]">
            <div>
              <dt className="label text-ink-faint">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${SITE.email.value}`} className="-my-1 inline-block py-1 hover:text-accent-text">
                  <FactText fact={SITE.email} />
                </a>
              </dd>
            </div>
            <div>
              <dt className="label text-ink-faint">Desk hours</dt>
              <dd className="mt-1">
                <FactText fact={SITE.hours} />
              </dd>
            </div>
          </dl>
        }
      />
      <Contact />
    </>
  )
}
