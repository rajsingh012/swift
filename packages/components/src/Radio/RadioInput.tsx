import { forwardRef, useRef, type ChangeEvent } from 'react'
import { useRadioContext } from './Radio.context'
import {
  controlClasses,
  controlSizeClasses,
  cx,
  hiddenInputClasses,
} from './Radio.styles'
import { RadioIndicator } from './RadioIndicator'
import type { RadioInputProps } from './Radio.types'

/**
 * Renders the real `<input type="radio">` overlaid on a styled circle.
 * Clicking the circle delegates to the input (since the input fills it with
 * opacity:0). When all inputs in a RadioGroup share the same `name`, the
 * browser handles arrow-key navigation natively — Up/Down/Left/Right move
 * focus + selection, Tab moves focus past the group. No JS roving-tabindex
 * needed.
 */
export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  function RadioInput(props, forwardedRef) {
    const ctx = useRadioContext()
    const {
      className,
      onChange,
      children,
      id: idProp,
      name: nameProp,
      value: valueProp,
      'aria-describedby': describedByProp,
      'aria-labelledby': labelledByProp,
      ...rest
    } = props

    const innerRef = useRef<HTMLInputElement | null>(null)
    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef)
        (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node
    }

    const isChecked = ctx.checked

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event)
      if (ctx.readOnly || ctx.disabled) {
        // Native readOnly doesn't exist for radios — intercept and re-assert.
        event.preventDefault()
        const node = innerRef.current
        if (node) node.checked = isChecked
        return
      }
      ctx.onChange?.(event.target.checked)
    }

    const describedBy =
      [
        ctx.hasDescription ? ctx.descriptionId : '',
        ctx.hasErrorMessage ? ctx.errorMessageId : '',
        describedByProp ?? '',
      ]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <span
        data-state={isChecked ? 'checked' : 'unchecked'}
        data-disabled={ctx.disabled ? 'true' : 'false'}
        data-readonly={ctx.readOnly ? 'true' : 'false'}
        data-invalid={ctx.invalid ? 'true' : 'false'}
        className={cx(
          controlClasses(),
          controlSizeClasses[ctx.size],
          className,
        )}
      >
        <input
          ref={setRefs}
          type="radio"
          id={(idProp ?? ctx.id) || undefined}
          name={nameProp ?? ctx.name}
          value={valueProp ?? ctx.value}
          checked={isChecked}
          disabled={ctx.disabled}
          required={ctx.required}
          aria-checked={isChecked}
          aria-invalid={ctx.invalid || undefined}
          aria-required={ctx.required || undefined}
          aria-readonly={ctx.readOnly || undefined}
          aria-describedby={describedBy}
          aria-labelledby={labelledByProp}
          onChange={handleChange}
          className={hiddenInputClasses}
          {...rest}
        />
        {children ?? <RadioIndicator />}
      </span>
    )
  },
)

RadioInput.displayName = 'Radio.Input'
