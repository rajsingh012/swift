import { DropdownMenu } from '@swift/components/DropdownMenu'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A button-triggered command menu. Floating placement via the shared engine, roving focus, typeahead, and Escape / outside-click dismissal. Compose Item / CheckboxItem / Separator / Label / Group.'

const ROOT_PROPS: ReadonlyArray<PropRow> = [
  { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (boolean) => void', description: 'Controlled/uncontrolled open state.' },
  { name: 'placement', type: 'Placement', defaultValue: `'bottom-start'`, description: 'Preferred placement before collision handling.' },
  { name: 'offset', type: 'number', defaultValue: '6', description: 'Gap between trigger and menu, in px.' },
  { name: 'dir', type: `'ltr' | 'rtl'`, description: 'Writing direction. Auto-detected when omitted.' },
]

const PART_PROPS: ReadonlyArray<PropRow> = [
  { name: 'DropdownMenu.Trigger', type: 'asChild?', description: 'Opens the menu; ArrowDown/Up also open it.' },
  { name: 'DropdownMenu.Content', type: 'closeOnEscape?, closeOnInteractOutside?, initialFocusRef?', description: 'The menu surface (role="menu"). Auto-focuses the first item.' },
  { name: 'DropdownMenu.Item', type: 'onSelect?, closeOnSelect?, disabled?, icon?, shortcut?', description: 'A command (role="menuitem"). onSelect can preventDefault to keep the menu open.' },
  { name: 'DropdownMenu.CheckboxItem', type: 'checked?, defaultChecked?, onCheckedChange?, disabled?', description: 'A checkable item (role="menuitemcheckbox"). Keeps the menu open by default.' },
  { name: 'DropdownMenu.Label / Separator / Group', type: '—', description: 'Section label, divider, and a labelled group of items.' },
]

export function DropdownMenuPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          DropdownMenu
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow code={`<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button>Options</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Portal>
    <DropdownMenu.Content>
      <DropdownMenu.Item onSelect={() => {}}>Edit</DropdownMenu.Item>
      <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item>Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
</DropdownMenu>`}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button>Options</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <DropdownMenu.Item shortcut="⌘E">Edit</DropdownMenu.Item>
                <DropdownMenu.Item shortcut="⌘D">Duplicate</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item shortcut="⌫">Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>With label, group & checkboxes</SectionHeader>
        <PreviewRow code={`<DropdownMenu.Label>View</DropdownMenu.Label>
<DropdownMenu.CheckboxItem defaultChecked>Show grid</DropdownMenu.CheckboxItem>
<DropdownMenu.CheckboxItem>Show rulers</DropdownMenu.CheckboxItem>`}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="secondary">View options</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <DropdownMenu.Label>Display</DropdownMenu.Label>
                <DropdownMenu.CheckboxItem defaultChecked>Show grid</DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem>Show rulers</DropdownMenu.CheckboxItem>
                <DropdownMenu.Separator />
                <DropdownMenu.Group label="Theme">
                  <DropdownMenu.Item>Light</DropdownMenu.Item>
                  <DropdownMenu.Item>Dark</DropdownMenu.Item>
                  <DropdownMenu.Item>System</DropdownMenu.Item>
                </DropdownMenu.Group>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Disabled items</SectionHeader>
        <PreviewRow code={`<DropdownMenu.Item disabled>Archived</DropdownMenu.Item>`}>
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Open</DropdownMenu.Item>
                <DropdownMenu.Item disabled>Archived (disabled)</DropdownMenu.Item>
                <DropdownMenu.Item>Share</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu>
        </PreviewRow>
      </section>

      <PropsTable title="Props · DropdownMenu" rows={ROOT_PROPS} />
      <PropsTable title="Compound parts" rows={PART_PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { DropdownMenu } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { DropdownMenu } from '@swift/components/DropdownMenu'`} />
        </div>
      </section>
    </div>
  )
}
