import { Divider } from '@swift/components/Divider'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A thin rule that separates content horizontally or vertically, with an optional inline label and three line styles. Renders role="separator" with the right aria-orientation, or drops out of the a11y tree when decorative.'

const KNOBS: ReadonlyArray<Knob> = [
  { type: 'segmented', name: 'orientation', options: ['horizontal', 'vertical'], defaultValue: 'horizontal' },
  { type: 'select', name: 'variant', options: ['solid', 'dashed', 'dotted'], defaultValue: 'solid' },
  { type: 'select', name: 'labelAlign', options: ['start', 'center', 'end'], defaultValue: 'center' },
  { type: 'boolean', name: 'decorative' },
  { type: 'text', name: 'children', defaultValue: '', asChildren: true },
]

const PROPS: ReadonlyArray<PropRow> = [
  { name: 'orientation', type: `'horizontal' | 'vertical'`, defaultValue: `'horizontal'`, description: 'Direction of the rule. Vertical dividers self-stretch to their container height.' },
  { name: 'variant', type: `'solid' | 'dashed' | 'dotted'`, defaultValue: `'solid'`, description: 'Line style, mapped onto the native border-style keywords.' },
  { name: 'children', type: 'ReactNode', description: 'Optional inline label (horizontal only). The line splits around it.' },
  { name: 'labelAlign', type: `'start' | 'center' | 'end'`, defaultValue: `'center'`, description: 'Where the label sits along the rule when one is provided.' },
  { name: 'decorative', type: 'boolean', defaultValue: 'false', description: 'When true, renders role="none" and drops the divider from the accessibility tree.' },
  { name: 'classes', type: '{ root?, line?, label? }', description: 'Slot-level className overrides.' },
  { name: '...rest', type: 'HTMLAttributes<HTMLDivElement>', description: 'Anything else forwards to the root element.' },
]

export function DividerPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Divider
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Divider"
          knobs={KNOBS}
          render={(v) => (
            <div className="w-full">
              <Text variant="body-sm" color="secondary">Above</Text>
              <div className="my-3" style={v.orientation === 'vertical' ? { height: 48, display: 'flex' } : undefined}>
                <Divider
                  orientation={v.orientation as 'horizontal' | 'vertical'}
                  variant={v.variant as 'solid' | 'dashed' | 'dotted'}
                  labelAlign={v.labelAlign as 'start' | 'center' | 'end'}
                  decorative={v.decorative === true}
                >
                  {String(v.children) || undefined}
                </Divider>
              </div>
              <Text variant="body-sm" color="secondary">Below</Text>
            </div>
          )}
        />
      </section>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow code={`<Divider />`}>
          <div className="w-full">
            <Text variant="body-sm">Section one</Text>
            <Divider />
            <Text variant="body-sm">Section two</Text>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Line styles</SectionHeader>
        <PreviewRow code={`<Divider variant="solid" />
<Divider variant="dashed" />
<Divider variant="dotted" />`}>
          <div className="flex w-full flex-col gap-4">
            <Divider variant="solid" />
            <Divider variant="dashed" />
            <Divider variant="dotted" />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>With a label</SectionHeader>
        <PreviewRow code={`<Divider>OR</Divider>
<Divider labelAlign="start">Recent</Divider>`}>
          <div className="flex w-full flex-col gap-4">
            <Divider>OR</Divider>
            <Divider labelAlign="start">Recent</Divider>
            <Divider labelAlign="end">More</Divider>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Vertical</SectionHeader>
        <PreviewRow code={`<div style={{ display: 'flex', height: 24 }}>
  <span>Home</span>
  <Divider orientation="vertical" />
  <span>Docs</span>
</div>`}>
          <div className="flex items-center gap-3" style={{ height: 24 }}>
            <Text variant="body-sm">Home</Text>
            <Divider orientation="vertical" />
            <Text variant="body-sm">Docs</Text>
            <Divider orientation="vertical" />
            <Text variant="body-sm">Settings</Text>
          </div>
        </PreviewRow>
      </section>

      <PropsTable rows={PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Divider } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Divider } from '@swift/components/Divider'`} />
        </div>
      </section>
    </div>
  )
}
