import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { useSmoothScroll } from './smooth-scroll'

/**
 * A deliberately tiny History-API router. The site has a handful of routes, so
 * a full routing library would cost more bytes than it saves.
 */
interface RouterValue {
  path: string
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterValue | null>(null)

function splitHref(href: string) {
  const [path, hash] = href.split('#')
  return { path: path || window.location.pathname, hash: hash ? `#${hash}` : '' }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname)
  const { scrollTo } = useSmoothScroll()

  // Lazy pages render a frame or more after navigation: wait (up to ~2s) for the anchor.
  const scrollWhenReady = useCallback(
    (hash: string, instant: boolean) => {
      let tries = 0
      const attempt = () => {
        if (document.querySelector(hash)) scrollTo(hash, instant)
        else if (++tries < 120) requestAnimationFrame(attempt)
      }
      requestAnimationFrame(attempt)
    },
    [scrollTo],
  )

  useEffect(() => {
    if (window.location.hash.length > 1) scrollWhenReady(window.location.hash, true)
  }, [scrollWhenReady])

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback(
    (to: string) => {
      const target = splitHref(to)
      const samePage = target.path === window.location.pathname

      if (samePage && target.hash) {
        window.history.pushState(null, '', target.path + target.hash)
        scrollTo(target.hash)
        return
      }
      window.history.pushState(null, '', target.path + target.hash)
      setPath(target.path)
      scrollTo(0, true)
      if (target.hash) scrollWhenReady(target.hash, false)
    },
    [scrollTo, scrollWhenReady],
  )

  const value = useMemo(() => ({ path, navigate }), [path, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>')
  return ctx
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** Internal link: real `href` for crawlers and new tabs, client-side navigation on click. */
export function Link({ href, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      rest.target === '_blank'
    ) {
      return
    }
    event.preventDefault()
    navigate(href)
  }

  return <a href={href} onClick={handleClick} {...rest} />
}
