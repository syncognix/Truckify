import { useEffect, useRef, useState } from 'react'
import type { HeroClip } from '../data/pages'

const poster = (name: string, ext: 'avif' | 'webp') =>
  `/media/video/${name}-poster-854.${ext} 854w, /media/video/${name}-poster-1280.${ext} 1280w`

interface HeroVideoProps {
  clip: HeroClip
  /** Classes for the media layer (the parallax target sits behind the shade stack). */
  className?: string
}

/**
 * Cinematic background loop. The poster is the LCP image (eager, preloaded
 * from index.html); the video is attached only after first paint, sized to
 * the viewport, paused off-screen, and skipped entirely for reduced motion
 * or Save-Data.
 */
export function HeroVideo({ clip, className = '' }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
    if (reduce || saveData) return
    // Defer the download until the page has painted and settled.
    const start = () => setEnabled(true)
    const idle = window.requestIdleCallback?.(start, { timeout: 1500 }) ?? window.setTimeout(start, 600)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!enabled || !video) return
    video.src = `/media/video/${clip.name}-${window.innerWidth < 768 ? 480 : 720}.mp4`

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    io.observe(video)
    return () => {
      io.disconnect()
      video.pause()
    }
  }, [enabled, clip.name])

  return (
    <div data-hero-media className={`absolute inset-0 -z-20 overflow-hidden will-change-transform ${className}`}>
      <picture>
        <source type="image/avif" srcSet={poster(clip.name, 'avif')} sizes="100vw" />
        <img
          src={`/media/video/${clip.name}-poster-1280.webp`}
          srcSet={poster(clip.name, 'webp')}
          sizes="100vw"
          width={1280}
          height={720}
          alt={clip.alt}
          fetchPriority="high"
          decoding="sync"
          className="video-tone absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      {enabled && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className={`video-tone absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.4s] ease-out-expo ${
            playing ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  )
}
