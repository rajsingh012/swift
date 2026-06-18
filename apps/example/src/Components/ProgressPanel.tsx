import { useEffect, useState } from 'react'
import { Progress } from '@swift/components/Progress'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A determinate or indeterminate progress bar built on the same track/fill model as Slider, minus the thumb. Renders role="progressbar" with aria-valuemin/max/now, an optional label + percentage readout, and a continuous animation when value is null.'

const KNOBS: ReadonlyArray<Knob> = [
  { type: 'segmented', name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'select', name: 'variant', options: ['brand', 'success', 'warning', 'error'], defaultValue: 'brand' },
  { type: 'boolean', name: 'showValue' },
]

const PROPS: ReadonlyArray<PropRow> = [
  { name: 'value', type: 'number | null', description: 'Current value. Omit or pass null for an indeterminate bar.' },
  { name: 'min', type: 'number', defaultValue: '0', description: 'Lower bound.' },
  { name: 'max', type: 'number', defaultValue: '100', description: 'Upper bound.' },
  { name: 'size', type: `'sm' | 'md' | 'lg'`, defaultValue: `'md'`, description: 'Track thickness (4 / 8 / 12 px).' },
  { name: 'variant', type: `'brand' | 'success' | 'warning' | 'error'`, defaultValue: `'brand'`, description: 'Indicator colour.' },
  { name: 'label', type: 'ReactNode', description: 'Accessible label, wired via aria-labelledby when shown (else aria-label for strings).' },
  { name: 'showValue', type: 'boolean', defaultValue: 'false', description: 'Show the numeric/percentage readout in the header row.' },
  { name: 'format', type: '(value: number, percent: number) => string', description: 'Custom readout formatter. Defaults to `${percent}%`.' },
  { name: 'classes', type: '{ root?, track?, indicator?, label?, value? }', description: 'Slot-level className overrides.' },
]

export function ProgressPanel() {
  const [value, setValue] = useState(30)

  // Auto-advancing demo so the determinate transition is visible.
  useEffect(() => {
    const id = window.setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10))
    }, 1200)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Progress
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Progress"
          knobs={KNOBS}
          render={(v) => (
            <div className="w-full max-w-md">
              <Progress
                value={60}
                size={v.size as 'sm' | 'md' | 'lg'}
                variant={v.variant as 'brand' | 'success' | 'warning' | 'error'}
                label="Uploading"
                showValue={v.showValue === true}
              />
            </div>
          )}
        />
      </section>

      <section>
        <SectionHeader>Basic · live</SectionHeader>
        <PreviewRow code={`<Progress value={value} label="Uploading" showValue />`}>
          <div className="w-full max-w-md">
            <Progress value={value} label="Uploading" showValue />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Sizes</SectionHeader>
        <PreviewRow code={`<Progress value={40} size="sm" />
<Progress value={40} size="md" />
<Progress value={40} size="lg" />`}>
          <div className="flex w-full max-w-md flex-col gap-4">
            <Progress value={40} size="sm" />
            <Progress value={40} size="md" />
            <Progress value={40} size="lg" />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Variants</SectionHeader>
        <PreviewRow code={`<Progress value={70} variant="success" label="Success" showValue />
<Progress value={50} variant="warning" label="Warning" showValue />
<Progress value={25} variant="error" label="Error" showValue />`}>
          <div className="flex w-full max-w-md flex-col gap-4">
            <Progress value={70} variant="success" label="Success" showValue />
            <Progress value={50} variant="warning" label="Warning" showValue />
            <Progress value={25} variant="error" label="Error" showValue />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Indeterminate</SectionHeader>
        <PreviewRow code={`<Progress value={null} label="Loading" />`}>
          <div className="w-full max-w-md">
            <Progress value={null} label="Loading" />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Custom format</SectionHeader>
        <PreviewRow code={`<Progress
  value={3}
  max={5}
  label="Steps"
  showValue
  format={(v, p) => \`\${v} of 5 (\${p}%)\`}
/>`}>
          <div className="w-full max-w-md">
            <Progress value={3} max={5} label="Steps" showValue format={(v, p) => `${v} of 5 (${p}%)`} />
          </div>
        </PreviewRow>
      </section>

      <PropsTable rows={PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Progress } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Progress } from '@swift/components/Progress'`} />
        </div>
      </section>
    </div>
  )
}
