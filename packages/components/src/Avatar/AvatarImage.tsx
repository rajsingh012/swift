import {
  forwardRef,
  useEffect,
  useRef,
  type SyntheticEvent,
} from 'react'
import { useAvatarContext } from './Avatar.context'
import { cx, imageClasses } from './Avatar.styles'
import type { AvatarImageProps } from './Avatar.types'

/**
 * `<img>` with onLoad/onError that publishes the loading lifecycle to
 * the surrounding `<Avatar>` via context. The Fallback subscribes to
 * the same state to decide when to render.
 *
 * Reports `loading` on mount (or when `src` changes), then `loaded` /
 * `error` via the native events. If the image was cached and fires
 * before React attaches the handler, the imperative re-check in the
 * effect catches it — covers the SSR-hydration case where the browser
 * already decoded the image by the time React runs.
 */
export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  function AvatarImage({ className, src, alt, onLoad, onError, ...rest }, ref) {
    const { setImageState } = useAvatarContext()
    const imgRef = useRef<HTMLImageElement | null>(null)

    const setRefs = (node: HTMLImageElement | null) => {
      imgRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    // Reset to `loading` whenever src changes; the native onLoad / onError
    // will flip us to loaded / error.
    useEffect(() => {
      if (!src) {
        setImageState('idle')
        return
      }
      setImageState('loading')
      // Cached-image case: the browser may have already decoded by the
      // time React attaches handlers. `complete` + non-zero naturalWidth
      // means a successful load happened; zero width while complete
      // means error.
      const node = imgRef.current
      if (node && node.complete) {
        if (node.naturalWidth > 0) setImageState('loaded')
        else setImageState('error')
      }
    }, [src, setImageState])

    const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
      setImageState('loaded')
      onLoad?.(event)
    }

    const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
      setImageState('error')
      onError?.(event)
    }

    if (!src) return null

    return (
      <img
        ref={setRefs}
        src={src}
        alt={alt ?? ''}
        onLoad={handleLoad}
        onError={handleError}
        className={cx(imageClasses, className)}
        {...rest}
      />
    )
  },
)
AvatarImage.displayName = 'Avatar.Image'
