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

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

/**
 * Three-column props table — Prop · Type · Default · Description.
 * Same structure ButtonPanel uses; lifted here because SheetPanel needs
 * two of them (root + Content) and inlining the JSX twice would just be
 * noise.
 */
function PropsTable({ rows }: { rows: ReadonlyArray<PropRow> }) {
  return (
    <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
      <div className="hidden grid-cols-[200px_1fr_120px] gap-6 border-b border-stroke bg-surface-muted px-6 py-3 md:grid">
        <Text
          variant="body-xs"
          fontWeight="bold"
          color="secondary"
          className="tracking-wider uppercase"
        >
          Prop
        </Text>
        <Text
          variant="body-xs"
          fontWeight="bold"
          color="secondary"
          className="tracking-wider uppercase"
        >
          Type
        </Text>
        <Text
          variant="body-xs"
          fontWeight="bold"
          color="secondary"
          className="tracking-wider uppercase"
        >
          Default
        </Text>
      </div>
      {rows.map(({ name, type, defaultValue, description }) => (
        <div
          key={name}
          className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
        >
          <Text
            variant="body-sm"
            fontFamily="mono"
            fontWeight="semibold"
            color="primary"
          >
            {name}
          </Text>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Text
              variant="body-xs"
              fontFamily="mono"
              color="secondary"
              className="wrap-break-word"
            >
              {type}
            </Text>
            <Text variant="body-sm" color="secondary">
              {description}
            </Text>
          </div>
          <Text
            variant="body-xs"
            fontFamily="mono"
            color={defaultValue ? 'inherit' : 'muted'}
          >
            {defaultValue ?? '—'}
          </Text>
        </div>
      ))}
    </div>
  )
}

/** Props on the Sheet root (<Sheet>) — controls open state + modality. */
const SHEET_ROOT_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'open',
    type: 'boolean',
    description:
      'Controlled open state. Pair with `onOpenChange` to drive the sheet from external state (a query param, a side-panel toggle, a form save flow).',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Uncontrolled initial state. Ignored when `open` is provided. Use this for self-contained sheets that own their own open/close.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description:
      'Fires with the next open state on every open/close request — Trigger click, Close click, Esc, outside click. Required when `open` is controlled.',
  },
  {
    name: 'modal',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Modal blocks the background — overlay, scroll lock, `inert` siblings. Set false for non-modal inspectors / side panels that should leave the page interactive.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    description:
      'The compound parts — typically `<Sheet.Trigger>` and `<Sheet.Portal>` with the content tree inside.',
  },
]

/** Props on <Sheet.Content> — the actual dialog surface. */
const SHEET_CONTENT_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'side',
    type: `'left' | 'right' | 'top' | 'bottom'`,
    defaultValue: `'right'`,
    description:
      'Which edge the sheet slides in from. Drives the slide animation direction and the rounded-corner side (`top` / `bottom` round the inward-facing edge).',
  },
  {
    name: 'size',
    type: `'sm' | 'md' | 'lg' | 'full'`,
    defaultValue: `'md'`,
    description:
      'Sets `--sheet-width` (left/right) or `--sheet-height` (top/bottom). Override the token inline (`style={{ "--sheet-width": "30rem" }}`) for one-off sizes.',
  },
  {
    name: 'forceMount',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Keep the content mounted while closed. Use when an external animation library (Framer Motion, AutoAnimate) owns the exit transition and needs to keep the DOM around.',
  },
  {
    name: 'closeOnEscape',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Dismiss on Escape. Set false for payment / dirty-form flows where an accidental Esc would lose data. The top-most open sheet handles the key — nested sheets close one at a time.',
  },
  {
    name: 'closeOnInteractOutside',
    type: 'boolean',
    defaultValue: 'true',
    description:
      'Dismiss on pointer-down outside the content. Pair with `closeOnEscape={false}` to make the sheet only closeable via its explicit affordances.',
  },
  {
    name: 'initialFocusRef',
    type: 'RefObject<HTMLElement | null>',
    description:
      'Element to focus when the sheet opens. Falls back to the first focusable descendant, then to the content root. Useful for landing focus on a name field in an edit flow.',
  },
  {
    name: 'onEscapeKeyDown',
    type: '(event: KeyboardEvent) => void',
    description:
      'Fires when Esc is pressed (top-most sheet only). Call `event.preventDefault()` to keep the sheet open conditionally — e.g. only when there are unsaved changes.',
  },
  {
    name: 'onInteractOutside',
    type: '(event: PointerEvent) => void',
    description:
      'Fires on pointer-down outside the content. `preventDefault()` keeps the sheet open. Use this to confirm dismissal of dirty forms before closing.',
  },
  {
    name: 'onOpenAutoFocus',
    type: '(event: Event) => void',
    description:
      'Fires just before focus moves into the sheet on open. `preventDefault()` skips the built-in auto-focus so you can manage focus yourself.',
  },
  {
    name: 'onCloseAutoFocus',
    type: '(event: Event) => void',
    description:
      'Fires just before focus is restored to the trigger on close. `preventDefault()` skips the restore — useful when navigating away after a successful save.',
  },
  {
    name: 'className',
    type: 'string',
    description:
      'Appended to the content surface. Use for size overrides (`w-96`), padding tweaks, or custom borders beyond the default token-driven chrome.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLDivElement>',
    description:
      'Forwarded to the rendered content element. Useful for measuring, scrolling, or custom interaction adapters.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes<HTMLDivElement>',
    description:
      'Standard div attributes pass through (id, role overrides, data-*, aria-*, event handlers). `role` defaults to `"dialog"` — override at your own risk.',
  },
]

