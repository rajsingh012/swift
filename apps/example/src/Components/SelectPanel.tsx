import { useState } from 'react'
import { Select } from '@swift/components/Select'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A listbox-backed single-select control. Floating listbox via the shared engine, keyboard navigation + typeahead, an optional hidden input for forms, and a check indicator on the selected option. Controlled/uncontrolled via value / defaultValue / onValueChange.'

const ROOT_PROPS: ReadonlyArray<PropRow> = [
  { name: 'value / defaultValue / onValueChange', type: 'string|null / string|null / (string) => void', description: 'Controlled/uncontrolled selected value.' },
  { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (boolean) => void', description: 'Controlled/uncontrolled listbox open state.' },
  { name: 'disabled / required', type: 'boolean', defaultValue: 'false', description: 'Field flags. required marks the hidden input.' },
  { name: 'name', type: 'string', description: 'Hidden input name for native form submission.' },
  { name: 'placement', type: 'Placement', defaultValue: `'bottom-start'`, description: 'Preferred listbox placement.' },
  { name: 'offset', type: 'number', defaultValue: '6', description: 'Gap between trigger and listbox.' },
]

const PART_PROPS: ReadonlyArray<PropRow> = [
  { name: 'Select.Trigger', type: 'size?, variant?, state?, invalid?, fullWidth?', description: 'The combobox button. Opens on click / Arrow / Enter; typeahead works while closed.' },
  { name: 'Select.Value', type: 'placeholder?', description: 'Renders the selected label (or placeholder) plus the chevron.' },
  { name: 'Select.Content', type: 'matchTriggerWidth?, closeOnEscape?, closeOnInteractOutside?', description: 'The listbox surface (role="listbox").' },
  { name: 'Select.Item', type: 'value (required), textValue?, disabled?', description: 'An option (role="option"). textValue overrides the label used for display + typeahead.' },
  { name: 'Select.Group / Separator', type: 'label?', description: 'A labelled group of options and a divider.' },
]

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Dragonfruit', 'Elderberry']

export function SelectPanel() {
  const [value, setValue] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Select
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow code={`<Select defaultValue="Apple">
  <Select.Trigger>
    <Select.Value placeholder="Pick a fruit" />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content>
      <Select.Item value="Apple">Apple</Select.Item>
      <Select.Item value="Banana">Banana</Select.Item>
    </Select.Content>
  </Select.Portal>
</Select>`}>
          <div className="w-56">
            <Select defaultValue="Apple">
              <Select.Trigger aria-label="Fruit" fullWidth>
                <Select.Value placeholder="Pick a fruit" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content>
                  {FRUITS.map((f) => (
                    <Select.Item key={f} value={f}>
                      {f}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Controlled</SectionHeader>
        <PreviewRow code={`const [value, setValue] = useState<string | null>(null)

<Select value={value} onValueChange={setValue}>…</Select>`}>
          <div className="w-56">
            <Select value={value} onValueChange={setValue}>
              <Select.Trigger aria-label="Fruit" fullWidth>
                <Select.Value placeholder="Pick a fruit" />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content>
                  {FRUITS.map((f) => (
                    <Select.Item key={f} value={f}>
                      {f}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Portal>
            </Select>
            <Text variant="body-xs" color="muted" className="mt-2 block">
              value: <code>{String(value)}</code>
            </Text>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Groups, disabled items & invalid</SectionHeader>
        <PreviewRow code={`<Select.Group label="Citrus">
  <Select.Item value="orange">Orange</Select.Item>
</Select.Group>
<Select.Item value="cherry" disabled>Cherry</Select.Item>`}>
          <div className="flex flex-wrap gap-6">
            <div className="w-56">
              <Select>
                <Select.Trigger aria-label="Grouped fruit" fullWidth>
                  <Select.Value placeholder="Choose" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content>
                    <Select.Group label="Citrus">
                      <Select.Item value="orange">Orange</Select.Item>
                      <Select.Item value="lemon">Lemon</Select.Item>
                    </Select.Group>
                    <Select.Separator />
                    <Select.Group label="Berries">
                      <Select.Item value="strawberry">Strawberry</Select.Item>
                      <Select.Item value="blueberry" disabled>
                        Blueberry (out of stock)
                      </Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Portal>
              </Select>
            </div>
            <div className="w-56">
              <Select>
                <Select.Trigger aria-label="Required fruit" invalid state="error" fullWidth>
                  <Select.Value placeholder="Required field" />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content>
                    {FRUITS.map((f) => (
                      <Select.Item key={f} value={f}>
                        {f}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Portal>
              </Select>
            </div>
          </div>
        </PreviewRow>
      </section>

      <PropsTable title="Props · Select" rows={ROOT_PROPS} />
      <PropsTable title="Compound parts" rows={PART_PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Select } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Select } from '@swift/components/Select'`} />
        </div>
      </section>
    </div>
  )
}
