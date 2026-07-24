import { type CSSProperties } from 'react'

type RGB = [number, number, number]

type ScrollRevealTextProps = {
  text: string
  /** Raw scroll progress (0–1) from useScrollProgress. */
  progress: number
  /** Colour of a word before the sweep reaches it. */
  baseColor?: RGB
  /** Colour of a word once the sweep has passed it. */
  activeColor?: RGB
  /** Portion of the raw progress over which the sweep plays out. */
  start?: number
  end?: number
  className?: string
  style?: CSSProperties
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function ScrollRevealText({
  text,
  progress,
  // Fully readable white at rest…
  baseColor = [255, 255, 255],
  // …sweeping into the brand colour as you scroll.
  activeColor = [0, 189, 255],
  start = 0,
  end = 1,
  className,
  style,
}: ScrollRevealTextProps) {
  const words = text.split(' ')

  // Remap the raw progress into the [start, end] window.
  const fill = Math.min(Math.max((progress - start) / (end - start), 0), 1)

  return (
    <span className={className} style={style}>
      {words.map((word, i) => {
        // Each word transitions in turn, left → right. Always full opacity.
        const t = Math.min(Math.max(fill * words.length - i, 0), 1)
        const r = Math.round(lerp(baseColor[0], activeColor[0], t))
        const g = Math.round(lerp(baseColor[1], activeColor[1], t))
        const b = Math.round(lerp(baseColor[2], activeColor[2], t))
        return (
          <span
            key={i}
            style={{
              color: `rgb(${r}, ${g}, ${b})`,
              transition: 'color 120ms linear',
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </span>
  )
}

export default ScrollRevealText