/** Quick reference to every compound part exported off the Sheet namespace. */
const SHEET_COMPOUND_PARTS: ReadonlyArray<{ name: string; desc: string }> = [
  {
    name: 'Sheet.Trigger',
    desc: 'The element that opens the sheet. Renders a `<button>` by default; pass `asChild` to merge props onto a single child (e.g. your own Button component) for custom chrome without a wrapper.',
  },
  {
    name: 'Sheet.Portal',
    desc: 'Renders its children into a portal so the overlay + content escape transformed / overflow-clipped ancestors. Defaults to `document.body`; override with `container`.',
  },
  {
    name: 'Sheet.Overlay',
    desc: 'The dimmed backdrop. Listens to its own `data-state` for fade animations. Omit it entirely for non-modal sheets — the content slides in over a still-interactive page.',
  },
  {
    name: 'Sheet.Content',
    desc: 'The sliding panel itself. Owns the focus trap, scroll lock, Esc / outside dismissal, and the slide animation. The only required prop is none — `side="right" size="md"` are sensible defaults.',
  },
  {
    name: 'Sheet.Header',
    desc: 'Padded top region. Wraps `Sheet.Title` + `Sheet.Description`. Pairs visually with `Sheet.Close` which positions itself in the top-right corner of this section.',
  },
  {
    name: 'Sheet.Title',
    desc: 'The dialog\'s accessible name. Auto-registers its id so the parent content gets `aria-labelledby` only when present. Pass `as="h2"` etc. to control the heading level.',
  },
  {
    name: 'Sheet.Description',
    desc: 'Secondary text under the title. Auto-registers its id for `aria-describedby`. Omit it entirely if the title alone is enough context.',
  },
  {
    name: 'Sheet.Body',
    desc: 'The scrollable middle region. `overflow-y-auto` by default — a long form scrolls inside the sheet while the Header / Footer stay pinned.',
  },
  {
    name: 'Sheet.Footer',
    desc: 'Pinned actions row at the bottom. Stacks vertically on mobile (`flex-col-reverse`), right-aligns on `sm+` viewports. Place primary action last so it lands at the bottom of the mobile stack.',
  },
  {
    name: 'Sheet.Close',
    desc: 'Dismiss affordance. Renders the corner X by default; pass `asChild` to wrap your own Button (`<Sheet.Close asChild><Button>Cancel</Button></Sheet.Close>`).',
  },
]

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
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
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

      {/* Sheet (root) props ────────────────────────────────── */}
      <section>
        <SectionHeader>Sheet · root props</SectionHeader>
        <PropsTable rows={SHEET_ROOT_PROPS} />
      </section>

      {/* Sheet.Content props ───────────────────────────────── */}
      <section>
        <SectionHeader>Sheet.Content · props</SectionHeader>
        <PropsTable rows={SHEET_CONTENT_PROPS} />
      </section>

      {/* Compound parts ────────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          {SHEET_COMPOUND_PARTS.map(({ name, desc }) => (
            <div
              key={name}
              className="grid gap-1 border-b border-stroke-muted px-6 py-4 last:border-0 md:grid-cols-[200px_1fr] md:items-start md:gap-6"
            >
              <Text
                variant="body-sm"
                fontFamily="mono"
                fontWeight="semibold"
                color="primary"
              >
                {name}
              </Text>
              <Text variant="body-sm" color="secondary">
                {desc}
              </Text>
            </div>
          ))}
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
