import type { ImgHTMLAttributes } from 'react'
import type { Photo } from '../data/types'

type PictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height' | 'alt'> & {
  photo: Photo
  sizes: string
  /** Above-the-fold LCP image: eager + high priority. Everything else lazy-loads. */
  priority?: boolean
}

const srcSet = (photo: Photo, ext: 'avif' | 'webp') =>
  photo.widths.map((w) => `/media/${photo.src}-${w}.${ext} ${w}w`).join(', ')

/** AVIF with WebP fallback; intrinsic size is always set to prevent layout shift. */
export function Picture({ photo, sizes, priority = false, className, ...rest }: PictureProps) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(photo, 'avif')} sizes={sizes} />
      <img
        src={`/media/${photo.src}-${photo.widths[0]}.webp`}
        srcSet={srcSet(photo, 'webp')}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        className={className}
        {...rest}
      />
    </picture>
  )
}
