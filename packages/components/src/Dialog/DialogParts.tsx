import { forwardRef, useEffect } from 'react'
import { useDialog } from './Dialog.context'
import {
  bodyClasses,
  cx,
  descriptionClasses,
  footerClasses,
  headerClasses,
  titleClasses,
} from './Dialog.styles'
import type {
  DialogBodyProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogTitleProps,
} from './Dialog.types'

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  function DialogHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(headerClasses, className)} {...rest} />
  },
)
DialogHeader.displayName = 'Dialog.Header'

export const DialogBody = forwardRef<HTMLDivElement, DialogBodyProps>(
  function DialogBody({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(bodyClasses, className)} {...rest} />
  },
)
DialogBody.displayName = 'Dialog.Body'

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  function DialogFooter({ className, ...rest }, ref) {
    return <div ref={ref} className={cx(footerClasses, className)} {...rest} />
  },
)
DialogFooter.displayName = 'Dialog.Footer'

export const DialogTitle = forwardRef<HTMLHeadingElement, DialogTitleProps>(
  function DialogTitle({ as: Tag = 'h2', className, ...rest }, ref) {
    const { titleId, setHasTitle } = useDialog('Dialog.Title')
    useEffect(() => {
      setHasTitle(true)
      return () => setHasTitle(false)
    }, [setHasTitle])
    return (
      <Tag ref={ref} id={titleId} className={cx(titleClasses, className)} {...rest} />
    )
  },
)
DialogTitle.displayName = 'Dialog.Title'

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  DialogDescriptionProps
>(function DialogDescription({ className, ...rest }, ref) {
  const { descriptionId, setHasDescription } = useDialog('Dialog.Description')
  useEffect(() => {
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription])
  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cx(descriptionClasses, className)}
      {...rest}
    />
  )
})
DialogDescription.displayName = 'Dialog.Description'
