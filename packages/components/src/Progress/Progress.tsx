import { ProgressRoot } from './ProgressRoot'
import { ProgressTrack } from './ProgressTrack'
import { ProgressIndicator } from './ProgressIndicator'
import { ProgressLabel } from './ProgressLabel'
import { ProgressValue } from './ProgressValue'

/**
 * Progress supports two interchangeable APIs:
 *
 *   // Simple — pass value/label and let it render:
 *   <Progress value={40} label="Uploading" showValue />
 *
 *   // Compound — compose the parts explicitly:
 *   <Progress.Root value={40}>
 *     <Progress.Label>Uploading</Progress.Label>
 *     <Progress.Track>
 *       <Progress.Indicator />
 *     </Progress.Track>
 *     <Progress.Value />
 *   </Progress.Root>
 */
export const Progress = Object.assign(ProgressRoot, {
  Root: ProgressRoot,
  Track: ProgressTrack,
  Indicator: ProgressIndicator,
  Label: ProgressLabel,
  Value: ProgressValue,
})
