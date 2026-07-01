import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from 'react'

export type BreadcrumbSize = 'sm' | 'md' | 'lg'

export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
  size?: BreadcrumbSize
  /**
   * Default separator rendered between items when an explicit
   * `<Breadcrumb.Separator>` is not composed. @default '/'
   */
  separator?: ReactNode
  /** Accessible label for the nav landmark. @default 'Breadcrumb' */
  'aria-label'?: string
  children?: ReactNode
}

export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>

export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>

export interface BreadcrumbLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Render the single child element as the link instead of an `<a>`. */
  asChild?: boolean
}

export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>

export interface BreadcrumbSeparatorProps
  extends HTMLAttributes<HTMLLIElement> {
  children?: ReactNode
}

export type BreadcrumbEllipsisProps = HTMLAttributes<HTMLSpanElement>
