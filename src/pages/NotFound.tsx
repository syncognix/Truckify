import { ButtonLink } from '../components/Button'
import { usePageMeta } from '../lib/page-meta'

export default function NotFound() {
  usePageMeta({ title: 'Off route — Truckify', description: 'This page could not be found.' })

  return (
    <section className="shell flex min-h-[90svh] flex-col justify-center pt-32 pb-20" aria-labelledby="nf-title">
      <p className="label text-ink-faint">Error 404 · Off route</p>
      <h1 id="nf-title" className="mt-6 text-display font-semibold tracking-[-0.06em]">
        <span className="glitch inline-block" tabIndex={-1}>
          Wrong exit.
        </span>
      </h1>
      <p className="mt-8 max-w-md text-lede text-ink-muted">
        This page isn’t on the map. Let’s get you back on the lane.
      </p>
      <ButtonLink href="/" className="mt-10 self-start">
        Return to dispatch
      </ButtonLink>
    </section>
  )
}
