import { useEffect, useRef, useState } from 'react'

/**
 * Scroll-reveal hook — the Kudos-style "fade + rise as it enters the
 * viewport" effect. The visual transition lives in App.css under
 * `[data-reveal]`; this just toggles the `revealed` flag via
 * IntersectionObserver.
 *
 * Reveals once (the observer disconnects after the first intersection) so it
 * never re-hides when scrolled back past. Reduced-motion users — and any
 * environment without IntersectionObserver — start revealed, so nothing
 * depends on the observer firing.
 */

function revealImmediately(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true
  if (typeof IntersectionObserver === 'undefined') return true
  return false
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(options?: {
  /** 0–1 visible fraction before revealing. Default 0.15. */
  threshold?: number
  /** Bottom-margin so items reveal slightly before fully in view. */
  rootMargin?: string
}) {
  const ref = useRef<T | null>(null)
  // Compute the "show instantly" cases in the initializer so the effect never
  // calls setState synchronously (only the async observer callback does).
  const [revealed, setRevealed] = useState(revealImmediately)

  useEffect(() => {
    if (revealed) return
    const el = ref.current
    if (!el) return

    let io: IntersectionObserver | null = null

    // Fail-safe: the homepage scrolls inside a nested overflow container, and
    // an IntersectionObserver tied to the viewport can miss elements in some
    // browsers/timings. A short fallback timer guarantees a section can NEVER
    // stay stuck at opacity:0 (which renders as a blank band). The element
    // still animates in — it just isn't gated on the observer firing.
    const fallback = window.setTimeout(() => {
      setRevealed(true)
      io?.disconnect()
    }, 900)

    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.clearTimeout(fallback)
            setRevealed(true)
            io?.disconnect()
          }
        }
      },
      {
        // threshold 0 → reveal as soon as any sliver enters; robust for tall
        // sections that never reach a higher visible fraction.
        threshold: options?.threshold ?? 0,
        rootMargin: options?.rootMargin ?? '0px 0px -8% 0px',
      },
    )
    io.observe(el)

    return () => {
      window.clearTimeout(fallback)
      io?.disconnect()
    }
  }, [revealed, options?.threshold, options?.rootMargin])

  return { ref, revealed }
}
