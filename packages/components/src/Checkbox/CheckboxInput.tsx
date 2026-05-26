import { forwardRef, useEffect, useRef, type ChangeEvent } from 'react'
import { useCheckboxContext } from './Checkbox.context'
import {
  controlClasses,
  controlSizeClasses,
  cx,
  hiddenInputClasses,
} from './Checkbox.styles'
import { CheckboxIndicator } from './CheckboxIndicator'
import type { CheckboxInputProps } from './Checkbox.types'

/**
 * Renders the real `<input type="checkbox">` overlaid on a styled box.
 * Clicking the box delegates to the input (since the input fills it with
 * opacity:0), which preserves native form submission, keyboard activation
 * (Space), and screen-reader semantics.
 */
export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  function CheckboxInput(props, forwardedRef) {
    const ctx = useCheckboxContext()
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

    // The indeterminate flag is a DOM property, not a reflected attribute,
    // so we mirror ctx.checked === 'indeterminate' onto the element each
    // render. Native form data still serialises as "checked" / unchecked.
    useEffect(() => {
      const node = innerRef.current
      if (!node) return
      node.indeterminate = ctx.checked === 'indeterminate'
    }, [ctx.checked])

    const isChecked = ctx.checked === true
    const isIndeterminate = ctx.checked === 'indeterminate'

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event)
      if (ctx.readOnly) {
        // Native readOnly doesn't apply to checkboxes, so re-assert the
        // current visual state and bail out before notifying the parent.
        event.preventDefault()
        const node = innerRef.current
        if (node) node.checked = isChecked
        return
      }
      ctx.onCheckedChange?.(event.target.checked)
    }

    const describedBy =
      [
        ctx.hasDescription ? ctx.descriptionId : '',
        ctx.hasErrorMessage ? ctx.errorMessageId : '',
        describedByProp ?? '',
      ]
        .filter(Boolean)
        .join(' ') || undefined

    const dataState = isIndeterminate
      ? 'indeterminate'
      : isChecked
        ? 'checked'
        : 'unchecked'

    return (
      <span
        data-state={dataState}
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
          type="checkbox"
          id={(idProp ?? ctx.id) || undefined}
          name={nameProp ?? ctx.name}
          value={valueProp ?? ctx.value}
          checked={isChecked}
          disabled={ctx.disabled}
          required={ctx.required}
          aria-checked={isIndeterminate ? 'mixed' : isChecked}
          aria-invalid={ctx.invalid || undefined}
          aria-required={ctx.required || undefined}
          aria-readonly={ctx.readOnly || undefined}
          aria-describedby={describedBy}
          aria-labelledby={labelledByProp}
          onChange={handleChange}
          className={hiddenInputClasses}
          {...rest}
        />
        {children ?? <CheckboxIndicator />}
      </span>
    )
  },
)

CheckboxInput.displayName = 'Checkbox.Input'
