import { useRef, useState } from 'react'
import { Button } from '@swift/components/Button'
import { Sheet } from '@swift/components/Sheet'
import type { SheetSide, SheetSize } from '@swift/components/Sheet'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Accessible slide-over / drawer built as a Radix-style compound API. Controlled & uncontrolled, four sides, four sizes, modal & non-modal, focus trap with restore, scroll lock, inert background, nested-overlay aware, slide/fade animations, and fully themed via CSS variables.'

const SIDES: ReadonlyArray<SheetSide> = ['left', 'right', 'top', 'bottom']
const SIZES: ReadonlyArray<SheetSize> = ['sm', 'md', 'lg', 'full']

/** Reusable demo content so each example stays focused on the behaviour. */
function FilterSheetBody() {
  return (
    <>
      <Sheet.Header>
        <Sheet.Title>Flight filters</Sheet.Title>
        <Sheet.Description>
          Narrow results by stops, price, and airline.
        </Sheet.Description>
        <Sheet.Close />
      </Sheet.Header>

      <Sheet.Body>
        <div className="grid gap-4">
          {['Non-stop only', 'Refundable fares', 'Free baggage', 'Morning departures'].map(
            (label) => (
              <label
                key={label}
                className="flex items-center gap-3 text-sm text-content"
              >
                <input type="checkbox" className="size-4 accent-[var(--color-surface-brand)]" />
                {label}
              </label>
            ),
          )}
          <div className="h-40 rounded-lg border border-dashed border-stroke bg-surface-muted" />
          <Text variant="body-xs" color="muted">
            Scroll the page behind this sheet — in modal mode the background is
            locked and inert.
          </Text>
        </div>
      </Sheet.Body>

      <Sheet.Footer>
        <Sheet.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Sheet.Close>
        <Sheet.Close asChild>
          <Button variant="primary">Apply filters</Button>
        </Sheet.Close>
      </Sheet.Footer>
    </>
  )
}

