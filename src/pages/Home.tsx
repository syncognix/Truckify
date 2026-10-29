import { lazy, Suspense } from 'react'
import { PAGES } from '../data/pages'
import { usePageMeta } from '../lib/page-meta'
import { Hero } from '../sections/Hero'

// Requested at module load so the chunk downloads in parallel with the hero's first render.
const sections = import('./HomeSections')
const HomeSections = lazy(() => sections)

/** The overview: one taste of each page, each ending in a link deeper in. */
export default function Home() {
  usePageMeta(PAGES.home)
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="min-h-screen" />}>
        <HomeSections />
      </Suspense>
    </>
  )
}
