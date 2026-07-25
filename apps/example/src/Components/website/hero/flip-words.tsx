import {
  type CSSProperties,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

type FlipWordsProps = {
  /** Words to cycle through, in order. */
  words: string[]
  /** Seconds each word stays on screen before flipping to the next. */
  interval?: number
  /** Text colour of the animated word. */
  color?: string
  /** Pill background behind the animated word ('transparent' drops the pill). */
  background?: string
  className?: string
  style?: CSSProperties
}

/**
 * Cycles through `words` with a vertical flip (flip in from the top, hold, then
 * slide up and fade out). The wrapper sizes itself to the *active* word so the
 * surrounding sentence tightens around whichever word is showing rather than
 * reserving a fixed slot for the widest one.
 */
function FlipWords({
  words,
  interval = 2.5,
  color = '#2482ff',
  background = 'transparent',
  className,
  style,
}: FlipWordsProps) {
  const count = words.length
  const [index, setIndex] = useState(0)
  const [prev, setPrev] = useState(-1)
  const [widths, setWidths] = useState<number[]>([])
  const indexRef = useRef(0)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])

  // Measure each word so the wrapper can size (and tween) to the active one.
  useLayoutEffect(() => {
    indexRef.current = 0
    setIndex(0)
    setPrev(-1)
    const measure = () =>
      setWidths(wordRefs.current.map((el) => el?.offsetWidth ?? 0))
    measure()
    // Re-measure once web fonts settle, which can change text metrics.
    document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [words])

  useEffect(() => {
    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduce || count <= 1) return
    const id = window.setInterval(() => {
      const cur = indexRef.current
      const next = (cur + 1) % count
      indexRef.current = next
      setPrev(cur)
      setIndex(next)
    }, interval * 1000)
    return () => window.clearInterval(id)
  }, [count, interval])

  const activeWidth = widths[index]
  const pad = background === 'transparent' ? '0' : '0.06em 0.2em'

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'baseline',
        width: activeWidth != null ? `${activeWidth}px` : undefined,
        transition: 'width 0.5s ease',
        ...style,
      }}
    >
      {/* Zero-width in-flow strut keeps the inline-block aligned to the
          surrounding text's baseline (all the words are absolute overlays). */}
      <span aria-hidden style={{ display: 'inline-block', width: 0 }}>
        {'​'}
      </span>
      {words.map((word, i) => {
        const isActive = i === index
        const isPrev = i === prev && i !== index
        return (
          <span
            key={word}
            ref={(el) => {
              wordRefs.current[i] = el
            }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              whiteSpace: 'nowrap',
              color,
              background,
              padding: pad,
              borderRadius: '0.2em',
              opacity: isActive ? 1 : 0,
              transform: isActive
                ? 'rotateX(0deg) translateY(0)'
                : isPrev
                  ? 'translateY(-90px)'
                  : 'rotateX(-180deg)',
              transition: 'transform 0.5s ease, opacity 0.5s ease',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            {word}
          </span>
        )
      })}
    </span>
  )
}

export default FlipWords