export function SheetPanel() {
  const [side, setSide] = useState<SheetSide>('right')
  const [sideOpen, setSideOpen] = useState(false)

  const [size, setSize] = useState<SheetSize>('md')
  const [sizeOpen, setSizeOpen] = useState(false)

  const [controlledOpen, setControlledOpen] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Sheet
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* Basic ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Basic · uncontrolled · asChild trigger</SectionHeader>
        <PreviewRow
          code={`<Sheet>
  <Sheet.Trigger asChild>
    <Button variant="primary">Open filters</Button>
  </Sheet.Trigger>
  <Sheet.Portal>
    <Sheet.Overlay />
    <Sheet.Content side="right">
      <Sheet.Header>
        <Sheet.Title>Flight filters</Sheet.Title>
        <Sheet.Description>Narrow your results.</Sheet.Description>
        <Sheet.Close />
      </Sheet.Header>
      <Sheet.Body>{/* filter controls */}</Sheet.Body>
      <Sheet.Footer>
        <Sheet.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Sheet.Close>
        <Sheet.Close asChild>
          <Button>Apply filters</Button>
        </Sheet.Close>
      </Sheet.Footer>
    </Sheet.Content>
  </Sheet.Portal>
</Sheet>`}
        >
          <Sheet>
            <Sheet.Trigger asChild>
              <Button variant="primary">Open filters</Button>
            </Sheet.Trigger>
            <Sheet.Portal>
              <Sheet.Overlay />
              <Sheet.Content side="right">
                <FilterSheetBody />
              </Sheet.Content>
            </Sheet.Portal>
          </Sheet>
        </PreviewRow>
      </section>

      {/* Sides ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Side positioning</SectionHeader>
        <PreviewRow
          code={`<Sheet.Content side="left">   …</Sheet.Content>
<Sheet.Content side="right">  …</Sheet.Content>
<Sheet.Content side="top">    …</Sheet.Content>
<Sheet.Content side="bottom"> …</Sheet.Content>`}
        >
          {SIDES.map((s) => (
            <Button
              key={s}
              variant={s === side && sideOpen ? 'primary' : 'secondary'}
              onClick={() => {
                setSide(s)
                setSideOpen(true)
              }}
            >
              {s}
            </Button>
          ))}
        </PreviewRow>
        <Sheet open={sideOpen} onOpenChange={setSideOpen}>
          <Sheet.Portal>
            <Sheet.Overlay />
            <Sheet.Content side={side}>
              <FilterSheetBody />
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet>
      </section>

      {/* Sizes ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Sizes (sm · md · lg · full)</SectionHeader>
        <PreviewRow
          code={`<Sheet.Content side="right" size="sm" />
<Sheet.Content side="right" size="md" />   {/* default */}
<Sheet.Content side="right" size="lg" />
<Sheet.Content side="right" size="full" />

{/* Width is driven by the --sheet-width token —
    consumers can override per-sheet: style={{ '--sheet-width': '30rem' }} */}`}
        >
          {SIZES.map((sz) => (
            <Button
              key={sz}
              variant="secondary"
              onClick={() => {
                setSize(sz)
                setSizeOpen(true)
              }}
            >
              {sz}
            </Button>
          ))}
        </PreviewRow>
        <Sheet open={sizeOpen} onOpenChange={setSizeOpen}>
          <Sheet.Portal>
            <Sheet.Overlay />
            <Sheet.Content side="right" size={size}>
              <Sheet.Header>
                <Sheet.Title>Size: {size}</Sheet.Title>
                <Sheet.Description>
                  Width is driven by the <code>--sheet-width</code> token.
                </Sheet.Description>
                <Sheet.Close />
              </Sheet.Header>
              <Sheet.Body>
                <Text variant="body-sm" color="secondary">
                  Resize the window — the sheet never exceeds the viewport.
                </Text>
              </Sheet.Body>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet>
      </section>

      {/* Controlled ────────────────────────────────────────── */}
      <section>
        <SectionHeader>Controlled · initial focus</SectionHeader>
        <PreviewRow
          code={`const [open, setOpen] = useState(false)
const nameRef = useRef<HTMLInputElement>(null)

<Button onClick={() => setOpen(true)}>Edit profile</Button>

<Sheet open={open} onOpenChange={setOpen}>
  <Sheet.Portal>
    <Sheet.Overlay />
    {/* Focus lands on the name field on open. */}
    <Sheet.Content side="right" initialFocusRef={nameRef}>
      <Sheet.Body>
        <input ref={nameRef} defaultValue="Raj" />
      </Sheet.Body>
    </Sheet.Content>
  </Sheet.Portal>
</Sheet>`}
        >
          <Button variant="primary" onClick={() => setControlledOpen(true)}>
            Edit profile
          </Button>
          <Text variant="body-xs" color="muted">
            open = {String(controlledOpen)}
          </Text>
        </PreviewRow>
        <Sheet open={controlledOpen} onOpenChange={setControlledOpen}>
          <Sheet.Portal>
            <Sheet.Overlay />
            <Sheet.Content side="right" initialFocusRef={nameRef}>
              <Sheet.Header>
                <Sheet.Title>Edit profile</Sheet.Title>
                <Sheet.Description>
                  Focus lands on the name field via <code>initialFocusRef</code>.
                </Sheet.Description>
                <Sheet.Close />
              </Sheet.Header>
              <Sheet.Body>
                <label className="grid gap-1.5 text-sm text-content">
                  Name
                  <input
                    ref={nameRef}
                    defaultValue="Raj"
                    className="h-9 rounded-md border border-stroke bg-surface px-3 text-sm text-content-strong outline-none focus:border-stroke-brand focus:ring-2 focus:ring-stroke-brand/20"
                  />
                </label>
              </Sheet.Body>
              <Sheet.Footer>
                <Sheet.Close asChild>
                  <Button variant="outline">Cancel</Button>
                </Sheet.Close>
                <Button variant="primary" onClick={() => setControlledOpen(false)}>
                  Save
                </Button>
              </Sheet.Footer>
            </Sheet.Content>
          </Sheet.Portal>
        </Sheet>
      </section>

      {/* Non-modal ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Non-modal · background stays interactive</SectionHeader>
        <PreviewRow
          code={`{/* No overlay, no scroll lock, no inert background. */}
<Sheet modal={false}>
  <Sheet.Trigger asChild>
    <Button variant="secondary">Open inspector</Button>
  </Sheet.Trigger>
  <Sheet.Portal>
    <Sheet.Content side="right" size="sm">
      …
    </Sheet.Content>
  </Sheet.Portal>
</Sheet>`}
        >
          <Sheet modal={false}>
            <Sheet.Trigger asChild>
              <Button variant="secondary">Open inspector</Button>
            </Sheet.Trigger>
            <Sheet.Portal>
              <Sheet.Content side="right" size="sm">
                <Sheet.Header>
                  <Sheet.Title>Inspector</Sheet.Title>
                  <Sheet.Description>
                    No overlay, no scroll lock — keep using the page.
                  </Sheet.Description>
                  <Sheet.Close />
                </Sheet.Header>
                <Sheet.Body>
                  <Text variant="body-sm" color="secondary">
                    Click outside or press Esc to dismiss. The rest of the app
                    remains clickable.
                  </Text>
                </Sheet.Body>
              </Sheet.Content>
            </Sheet.Portal>
          </Sheet>
        </PreviewRow>
      </section>

      {/* Prevent close ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Prevent close · unsaved form</SectionHeader>
        <PreviewRow
          code={`{/* Useful for payment flows / dirty forms where an
    accidental dismiss loses data. */}
<Sheet.Content
  side="right"
  closeOnEscape={false}
  closeOnInteractOutside={false}
>
  {/* …or use onEscapeKeyDown / onInteractOutside
       and call event.preventDefault() conditionally. */}
</Sheet.Content>`}
        >
          <Sheet>
            <Sheet.Trigger asChild>
              <Button variant="primary">Open payment</Button>
            </Sheet.Trigger>
            <Sheet.Portal>
              <Sheet.Overlay />
              <Sheet.Content
                side="right"
                closeOnEscape={false}
                closeOnInteractOutside={false}
              >
                <Sheet.Header>
                  <Sheet.Title>Payment details</Sheet.Title>
                  <Sheet.Description>
                    Esc and outside-click are disabled — close deliberately.
                  </Sheet.Description>
                </Sheet.Header>
                <Sheet.Body>
                  <Text variant="body-sm" color="secondary">
                    Useful for payment flows and dirty forms where an accidental
                    dismiss loses data.
                  </Text>
                </Sheet.Body>
                <Sheet.Footer>
                  <Sheet.Close asChild>
                    <Button variant="outline">Discard</Button>
                  </Sheet.Close>
                  <Sheet.Close asChild>
                    <Button variant="primary">Pay now</Button>
                  </Sheet.Close>
                </Sheet.Footer>
              </Sheet.Content>
            </Sheet.Portal>
          </Sheet>
        </PreviewRow>
      </section>

      {/* Nested ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Nested overlays · Esc closes top-most first</SectionHeader>
        <PreviewRow
          code={`{/* Nested Sheets work out of the box — focus is trapped in the
    top-most sheet, the outer becomes inert, and Esc closes only
    the top one. */}
<Sheet>
  <Sheet.Trigger asChild><Button>Open outer</Button></Sheet.Trigger>
  <Sheet.Portal>
    <Sheet.Overlay />
    <Sheet.Content side="right">
      <Sheet.Body>
        <Sheet>
          <Sheet.Trigger asChild><Button>Open inner</Button></Sheet.Trigger>
          <Sheet.Portal>
            <Sheet.Overlay />
            <Sheet.Content side="left" size="sm">…</Sheet.Content>
          </Sheet.Portal>
        </Sheet>
      </Sheet.Body>
    </Sheet.Content>
  </Sheet.Portal>
</Sheet>`}
        >
          <Sheet>
            <Sheet.Trigger asChild>
              <Button variant="secondary">Open outer</Button>
            </Sheet.Trigger>
            <Sheet.Portal>
              <Sheet.Overlay />
              <Sheet.Content side="right">
                <Sheet.Header>
                  <Sheet.Title>Outer sheet</Sheet.Title>
                  <Sheet.Description>Open a nested sheet below.</Sheet.Description>
                  <Sheet.Close />
                </Sheet.Header>
                <Sheet.Body>
                  <Sheet>
                    <Sheet.Trigger asChild>
                      <Button variant="primary">Open inner</Button>
                    </Sheet.Trigger>
                    <Sheet.Portal>
                      <Sheet.Overlay />
                      <Sheet.Content side="left" size="sm">
                        <Sheet.Header>
                          <Sheet.Title>Inner sheet</Sheet.Title>
                          <Sheet.Description>
                            Press Esc — only this one closes.
                          </Sheet.Description>
                          <Sheet.Close />
                        </Sheet.Header>
                        <Sheet.Body>
                          <Text variant="body-sm" color="secondary">
                            Focus is trapped here; the outer sheet is inert until
                            this closes.
                          </Text>
                        </Sheet.Body>
                      </Sheet.Content>
                    </Sheet.Portal>
                  </Sheet>
                </Sheet.Body>
              </Sheet.Content>
            </Sheet.Portal>
          </Sheet>
        </PreviewRow>
      </section>

      {/* Accessibility ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">role=&quot;dialog&quot;.</strong>{' '}
            Content sets <code>role=&quot;dialog&quot;</code> and, in modal mode,{' '}
            <code>aria-modal=&quot;true&quot;</code>.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Auto-wired labels.</strong>{' '}
            <code>Sheet.Title</code> and <code>Sheet.Description</code> register
            their ids so the dialog gets <code>aria-labelledby</code> /{' '}
            <code>aria-describedby</code> only when present.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Focus trap + restore.</strong>{' '}
            Focus moves into the sheet on open (or to{' '}
            <code>initialFocusRef</code>), Tab is trapped while modal, and focus
            returns to the trigger on close.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong> Esc closes
            (unless <code>closeOnEscape=false</code>); Tab / Shift+Tab cycle
            within the content.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Inert background.</strong> In
            modal mode every sibling of the portal root is set{' '}
            <code>inert</code> + <code>aria-hidden</code>, so pointers and screen
            readers stay inside the sheet.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Reduced motion.</strong> Slide
            and fade animations collapse to ~0ms under{' '}
            <code>prefers-reduced-motion</code>.
          </Text>
        </div>
      </section>

      {/* Import ─────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Sheet } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Sheet } from '@swift/components/Sheet'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Sheet, type SheetContentProps, type SheetSide, type SheetSize } from '@swift/components'`}
          />
        </div>
      </section>

      {/* Usage ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`<Sheet>
  <Sheet.Trigger asChild>
    <Button>Open</Button>
  </Sheet.Trigger>

  <Sheet.Portal>
    <Sheet.Overlay />
    <Sheet.Content side="right" size="md">
      <Sheet.Header>
        <Sheet.Title>Flight filters</Sheet.Title>
        <Sheet.Description>Update your filters</Sheet.Description>
        <Sheet.Close />
      </Sheet.Header>

      <Sheet.Body>{/* content */}</Sheet.Body>

      <Sheet.Footer>
        <Sheet.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Sheet.Close>
        <Sheet.Close asChild>
          <Button>Apply</Button>
        </Sheet.Close>
      </Sheet.Footer>
    </Sheet.Content>
  </Sheet.Portal>
</Sheet>`}
        />
      </section>
    </div>
  )
}
