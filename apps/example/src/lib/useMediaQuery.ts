import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query. SSR-safe (defaults to `false` until the
 * client mounts) so it can drive responsive component props like the Sheet's
 * `side` / `modal`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** Tailwind `md` breakpoint (768px). True on tablet/desktop widths. */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)')
}
