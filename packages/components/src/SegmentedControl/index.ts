import { SegmentedControlIndicator } from './SegmentedControlIndicator'
import { SegmentedControlItem } from './SegmentedControlItem'
import { SegmentedControlRoot } from './SegmentedControlRoot'

export const SegmentedControl = Object.assign(SegmentedControlRoot, {
  Item: SegmentedControlItem,
  Indicator: SegmentedControlIndicator,
})

export default SegmentedControl

export type {
  SegmentedControlRootProps,
  SegmentedControlItemProps,
  SegmentedControlIndicatorProps,
  SegmentedControlClasses,
  SegmentedControlOrientation,
  SegmentedControlSize,
  SegmentedControlDirection,
} from './SegmentedControl.types'
