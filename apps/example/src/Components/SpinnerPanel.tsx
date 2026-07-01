import { Spinner } from '@swift/components/Spinner'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'An indeterminate loading indicator — a rotating ring with five sizes and six semantic colours. Renders role="status" with an accessible label, and slows (rather than stops) under prefers-reduced-motion so the loading state stays perceivable.'

const KNOBS: ReadonlyArray<Knob> = [
  { type: 'segmented', name: 'size', options: ['xs', 'sm', 'md', 'lg', 'xl'], defaultValue: 'md' },
  { type: 'select', name: 'variant', options: ['default', 'brand', 'success', 'warning', 'error', 'inverse'], defaultValue: 'default' },
  { type: 'text', name: 'children', defaultValue: '', asChildren: true },
]

const PROPS: ReadonlyArray<PropRow> = [
  { name: 'size', type: `'xs' | 'sm' | 'md' | 'lg' | 'xl'`, defaultValue: `'md'`, description: 'Diameter of the ring (12 / 16 / 20 / 24 / 32 px).' },
  { name: 'variant', type: `'default' | 'brand' | 'success' | 'warning' | 'error' | 'inverse'`, defaultValue: `'default'`, description: 'Stroke colour, resolved from semantic content tokens.' },
  { name: 'label', type: 'string', defaultValue: `'Loading'`, description: 'Accessible label exposed via aria-label when no visible children are given.' },
  { name: 'children', type: 'ReactNode', description: 'Optional visible text rendered beside the spinner; also becomes the accessible label.' },
  { name: '...rest', type: 'HTMLAttributes<HTMLSpanElement>', description: 'Anything else forwards to the root <span>.' },
]

export function SpinnerPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Spinner
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Spinner"
          knobs={KNOBS}
          render={(v) => (
            <Spinner
              size={v.size as 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
              variant={v.variant as 'default' | 'brand' | 'success' | 'warning' | 'error' | 'inverse'}
            >
              {String(v.children) || undefined}
            </Spinner>
          )}
        />
      </section>

      <section>
        <SectionHeader>Sizes</SectionHeader>
        <PreviewRow code={`<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`}>
          <div className="flex items-center gap-6">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="xl" />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Variants</SectionHeader>
        <PreviewRow code={`<Spinner variant="brand" />
<Spinner variant="success" />
<Spinner variant="warning" />
<Spinner variant="error" />`}>
          <div className="flex items-center gap-6">
            <Spinner variant="default" />
            <Spinner variant="brand" />
            <Spinner variant="success" />
            <Spinner variant="warning" />
            <Spinner variant="error" />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>With a label</SectionHeader>
        <PreviewRow code={`<Spinner>Loading…</Spinner>`}>
          <Spinner>Loading…</Spinner>
        </PreviewRow>
      </section>

      <PropsTable rows={PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Spinner } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Spinner } from '@swift/components/Spinner'`} />
        </div>
      </section>
    </div>
  )
}
