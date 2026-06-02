import { forwardRef, useEffect, useRef } from 'react'
import { mergeRefs } from '../internal/refs'
import { useControllableState } from '../internal/state'
import type { YearPickerProps } from './YearPicker.types'

const DEFAULT_WINDOW = 50

function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}

/**
 * Visual year picker — a scrollable column where the selected year is
 * large + bold, adjacent years are smaller and muted, and far years
 * fade out by distance. Click a year to select it; scroll keeps the
 * selection centred.
 *
 *   <YearPicker defaultValue={2024} onValueChange={(y) => …} />
 */
export const YearPicker = forwardRef<HTMLDivElement, YearPickerProps>(
  function YearPicker(props, ref) {
    const {
      value: valueProp,
      defaultValue,
      onValueChange,
      min,
      max,
      disabled = false,
      name,
      form,
      required,
      label = 'Year',
      className,
      ...rest
    } = props

    const currentYear = new Date().getFullYear()
    const [value, setValue] = useControllableState<number>(
      valueProp,
      defaultValue ?? currentYear,
      onValueChange,
    )

    const lo = min ?? currentYear - DEFAULT_WINDOW
    const hi = max ?? currentYear + 10
    const years = (() => {
      const out: number[] = []
      for (let y = lo; y <= hi; y++) out.push(y)
      return out
    })()

    // Scroll selected year to the centre on mount + when value changes.
    const listRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
      const container = listRef.current
      if (!container) return
      const target = container.querySelector<HTMLElement>(`[data-year="${value}"]`)
      if (!target) return
      const containerHeight = container.clientHeight
      container.scrollTop =
        target.offsetTop - containerHeight / 2 + target.offsetHeight / 2
    }, [value])

    // Distance from selected → drives the visual hierarchy.
    const distanceClasses = (distance: number): string => {
      if (distance === 0)
        return 'text-3xl font-bold text-content-strong'
      if (distance === 1)
        return 'text-xl font-semibold text-content'
      if (distance === 2)
        return 'text-base text-content-muted'
      return 'text-sm text-content-muted/50'
    }

    return (
      <div
        ref={ref}
        className={cx(
          'swift-yearpicker inline-flex flex-col items-stretch ' +
            'rounded-2xl border border-stroke bg-surface-elevated shadow-(--shadow-level3) ' +
            'min-w-[10rem]',
          className,
        )}
        {...rest}
      >
        <div className="text-center text-base font-semibold text-content-strong px-4 pt-4 pb-2 border-b border-stroke-muted">
          {label}
        </div>
        <div
          ref={mergeRefs(listRef)}
          role="listbox"
          aria-label={label}
          aria-disabled={disabled || undefined}
          className="flex flex-col items-center gap-1 overflow-y-auto py-4 max-h-[18rem] scroll-smooth"
        >
          {years.map((year) => {
            const isSelected = year === value
            const distance = Math.abs(year - value)
            return (
              <button
                key={year}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={disabled}
                data-year={year}
                data-selected={isSelected ? 'true' : undefined}
                onClick={() => setValue(year)}
                className={cx(
                  'inline-flex items-center justify-center min-w-[6rem] py-1 px-3 ' +
                    'rounded-md tabular-nums leading-tight cursor-pointer outline-none ' +
                    'transition-all duration-150 ' +
                    'hover:text-content-strong hover:bg-surface-muted ' +
                    'focus-visible:ring-2 focus-visible:ring-stroke-brand/30 ' +
                    'disabled:cursor-not-allowed disabled:opacity-40',
                  distanceClasses(distance),
                )}
              >
                {year}
              </button>
            )
          })}
        </div>
        {name ? (
          <input
            type="hidden"
            name={name}
            value={String(value)}
            form={form}
            required={required}
          />
        ) : null}
      </div>
    )
  },
)
YearPicker.displayName = 'YearPicker'
