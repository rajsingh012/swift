import { Textarea } from '@swift/components/Textarea'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { Playground, type Knob } from './Playground'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A multi-line text field mirroring the Input API (size / variant / state / invalid / label / helperText / errorMessage / showCount), plus resize="auto" for content-driven height. Built on a real native <textarea>, so it participates in forms exactly like the browser element.'

const KNOBS: ReadonlyArray<Knob> = [
  { type: 'segmented', name: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'select', name: 'variant', options: ['outlined', 'filled', 'flushed'], defaultValue: 'outlined' },
  { type: 'select', name: 'resize', options: ['vertical', 'auto', 'none'], defaultValue: 'vertical' },
  { type: 'boolean', name: 'invalid' },
  { type: 'boolean', name: 'disabled' },
]

const PROPS: ReadonlyArray<PropRow> = [
  { name: 'size', type: `'sm' | 'md' | 'lg'`, defaultValue: `'md'`, description: 'Padding + font size of the field.' },
  { name: 'variant', type: `'outlined' | 'filled' | 'flushed'`, defaultValue: `'outlined'`, description: 'Border/background treatment, matching Input.' },
  { name: 'state', type: `'default' | 'success' | 'warning' | 'error'`, defaultValue: `'default'`, description: 'Non-error semantic state. invalid overrides this with error chrome.' },
  { name: 'resize', type: `'none' | 'vertical' | 'auto'`, defaultValue: `'vertical'`, description: '"auto" grows the textarea with content (no handle); "vertical" shows the native handle.' },
  { name: 'minRows', type: 'number', defaultValue: '3', description: 'Minimum visible rows.' },
  { name: 'maxRows', type: 'number', description: 'Cap before the textarea scrolls (auto-resize only).' },
  { name: 'label / helperText / errorMessage', type: 'ReactNode', description: 'Label above the field, helper text or (when invalid) error message below.' },
  { name: 'invalid / required / disabled / readOnly / fullWidth', type: 'boolean', defaultValue: 'false', description: 'Standard field flags.' },
  { name: 'showCount', type: 'boolean', defaultValue: 'false', description: 'Show value.length / maxLength under the field. Requires maxLength.' },
  { name: 'classes', type: '{ root?, wrapper?, label?, field?, helperText?, errorMessage?, count? }', description: 'Slot-level className overrides.' },
  { name: '...rest', type: 'TextareaHTMLAttributes', description: 'value, defaultValue, onChange, placeholder, name, etc. forward to the native <textarea>.' },
]

export function TextareaPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Textarea
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <Playground
          component="Textarea"
          knobs={KNOBS}
          render={(v) => (
            <div className="w-full max-w-md">
              <Textarea
                label="Bio"
                placeholder="Tell us about yourself"
                size={v.size as 'sm' | 'md' | 'lg'}
                variant={v.variant as 'outlined' | 'filled' | 'flushed'}
                resize={v.resize as 'vertical' | 'auto' | 'none'}
                invalid={v.invalid === true}
                disabled={v.disabled === true}
                errorMessage={v.invalid === true ? 'This field is required' : undefined}
              />
            </div>
          )}
        />
      </section>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow code={`<Textarea label="Message" placeholder="Type your message…" helperText="Be concise." />`}>
          <div className="w-full max-w-md">
            <Textarea label="Message" placeholder="Type your message…" helperText="Be concise." />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Auto-resize</SectionHeader>
        <PreviewRow code={`<Textarea label="Notes" resize="auto" minRows={2} maxRows={8} />`}>
          <div className="w-full max-w-md">
            <Textarea label="Notes" resize="auto" minRows={2} maxRows={8} placeholder="Grows as you type…" />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Character count</SectionHeader>
        <PreviewRow code={`<Textarea label="Tweet" maxLength={140} showCount />`}>
          <div className="w-full max-w-md">
            <Textarea label="Tweet" maxLength={140} showCount placeholder="What's happening?" />
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Invalid</SectionHeader>
        <PreviewRow code={`<Textarea label="Bio" invalid errorMessage="Bio is required." />`}>
          <div className="w-full max-w-md">
            <Textarea label="Bio" invalid errorMessage="Bio is required." />
          </div>
        </PreviewRow>
      </section>

      <PropsTable rows={PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Textarea } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Textarea } from '@swift/components/Textarea'`} />
        </div>
      </section>
    </div>
  )
}
