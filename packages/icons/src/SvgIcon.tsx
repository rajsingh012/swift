import React from 'react'

export interface SvgIconProps extends React.ComponentPropsWithoutRef<'svg'> {
  size?: number | string
  title?: string
}

const SvgIcon = React.forwardRef<SVGSVGElement, SvgIconProps>(function SvgIcon(
  { size, style, children, title, ...rest },
  ref,
) {
  const dim = size ?? '1em'
  return (
    <svg
      width={dim}
      height={dim}
      fontSize="1.5rem"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{ userSelect: 'none', display: 'inline-block', ...style }}
      ref={ref}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  )
})
SvgIcon.displayName = 'SvgIcon'

export default SvgIcon
