import { ButtonLink } from '../components/Button'
import { TbcTag } from '../components/Tbc'
import { SITE } from '../data/site'
import { usePageMeta } from '../lib/page-meta'

const COPY = {
  privacy: {
    title: 'Privacy Policy',
    intro:
      'This site does not use analytics, advertising trackers or cookies. Your theme preference is stored in your own browser only. The inquiry form does not send data to our servers — it opens your email app so you choose what to send.',
    sections: [
      'What information we collect when you contact us',
      'How we use and store carrier information',
      'Sharing with brokers and third parties',
      'Data retention and your rights',
    ],
  },
  terms: {
    title: 'Terms of Use',
    intro:
      'Content on this site is general information about our dispatch services. It is not an offer, contract or guarantee of loads, rates or revenue. Service terms are set out in a written dispatch agreement.',
    sections: ['Use of this website', 'Dispatch agreement terms', 'Fees and payment', 'Limitation of liability'],
  },
} as const

export default function Legal({ kind }: { kind: keyof typeof COPY }) {
  const page = COPY[kind]

  usePageMeta({ path: `/${kind}`, title: `${page.title} — Truckify`, description: page.intro })

  return (
    <section className="shell min-h-[80svh] pt-40 pb-28" aria-labelledby="legal-title">
      <p className="label mb-6 text-ink-faint">Legal</p>
      <h1 id="legal-title" className="text-mega font-semibold tracking-[-0.055em]">
        {page.title}
      </h1>
      <div className="mt-6 inline-flex items-center rounded-full border border-dashed border-accent-2/60 px-4 py-2 text-[0.85rem] text-accent-2">
        Draft — full policy to be supplied and reviewed by the business before launch.
        <TbcTag />
      </div>
      <p className="mt-12 max-w-2xl text-lede text-ink-muted">{page.intro}</p>
      <ol className="mt-12 max-w-2xl divide-y divide-line border-y border-line">
        {page.sections.map((s, i) => (
          <li key={s} className="flex items-baseline gap-6 py-5">
            <span className="label text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-[1.1rem]">{s}</span>
            <span className="label ml-auto text-ink-faint">Pending</span>
          </li>
        ))}
      </ol>
      <p className="mt-10 text-ink-muted">
        Questions in the meantime: <a className="text-ink underline underline-offset-4" href={`mailto:${SITE.email.value}`}>{SITE.email.value}</a>
      </p>
      <ButtonLink href="/" variant="glass" className="mt-12">
        Back to home
      </ButtonLink>
    </section>
  )
}
