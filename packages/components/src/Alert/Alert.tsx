import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { usePresence } from '../internal/overlay'
import { useControllableState } from '../internal/state'
import {
  ALERT_ROLE_VARIANTS,
  DEFAULT_APPEARANCE,
  DEFAULT_SIZE,
  DEFAULT_VARIANT,
} from './Alert.constants'
import { AlertContext, type AlertContextValue } from './Alert.context'
import {
  cx,
  rootAppearanceClasses,
  rootClasses,
  rootSizeClasses,
  rootVariantClasses,
} from './Alert.styles'
import type { AlertProps } from './Alert.types'
import { AlertActions } from './AlertActions'
import { AlertClose } from './AlertClose'
import { AlertContent } from './AlertContent'
import { AlertDescription } from './AlertDescription'
import { AlertIcon } from './AlertIcon'
import { AlertTitle } from './AlertTitle'

/** Components recognised as compound children. When any direct child of
 *  <Alert> is one of these, the auto-composed default layout is skipped
 *  and the children render as-is. */
const COMPOUND_PARTS = new Set<unknown>([
  AlertIcon,
  AlertContent,
  AlertTitle,
  AlertDescription,
  AlertActions,
  AlertClose,
])

function hasCompoundChildren(children: ReactNode): boolean {
  let found = false
  Children.forEach(children, (child) => {
    if (isValidElement(child) && COMPOUND_PARTS.has(child.type)) {
      found = true
    }
  })
  return found
}

/**
 * Inline Alert / banner.
 *
 * Two usage modes, picked automatically:
 *
 * 1. **Convenience** — children are plain text / JSX, title / icon /
 *    actions / dismissible come in as props. The default layout
 *    composes Icon + Content (Title + Description) + Actions + Close.
 *
 *        <Alert variant="success" title="Saved" dismissible>
 *          Your changes are live.
 *        </Alert>
 *
 * 2. **Compound** — any direct child is a recognised part (`<Alert.Icon>`,
 *    `<Alert.Title>`, etc.). The default layout is skipped; the children
 *    render as-is so you can structure the alert however you need.
 *
 *        <Alert variant="error" open={open} onOpenChange={setOpen}>
 *          <Alert.Icon />
 *          <Alert.Content>
 *            <Alert.Title>Payment failed</Alert.Title>
 *            <Alert.Description>Please try another card.</Alert.Description>
 *          </Alert.Content>
 *          <Alert.Actions><Button size="sm">Retry</Button></Alert.Actions>
 *          <Alert.Close />
 *        </Alert>
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  forwardedRef,
) {
  const {
    variant = DEFAULT_VARIANT,
    size = DEFAULT_SIZE,
    appearance = DEFAULT_APPEARANCE,
    open: openProp,
    defaultOpen = true,
    onOpenChange,
    dismissible: dismissibleProp,
    role: roleProp,
    title,
    icon,
    actions,
    classes,
    className,
    children,
    ...rest
  } = props

  const [open, setOpen] = useControllableState(openProp, defaultOpen, onOpenChange)

  // Implicitly dismissible when controlled (consumer is wiring up the
  // close path), explicitly when `dismissible` is set. Otherwise the
  // alert is sticky — Alert.Close renders nothing.
  const dismissible =
    dismissibleProp ?? (openProp !== undefined || onOpenChange !== undefined)

  // Keep mounted while the exit animation plays. usePresence flips
  // `mounted` to false after `animationend` (or the safety timeout)
  // once `open` goes false.
  const nodeRef = useRef<HTMLDivElement | null>(null)
  const mounted = usePresence(open, nodeRef)

  const setNodeRef = useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) forwardedRef.current = node
    },
    [forwardedRef],
  )

  const reactId = useId()
  const id = `swift-alert-${reactId}`
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  const close = useCallback(() => setOpen(false), [setOpen])

  // Derive ARIA role from variant unless overridden. `error` → assertive
  // alert; everything else → polite status. Matches the spec.
  const role = roleProp ?? (ALERT_ROLE_VARIANTS.has(variant) ? 'alert' : 'status')

  const ctx = useMemo<AlertContextValue>(
    () => ({
      id,
      titleId,
      descriptionId,
      variant,
      size,
      appearance,
      open,
      dismissible,
      close,
    }),
    [
      id,
      titleId,
      descriptionId,
      variant,
      size,
      appearance,
      open,
      dismissible,
      close,
    ],
  )

  if (!mounted) return null

  const useCompound = hasCompoundChildren(children)
  const hasTitle = title !== undefined && title !== null && title !== false
  const hasBody = children !== undefined && children !== null && children !== false

  return (
    <AlertContext.Provider value={ctx}>
      <div
        ref={setNodeRef}
        id={id}
        role={role}
        aria-live={role === 'alert' ? 'assertive' : 'polite'}
        aria-labelledby={hasTitle || useCompound ? titleId : undefined}
        aria-describedby={hasBody || useCompound ? descriptionId : undefined}
        data-variant={variant}
        data-size={size}
        data-appearance={appearance}
        data-state={open ? 'open' : 'closed'}
        data-dismissible={dismissible ? 'true' : 'false'}
        className={cx(
          rootClasses,
          rootVariantClasses[variant],
          rootAppearanceClasses[appearance],
          rootSizeClasses[size],
          className,
          classes?.root,
        )}
        {...rest}
      >
        {useCompound ? (
          children
        ) : (
          <>
            {/* Icon — variant-driven default unless explicitly null. */}
            {icon !== null ? (
              <AlertIcon className={classes?.icon}>{icon}</AlertIcon>
            ) : null}

            {/* Body — Title + Description stacked. */}
            <AlertContent className={classes?.content}>
              {hasTitle ? (
                <AlertTitle className={classes?.title}>{title}</AlertTitle>
              ) : null}
              {hasBody ? (
                <AlertDescription className={classes?.description}>
                  {children}
                </AlertDescription>
              ) : null}
            </AlertContent>

            {/* Actions — slot for buttons. Renders nothing when empty. */}
            {actions ? (
              <AlertActions className={classes?.actions}>{actions}</AlertActions>
            ) : null}

            {/* Close — Alert.Close itself renders nothing when not dismissible. */}
            <AlertClose className={classes?.close} />
          </>
        )}
      </div>
    </AlertContext.Provider>
  )
})
Alert.displayName = 'Alert'
