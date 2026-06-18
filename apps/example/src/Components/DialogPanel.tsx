import { useState } from 'react'
import { Dialog } from '@swift/components/Dialog'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { PreviewRow, PropsTable, SectionHeader, type PropRow } from './shared'

const DESCRIPTION =
  'A centered modal window. Same overlay machinery as Sheet — focus trap, scroll lock, inert background, overlay stacking, presence-based exit — but centered rather than edge-anchored. Five sizes, fully ARIA-wired via Title / Description.'

const ROOT_PROPS: ReadonlyArray<PropRow> = [
  { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (boolean) => void', description: 'Controlled/uncontrolled open state.' },
  { name: 'modal', type: 'boolean', defaultValue: 'true', description: 'Blocks the background (scroll lock, inert siblings, scrim, focus trap).' },
]

const PART_PROPS: ReadonlyArray<PropRow> = [
  { name: 'Dialog.Trigger', type: 'asChild?', description: 'Opens the dialog.' },
  { name: 'Dialog.Portal', type: 'container?', description: 'Portals overlay + content.' },
  { name: 'Dialog.Overlay', type: 'forceMount?', description: 'The scrim. Modal only.' },
  { name: 'Dialog.Content', type: 'size?, closeOnEscape?, closeOnInteractOutside?, initialFocusRef?, on* events', description: 'The centered panel (role="dialog"). size: sm | md | lg | xl | full.' },
  { name: 'Dialog.Header / Title / Description', type: '—', description: 'Header region; Title/Description auto-wire aria-labelledby / aria-describedby.' },
  { name: 'Dialog.Body / Footer', type: '—', description: 'Scrollable body and the action row.' },
  { name: 'Dialog.Close', type: 'asChild?', description: 'Closes the dialog. Bare renders a × icon button.' },
]

export function DialogPanel() {
  const [open, setOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Dialog
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Basic</SectionHeader>
        <PreviewRow code={`<Dialog>
  <Dialog.Trigger asChild>
    <Button>Open dialog</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Delete project?</Dialog.Title>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Dialog.Close asChild><Button variant="outline">Cancel</Button></Dialog.Close>
        <Dialog.Close asChild><Button variant="danger">Delete</Button></Dialog.Close>
      </Dialog.Footer>
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>`}>
          <Dialog>
            <Dialog.Trigger asChild>
              <Button>Open dialog</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Delete project?</Dialog.Title>
                  <Dialog.Description>
                    This action cannot be undone. This will permanently delete the project.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <Button variant="danger">Delete</Button>
                  </Dialog.Close>
                </Dialog.Footer>
                <Dialog.Close />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Sizes</SectionHeader>
        <PreviewRow code={`<Dialog.Content size="sm | md | lg | xl | full">`}>
          <div className="flex flex-wrap gap-3">
            {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
              <Dialog key={size}>
                <Dialog.Trigger asChild>
                  <Button variant="secondary">{size}</Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay />
                  <Dialog.Content size={size}>
                    <Dialog.Header>
                      <Dialog.Title>Size: {size}</Dialog.Title>
                      <Dialog.Description>The panel max-width scales with size.</Dialog.Description>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Text variant="body-sm" color="secondary">Body content.</Text>
                    </Dialog.Body>
                    <Dialog.Close />
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog>
            ))}
          </div>
        </PreviewRow>
      </section>

      <section>
        <SectionHeader>Controlled</SectionHeader>
        <PreviewRow code={`const [open, setOpen] = useState(false)

<Button onClick={() => setOpen(true)}>Open</Button>
<Dialog open={open} onOpenChange={setOpen}>…</Dialog>`}>
          <div>
            <Button onClick={() => setOpen(true)}>Open controlled</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Controlled dialog</Dialog.Title>
                    <Dialog.Description>Driven by external state.</Dialog.Description>
                  </Dialog.Header>
                  <Dialog.Footer>
                    <Dialog.Close asChild>
                      <Button variant="primary">Got it</Button>
                    </Dialog.Close>
                  </Dialog.Footer>
                  <Dialog.Close />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog>
          </div>
        </PreviewRow>
      </section>

      <PropsTable title="Props · Dialog" rows={ROOT_PROPS} />
      <PropsTable title="Compound parts" rows={PART_PROPS} />

      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport label="Named import" code={`import { Dialog } from '@swift/components'`} />
          <CopyableImport label="Deep import" code={`import { Dialog } from '@swift/components/Dialog'`} />
        </div>
      </section>
    </div>
  )
}
