import * as React from 'react'
import SvgIcon, { type SvgIconProps } from '../SvgIcon'

export default function createSvgIcon(path: React.ReactElement, displayName: string) {
  function Component(props: SvgIconProps, ref: React.Ref<SVGSVGElement>) {
    return (
      <SvgIcon data-testid={`${displayName}Icon`} ref={ref} {...props}>
        {path}
      </SvgIcon>
    )
  }
  const Icon = React.forwardRef(Component)
  Icon.displayName = displayName
  return React.memo(Icon)
}
