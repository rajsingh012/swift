import { useEffect, useRef, useState } from 'react'

/**
 * Tracks how far an element has travelled through the viewport as the page
 * scrolls. Returns a value from 0 (element just entering from the bottom) to
 * 1 (element has scrolled past the top). Useful for scroll-linked reveals.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let raf = 0

    const compute = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      // 0 while the element's top is at (or below) the top of the viewport,
      // growing to 1 as it scrolls one full element-height past the top.
      const next = Math.min(Math.max(-rect.top / rect.height, 0), 1)
      setProgress(next)
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return [ref, progress] as const
}
