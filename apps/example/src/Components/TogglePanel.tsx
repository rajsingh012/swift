import { useState } from 'react'
import { Toggle, ToggleGroup } from '@swift/components/Toggle'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A two-state button — pressed or not. Use standalone for a single on/off affordance (bold, mute…) or inside a ToggleGroup for a set (single or multiple selection). The group cascades size / variant / disabled and provides arrow-key roving focus.'

const KNOBS: ReadonlyArray<Knob> = [
  { type: 'segmented', name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'select', name: 'variant', options: ['default', 'outline', 'ghost'], defaultValue: 'default' },
  { type: 'boolean', name: 'disabled' },
  { type: 'text', name: 'children', defaultValue: 'Bold', asChildren: true },
]

const TOGGLE_PROPS: ReadonlyArray<PropRow> = [
  { name: 'pressed', type: 'boolean', description: 'Controlled pressed state (standalone). Pair with onPressedChange.' },
  { name: 'defaultPressed', type: 'boolean', defaultValue: 'false', description: 'Uncontrolled initial pressed state.' },
  { name: 'onPressedChange', type: '(pressed: boolean) => void', description: 'Fires with the next pressed state on toggle.' },
  { name: 'size', type: `'sm' | 'md' | 'lg'`, defaultValue: `'md'`, description: 'Button dimensions. Inherits from a ToggleGroup.' },
  { name: 'variant', type: `'default' | 'outline' | 'ghost'`, defaultValue: `'default'`, description: 'Chrome treatment. Inherits from a ToggleGroup.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the toggle.' },
  { name: 'value', type: 'string', description: 'Identity inside a ToggleGroup. Required when grouped.' },
]

const GROUP_PROPS: ReadonlyArray<PropRow> = [
  { name: 'type', type: `'single' | 'multiple'`, defaultValue: `'single'`, description: 'single allows at most one pressed (radio-like); multiple allows any number.' },
  { name: 'value / defaultValue / onValueChange', type: 'string|null | string[]', description: 'Controlled/uncontrolled selection. Shape depends on type.' },
  { name: 'orientation', type: `'horizontal' | 'vertical'`, defaultValue: `'horizontal'`, description: 'Layout + arrow-key direction.' },
  { name: 'size / variant / disabled', type: 'cascade', description: 'Cascade to every child Toggle unless the child overrides.' },
  { name: 'loop', type: 'boolean', defaultValue: 'true', description: 'Arrow-key navigation wraps at the ends.' },
]

export function TogglePanel() {
  const [align, setAlign] = useState<string | null>('left')
  const [marks, setMarks] = useState<string[]>(['bold'])

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Toggle
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Toggle"
          knobs={KNOBS}
          render={(v) => (
            <Toggle
              size={v.size as 'sm' | 'md' | 'lg'}
              variant={v.variant as 'default' | 'outline' | 'ghost'}
              disabled={v.disabled === true}
            >
              {String(v.children)}
            </Toggle>
          )}
        />
      </section>

      <section>
        <SectionHeader>Standalone</SectionHeader>
        <PreviewRow code={`<Toggle defaultPressed>Bold</Toggle>
<Toggle>Italic</Toggle>`}>
          <Toggle defaultPressed>Bold</Toggle>
          <Toggle>Italic</Toggle>
          <Toggle variant="outline">Underline</Toggle>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Variants</SectionHeader>
        <PreviewRow code={`<Toggle variant="default" defaultPressed>Default</Toggle>
<Toggle variant="outline" defaultPressed>Outline</Toggle>
<Toggle variant="ghost" defaultPressed>Ghost</Toggle>`}>
          <Toggle variant="default" defaultPressed>Default</Toggle>
          <Toggle variant="outline" defaultPressed>Outline</Toggle>
          <Toggle variant="ghost" defaultPressed>Ghost</Toggle>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>ToggleGroup · single</SectionHeader>
        <PreviewRow code={`<ToggleGroup type="single" value={align} onValueChange={setAlign}>
  <Toggle value="left">Left</Toggle>
  <Toggle value="center">Center</Toggle>
  <Toggle value="right">Right</Toggle>
</ToggleGroup>`}>
          <div>
            <ToggleGroup type="single" variant="outline" value={align} onValueChange={setAlign}>
              <Toggle value="left">Left</Toggle>
              <Toggle value="center">Center</Toggle>
              <Toggle value="right">Right</Toggle>
            </ToggleGroup>
            <Text variant="body-xs" color="muted" className="mt-2 block">
              value: <code>{String(align)}</code>
            </Text>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>ToggleGroup · multiple</SectionHeader>
        <PreviewRow code={`<ToggleGroup type="multiple" value={marks} onValueChange={setMarks}>
  <Toggle value="bold">B</Toggle>
  <Toggle value="italic">I</Toggle>
  <Toggle value="underline">U</Toggle>
</ToggleGroup>`}>
          <div>
            <ToggleGroup type="multiple" value={marks} onValueChange={setMarks}>
              <Toggle value="bold">B</Toggle>
              <Toggle value="italic">I</Toggle>
              <Toggle value="underline">U</Toggle>
            </ToggleGroup>
            <Text variant="body-xs" color="muted" className="mt-2 block">
              value: <code>{marks.join(', ') || '(none)'}</code>
            </Text>
          </div>
        </PreviewRow>
      </section>

      <PropsTable title="Props · Toggle" rows={TOGGLE_PROPS} />
      <PropsTable title="Props · ToggleGroup" rows={GROUP_PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Toggle, ToggleGroup } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Toggle, ToggleGroup } from '@swift/components/Toggle'`} />
        </div>
      </section>
    </div>
  )
}
