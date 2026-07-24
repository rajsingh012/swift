import { useInView } from '../../../hooks/useInView'

function DigitRoll({
  digit,
  active,
  delay,
}: {
  digit: number
  active: boolean
  delay: number
}) {
  return (
    <span className="odometer-digit" aria-hidden="true">
      <span
        className="odometer-digit__strip"
        style={{
          transform: `translateY(-${(active ? digit : 0) * 10}%)`,
          transitionDelay: `${delay}ms`,
        }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} className="odometer-digit__cell">
            {n}
          </span>
        ))}
      </span>
    </span>
  )
}

/**
 * Rolling-digit odometer. Renders `value` as-is (commas, symbols, units) but
 * animates each 0-9 digit rolling up from 0 to its target when in view.
 */
export function Odometer({
  value,
  className,
}: {
  value: string
  className?: string
}) {
  const [ref, inView] = useInView<HTMLSpanElement>()
  let digitIndex = 0

  return (
    <span ref={ref} className={className} aria-label={value}>
      {value.split('').map((ch, i) => {
        if (/\d/.test(ch)) {
          const delay = digitIndex * 90
          digitIndex += 1
          return (
            <DigitRoll key={i} digit={Number(ch)} active={inView} delay={delay} />
          )
        }
        return (
          <span key={i} aria-hidden="true">
            {ch}
          </span>
        )
      })}
    </span>
  )
}
