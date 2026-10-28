import { useEffect } from 'react'
import type { PageMeta } from '../data/pages'
import { SITE } from '../data/site'

function setMeta(selector: string, attr: 'content' | 'href', value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

/** Per-route title, description, canonical and Open Graph tags. */
export function usePageMeta({ path, title, description }: Pick<PageMeta, 'title' | 'description'> & { path?: string }) {
  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    if (path) {
      const url = SITE.url + path
      setMeta('link[rel="canonical"]', 'href', url)
      setMeta('meta[property="og:url"]', 'content', url)
    }
  }, [path, title, description])
}
