import { forwardRef, type ReactNode } from 'react'
import { Slot } from '../internal/Slot'
import { useBreadcrumb } from './Breadcrumb.context'
import {
  cx,
  ellipsisClasses,
  itemClasses,
  linkClasses,
  listClasses,
  pageClasses,
  separatorClasses,
  sizeClasses,
} from './Breadcrumb.styles'
import type {
  BreadcrumbEllipsisProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
} from './Breadcrumb.types'

/** The ordered list wrapping the trail. */
export const BreadcrumbList = forwardRef<HTMLOListElement, BreadcrumbListProps>(
  function BreadcrumbList({ className, ...rest }, ref) {
    const { size } = useBreadcrumb('Breadcrumb.List')
    return (
      <ol
        ref={ref}
        className={cx(listClasses, sizeClasses[size], className)}
        {...rest}
      />
    )
  },
)
BreadcrumbList.displayName = 'Breadcrumb.List'

/** A single crumb wrapper (`<li>`). */
export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ className, ...rest }, ref) {
    return <li ref={ref} className={cx(itemClasses, className)} {...rest} />
  },
)
BreadcrumbItem.displayName = 'Breadcrumb.Item'

/** A navigable crumb. Use `asChild` to render a framework `<Link>`. */
export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink({ asChild = false, className, children, ...rest }, ref) {
    if (asChild) {
      return (
        <Slot ref={ref as never} className={cx(linkClasses, className)} {...rest}>
          {children as ReactNode}
        </Slot>
      )
    }
    return (
      <a ref={ref} className={cx(linkClasses, className)} {...rest}>
        {children}
      </a>
    )
  },
)
BreadcrumbLink.displayName = 'Breadcrumb.Link'

/** The current page — the last crumb. Not a link; `aria-current="page"`. */
export const BreadcrumbPage = forwardRef<HTMLSpanElement, BreadcrumbPageProps>(
  function BreadcrumbPage({ className, ...rest }, ref) {
    return (
      <span
        ref={ref}
        role="link"
        aria-disabled="true"
        aria-current="page"
        className={cx(pageClasses, className)}
        {...rest}
      />
    )
  },
)
BreadcrumbPage.displayName = 'Breadcrumb.Page'

/** Visual separator between crumbs. Decorative — hidden from AT. */
export const BreadcrumbSeparator = forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(function BreadcrumbSeparator({ className, children, ...rest }, ref) {
  const { separator } = useBreadcrumb('Breadcrumb.Separator')
  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cx(separatorClasses, className)}
      {...rest}
    >
      {children ?? separator}
    </li>
  )
})
BreadcrumbSeparator.displayName = 'Breadcrumb.Separator'

/** A collapsed-crumbs indicator (…) for long trails. */
export const BreadcrumbEllipsis = forwardRef<
  HTMLSpanElement,
  BreadcrumbEllipsisProps
>(function BreadcrumbEllipsis({ className, ...rest }, ref) {
  return (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={cx(ellipsisClasses, className)}
      {...rest}
    >
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" aria-hidden>
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
      </svg>
    </span>
  )
})
BreadcrumbEllipsis.displayName = 'Breadcrumb.Ellipsis'
