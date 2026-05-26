import { forwardRef } from 'react'
import { FLOATING_PLACEHOLDER } from './Input.constants'
import { useInputContext } from './Input.context'
import { cx, fieldClasses } from './Input.styles'
import type { InputFieldProps } from './Input.types'

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(props, ref) {
    const ctx = useInputContext()
    const {
      id,
      className,
      placeholder,
      'aria-describedby': describedByProp,
      ...rest
    } = props

    // Floating labels rely on the CSS :placeholder-shown selector, which only
    // matches when an actual placeholder exists. We inject a single space when
    // the consumer didn't supply one so the float animation works for empty
    // fields too.
    const effectivePlaceholder =
      ctx.labelPlacement === 'floating' && placeholder == null
        ? FLOATING_PLACEHOLDER
        : placeholder

    // Build aria-describedby from any helper/error ids plus consumer-provided.
    const describedBy =
      [
        ctx.hasHelperText ? ctx.helperTextId : '',
        ctx.hasErrorMessage ? ctx.errorMessageId : '',
        describedByProp ?? '',
      ]
        .filter(Boolean)
        .join(' ') || undefined

    return (
      <input
        ref={ref}
        id={(id ?? ctx.id) || undefined}
        placeholder={effectivePlaceholder}
        disabled={ctx.disabled || rest.disabled}
        readOnly={ctx.readOnly || rest.readOnly}
        required={ctx.required || rest.required}
        aria-invalid={ctx.invalid || undefined}
        aria-required={ctx.required || undefined}
        aria-describedby={describedBy}
        className={cx(fieldClasses, className)}
        {...rest}
      />
    )
  },
)

InputField.displayName = 'Input.Field'
