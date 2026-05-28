import { Slider as SliderRoot } from './Slider'
import { SliderLabel } from './SliderLabel'
import { SliderMark } from './SliderMark'
import { SliderRange } from './SliderRange'
import { SliderThumb } from './SliderThumb'
import { SliderTrack } from './SliderTrack'
import { SliderValue } from './SliderValue'

export const Slider = Object.assign(SliderRoot, {
  Track: SliderTrack,
  Range: SliderRange,
  Thumb: SliderThumb,
  Mark: SliderMark,
  Value: SliderValue,
  Label: SliderLabel,
}) as typeof SliderRoot & {
  Track: typeof SliderTrack
  Range: typeof SliderRange
  Thumb: typeof SliderThumb
  Mark: typeof SliderMark
  Value: typeof SliderValue
  Label: typeof SliderLabel
}

export type {
  SliderProps,
  SliderOwnProps,
  SliderClasses,
  SliderOrientation,
  SliderValue as SliderValueType,
  SliderDirection,
  SliderTrackProps,
  SliderRangeProps,
  SliderThumbProps,
  SliderMarkProps,
  SliderValueProps,
  SliderLabelProps,
} from './Slider.types'

export default Slider
