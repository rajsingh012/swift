import {
  forwardRef,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
} from 'react'
import { cx } from './Card.styles'

export interface CardMediaProps extends HTMLAttributes<HTMLDivElement> {
  /** Image URL. Renders an `<img>` inside the media wrapper. */
  src?: string
  /** Required when `src` is set — describes the image for assistive tech. */
  alt?: string
  /** Aspect ratio for the media frame (e.g. `16 / 9`, `4 / 3`). */
  aspectRatio?: number | string
  /** CSS object-fit on the rendered `<img>`. Defaults to `cover`. */
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  /** Pass-through props for the underlying `<img>` (loading, sizes, srcSet, etc.). */
  imgProps?: ImgHTMLAttributes<HTMLImageElement>
  children?: ReactNode
}

/**
 * Media slot. Sits flush to the Card edges (no padding) so images
 * occupy the full width. Pass `src` to render an `<img>`, or drop in
 * any node (video, iframe, custom canvas) as children.
 */
export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(
  function CardMedia(
    {
      src,
      alt,
      aspectRatio,
      fit = 'cover',
      imgProps,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) {
    const mergedStyle: React.CSSProperties = {
      ...(aspectRatio !== undefined ? { aspectRatio: String(aspectRatio) } : {}),
      ...style,
    }

    return (
      <div
        ref={ref}
        className={cx(
          'relative block w-full overflow-hidden bg-surface-muted',
          className,
        )}
        style={mergedStyle}
        {...rest}
      >
        {src ? (
          <img
            src={src}
            alt={alt ?? ''}
            loading="lazy"
            decoding="async"
            {...imgProps}
            className={cx('h-full w-full', imgProps?.className)}
            style={{ objectFit: fit, ...imgProps?.style }}
          />
        ) : (
          children
        )}
      </div>
    )
  },
)
