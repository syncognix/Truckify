import { LazyMotion, MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect, type ComponentType, type LazyExoticComponent } from 'react'
import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { ScrollProgress } from './components/ScrollProgress'
import { SiteCursor } from './components/SiteCursor'
import { SplashScreen } from './components/SplashScreen'
import { PAGES } from './data/pages'
import { ScrollTrigger } from './lib/gsap'
import { RouterProvider, useRouter } from './lib/router'
import { SmoothScrollProvider } from './lib/smooth-scroll'
import { ThemeProvider } from './lib/theme'
import Home from './pages/Home'

// Home ships in the entry bundle; every other page is its own chunk.
const ROUTES: Record<string, ComponentType | LazyExoticComponent<ComponentType>> = {
  [PAGES.home.path]: Home,
  [PAGES.services.path]: lazy(() => import('./pages/ServicesPage')),
  [PAGES.process.path]: lazy(() => import('./pages/HowItWorksPage')),
  [PAGES.lanes.path]: lazy(() => import('./pages/LanesPage')),
  [PAGES.about.path]: lazy(() => import('./pages/AboutPage')),
  [PAGES.faq.path]: lazy(() => import('./pages/FaqPage')),
  [PAGES.contact.path]: lazy(() => import('./pages/ContactPage')),
  '/privacy': lazy(() => import('./pages/Legal').then((m) => ({ default: () => <m.default kind="privacy" /> }))),
  '/terms': lazy(() => import('./pages/Legal').then((m) => ({ default: () => <m.default kind="terms" /> }))),
}
const NotFound = lazy(() => import('./pages/NotFound'))
const loadMotionFeatures = () => import('./lib/motion-features').then((mod) => mod.default)

function Routes() {
  const { path } = useRouter()
  const normalized = path.replace(/\/+$/, '') || '/'
  const Page = ROUTES[normalized] ?? NotFound

  // New page, new layout: re-measure every scroll trigger once it has painted.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [normalized])

  return (
    <main id="main" key={normalized}>
      <Suspense fallback={<div className="min-h-screen" />}>
        <Page />
      </Suspense>
    </main>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadMotionFeatures} strict>
        <ThemeProvider>
          <SmoothScrollProvider>
            <RouterProvider>
              <SplashScreen>
                <a
                  href="#main"
                  className="label fixed top-3 left-3 z-[80] -translate-y-20 rounded-full bg-accent px-4 py-3 text-accent-ink focus:translate-y-0"
                >
                  Skip to content
                </a>
                <Nav />
                <Routes />
                <Footer />
                <ScrollProgress />
                <div aria-hidden className="grain" />
              </SplashScreen>
              <SiteCursor />
            </RouterProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </LazyMotion>
    </MotionConfig>
  )
}
