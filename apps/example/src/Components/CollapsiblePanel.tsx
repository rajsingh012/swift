import { useState } from 'react'
import { Collapsible } from '@swift/components/Collapsible'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A single open/closed disclosure — the standalone sibling of one Accordion.Item, for show/hide of a section without group semantics. Smooth grid-rows height animation, full ARIA wiring, controlled/uncontrolled via open / defaultOpen / onOpenChange.'

const ROOT_PROPS: ReadonlyArray<PropRow> = [
  { name: 'open', type: 'boolean', description: 'Controlled open state. Pair with onOpenChange.' },
  { name: 'defaultOpen', type: 'boolean', defaultValue: 'false', description: 'Uncontrolled initial open state.' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Fires with the next open state on every toggle.' },
  { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the trigger and prevents toggling.' },
]

const PART_PROPS: ReadonlyArray<PropRow> = [
  { name: 'Collapsible.Trigger', type: 'asChild?, children (node | render-prop)', description: 'The toggle button. children can be a function receiving { open }. asChild merges props onto your element.' },
  { name: 'Collapsible.Content', type: 'forceMount?, children', description: 'The collapsible region (role="region"). forceMount keeps it mounted while closed for external animation.' },
]

export function CollapsiblePanel() {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Collapsible
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow code={`<Collapsible>
  <Collapsible.Trigger>Show details</Collapsible.Trigger>
  <Collapsible.Content>
    <p>Hidden details revealed on toggle.</p>
  </Collapsible.Content>
</Collapsible>`}>
          <div className="w-full max-w-md">
            <Collapsible>
              <Collapsible.Trigger className="font-medium text-content-strong">
                Show details
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Text variant="body-sm" color="secondary" className="pt-2">
                  Hidden details revealed on toggle. The height animates smoothly via the grid-rows trick.
                </Text>
              </Collapsible.Content>
            </Collapsible>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Render-prop trigger</SectionHeader>
        <PreviewRow code={`<Collapsible>
  <Collapsible.Trigger>
    {({ open }) => <span>{open ? 'Hide' : 'Show'} advanced</span>}
  </Collapsible.Trigger>
  <Collapsible.Content>…</Collapsible.Content>
</Collapsible>`}>
          <div className="w-full max-w-md">
            <Collapsible>
              <Collapsible.Trigger className="font-medium text-content-brand">
                {({ open }) => <span>{open ? '▾ Hide' : '▸ Show'} advanced options</span>}
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Text variant="body-sm" color="secondary" className="pt-2">
                  Advanced configuration goes here.
                </Text>
              </Collapsible.Content>
            </Collapsible>
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Controlled</SectionHeader>
        <PreviewRow code={`const [open, setOpen] = useState(false)

<Collapsible open={open} onOpenChange={setOpen}>…</Collapsible>`}>
          <div className="w-full max-w-md">
            <Collapsible open={open} onOpenChange={setOpen}>
              <Collapsible.Trigger className="font-medium text-content-strong">
                Toggle me
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Text variant="body-sm" color="secondary" className="pt-2">
                  Controlled content.
                </Text>
              </Collapsible.Content>
            </Collapsible>
            <Text variant="body-xs" color="muted" className="mt-2 block">
              open: <code>{String(open)}</code>
            </Text>
          </div>
        </PreviewRow>
      </section>

      <PropsTable title="Props · Collapsible" rows={ROOT_PROPS} />
      <PropsTable title="Compound parts" rows={PART_PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Collapsible } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Collapsible } from '@swift/components/Collapsible'`} />
        </div>
      </section>
    </div>
  )
}
