import { Popover } from '@swift/components/Popover'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A non-modal floating panel anchored to a trigger. Collision-aware positioning via the shared floating engine, focus management, an optional arrow, and Escape / outside-click dismissal. Set modal to trap focus like a dialog.'

const ROOT_PROPS: ReadonlyArray<PropRow> = [
  { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (boolean) => void', description: 'Controlled/uncontrolled open state.' },
  { name: 'modal', type: 'boolean', defaultValue: 'false', description: 'Modal traps focus and blocks the background; non-modal leaves the page interactive.' },
  { name: 'placement', type: 'Placement', defaultValue: `'bottom'`, description: 'Preferred placement before collision handling (top/bottom/left/right + start/end).' },
  { name: 'offset', type: 'number', defaultValue: '8', description: 'Gap between trigger and panel, in px.' },
  { name: 'dir', type: `'ltr' | 'rtl'`, description: 'Writing direction for placement mirroring. Auto-detected when omitted.' },
]

const PART_PROPS: ReadonlyArray<PropRow> = [
  { name: 'Popover.Trigger', type: 'asChild?', description: 'Toggles the popover. asChild merges props onto your element.' },
  { name: 'Popover.Anchor', type: 'asChild?', description: 'Optional positioning anchor when the visual trigger and anchor point differ.' },
  { name: 'Popover.Portal', type: 'container?', description: 'Portals the content (default document.body).' },
  { name: 'Popover.Content', type: 'closeOnEscape?, closeOnInteractOutside?, initialFocusRef?, on* events', description: 'The panel (role="dialog"). Positioned, focus-managed, dismissible.' },
  { name: 'Popover.Arrow', type: 'HTMLAttributes', description: 'Decorative arrow pointing at the trigger.' },
  { name: 'Popover.Close', type: 'asChild?', description: 'Closes the popover. Bare renders a × icon button.' },
]

export function PopoverPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Popover
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow code={`<Popover>
  <Popover.Trigger asChild>
    <Button>Open popover</Button>
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content>
      <p>Popover content goes here.</p>
      <Popover.Arrow />
    </Popover.Content>
  </Popover.Portal>
</Popover>`}>
          <Popover>
            <Popover.Trigger asChild>
              <Button>Open popover</Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content>
                <Text variant="body-sm" fontWeight="semibold" className="mb-1 block">
                  Dimensions
                </Text>
                <Text variant="body-sm" color="secondary">
                  Set the width and height of the layer.
                </Text>
                <Popover.Arrow />
                <Popover.Close />
              </Popover.Content>
            </Popover.Portal>
          </Popover>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Placement</SectionHeader>
        <PreviewRow code={`<Popover placement="right">…</Popover>`}>
          <div className="flex flex-wrap gap-3">
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <Popover key={side} placement={side}>
                <Popover.Trigger asChild>
                  <Button variant="secondary">{side}</Button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content>
                    <Text variant="body-sm">Placed on {side}.</Text>
                    <Popover.Arrow />
                  </Popover.Content>
                </Popover.Portal>
              </Popover>
            ))}
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Modal</SectionHeader>
        <PreviewRow code={`<Popover modal>…</Popover>`}>
          <Popover modal>
            <Popover.Trigger asChild>
              <Button>Modal popover</Button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content>
                <Text variant="body-sm" className="mb-2 block">
                  Focus is trapped here. Tab cycles within.
                </Text>
                <input
                  className="w-full rounded-md border border-stroke px-2 py-1 text-sm"
                  placeholder="Focusable input"
                />
                <Popover.Arrow />
              </Popover.Content>
            </Popover.Portal>
          </Popover>
        </PreviewRow>
      </section>

      <PropsTable title="Props · Popover" rows={ROOT_PROPS} />
      <PropsTable title="Compound parts" rows={PART_PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Popover } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Popover } from '@swift/components/Popover'`} />
        </div>
      </section>
    </div>
  )
}
