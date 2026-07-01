import { Skeleton } from '@swift/components/Skeleton'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A loading placeholder that mimics the shape of not-yet-loaded content. Four shapes, pulse / wave / none animations, and a multi-line text mode with a ragged last line. Decorative and aria-hidden — wrap the region in your own aria-busy container.'

const KNOBS: ReadonlyArray<Knob> = [
  { type: 'segmented', name: 'variant', options: ['text', 'rect', 'rounded', 'circle'], defaultValue: 'text' },
  { type: 'select', name: 'animation', options: ['pulse', 'wave', 'none'], defaultValue: 'pulse' },
]

const PROPS: ReadonlyArray<PropRow> = [
  { name: 'variant', type: `'text' | 'rect' | 'rounded' | 'circle'`, defaultValue: `'text'`, description: 'Placeholder shape. Text bones get an intrinsic ~1em height.' },
  { name: 'animation', type: `'pulse' | 'wave' | 'none'`, defaultValue: `'pulse'`, description: 'Shimmer style. Both pulse and wave honour prefers-reduced-motion.' },
  { name: 'width', type: 'number | string', description: 'Width — number → px, string passes through (e.g. "60%").' },
  { name: 'height', type: 'number | string', description: 'Height — number → px, string passes through.' },
  { name: 'lines', type: 'number', defaultValue: '1', description: 'For variant="text" — render this many stacked lines; the last is shorter.' },
  { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Anything else forwards to the root element.' },
]

export function SkeletonPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Skeleton
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Skeleton"
          knobs={KNOBS}
          render={(v) => (
            <Skeleton
              variant={v.variant as 'text' | 'rect' | 'rounded' | 'circle'}
              animation={v.animation as 'pulse' | 'wave' | 'none'}
              width={v.variant === 'circle' ? 48 : 220}
              height={v.variant === 'circle' ? 48 : v.variant === 'text' ? undefined : 96}
            />
          )}
        />
      </section>

      <section>
        <SectionHeader>Shapes</SectionHeader>
        <PreviewRow code={`<Skeleton variant="circle" width={48} height={48} />
<Skeleton variant="rounded" width={120} height={80} />
<Skeleton variant="rect" width={120} height={80} />`}>
          <div className="flex items-center gap-6">
            <Skeleton variant="circle" width={48} height={48} />
            <Skeleton variant="rounded" width={120} height={80} />
            <Skeleton variant="rect" width={120} height={80} />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Multi-line text</SectionHeader>
        <PreviewRow code={`<Skeleton variant="text" lines={4} />`}>
          <div className="w-full max-w-md">
            <Skeleton variant="text" lines={4} />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Animations</SectionHeader>
        <PreviewRow code={`<Skeleton animation="pulse" width={200} />
<Skeleton animation="wave" width={200} />
<Skeleton animation="none" width={200} />`}>
          <div className="flex w-full max-w-md flex-col gap-3">
            <Skeleton animation="pulse" width="100%" />
            <Skeleton animation="wave" width="100%" />
            <Skeleton animation="none" width="100%" />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Card placeholder</SectionHeader>
        <PreviewRow code={`<div className="flex gap-3">
  <Skeleton variant="circle" width={40} height={40} />
  <div className="flex-1">
    <Skeleton width="40%" />
    <Skeleton variant="text" lines={2} />
  </div>
</div>`}>
          <div className="flex w-full max-w-md gap-3">
            <Skeleton variant="circle" width={40} height={40} />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton width="40%" />
              <Skeleton variant="text" lines={2} />
            </div>
          </div>
        </PreviewRow>
      </section>

      <PropsTable rows={PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Skeleton } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Skeleton } from '@swift/components/Skeleton'`} />
        </div>
      </section>
    </div>
  )
}
