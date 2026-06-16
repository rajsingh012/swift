import { useState, type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive UX-property lesson: cursor, user-select, pointer-events, and
 * resize. Each sub-demo applies the real property so you can hover, try to
 * select text, click through, and drag a resize handle.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const CARD = 'flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5'

const CURSORS = [
  'auto', 'pointer', 'grab', 'text', 'move', 'not-allowed', 'crosshair', 'help', 'zoom-in', 'wait',
] as const
type Cursor = (typeof CURSORS)[number]

function CursorDemo() {
  const [cursor, setCursor] = useState<Cursor>('pointer')
  return (
    <div className={CARD}>
      <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">cursor</Text>
      <div
        style={{ cursor, ...STAGE_STYLE }}
        className="flex h-24 items-center justify-center rounded-lg border border-dashed border-stroke bg-surface text-sm text-content-secondary"
      >
        hover me · <code className="ml-1">{cursor}</code>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CURSORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCursor(c)}
            className={`cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors ${
              c === cursor ? 'bg-surface-brand-muted font-semibold text-content-brand' : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}

function UserSelectDemo() {
  const [on, setOn] = useState(false)
  return (
    <div className={CARD}>
      <div className="flex items-center justify-between">
        <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">user-select</Text>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className="cursor-pointer rounded-md bg-surface-muted px-2 py-1 font-mono text-xs text-content-secondary hover:bg-surface-subtle"
        >
          {on ? 'none' : 'auto'}
        </button>
      </div>
      <p
        style={{ userSelect: on ? 'none' : 'auto' }}
        className="rounded-lg border border-dashed border-stroke bg-surface p-3 text-sm text-content"
      >
        Try to select this text with your mouse. With <code>user-select: none</code> the
        selection is blocked — useful for buttons and UI chrome you don&rsquo;t want highlighted.
      </p>
      <Text variant="body-xs" color="muted">
        currently <code>user-select: {on ? 'none' : 'auto'}</code>
      </Text>
    </div>
  )
}

function PointerEventsDemo() {
  const [off, setOff] = useState(false)
  const [count, setCount] = useState(0)
  return (
    <div className={CARD}>
      <div className="flex items-center justify-between">
        <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">pointer-events</Text>
        <button
          type="button"
          onClick={() => setOff((v) => !v)}
          className="cursor-pointer rounded-md bg-surface-muted px-2 py-1 font-mono text-xs text-content-secondary hover:bg-surface-subtle"
        >
          {off ? 'none' : 'auto'}
        </button>
      </div>
      <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-stroke bg-surface">
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          style={{ pointerEvents: off ? 'none' : 'auto' }}
          className="cursor-pointer rounded-md border border-stroke bg-surface-brand px-3 py-1.5 text-sm font-semibold text-content-on-brand"
        >
          Click me ({count})
        </button>
      </div>
      <Text variant="body-xs" color="muted">
        With <code>pointer-events: none</code> the button ignores clicks — the count stops rising.
      </Text>
    </div>
  )
}

const RESIZES = ['none', 'both', 'horizontal', 'vertical'] as const
type Resize = (typeof RESIZES)[number]

function ResizeDemo() {
  const [resize, setResize] = useState<Resize>('both')
  return (
    <div className={CARD}>
      <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">resize</Text>
      <div
        style={{ resize, overflow: 'auto', width: 200, height: 90, minWidth: 120, minHeight: 60 }}
        className="rounded-lg border border-stroke bg-surface p-3 text-sm text-content-secondary"
      >
        Drag my bottom-right corner. <code>resize</code> needs <code>overflow</code> other than
        visible.
      </div>
      <div className="flex flex-wrap gap-1.5">
        {RESIZES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setResize(r)}
            className={`cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors ${
              r === resize ? 'bg-surface-brand-muted font-semibold text-content-brand' : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  )
}

export function CursorInteractionPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Cursor &amp; interaction
        </Text>
        <Text variant="para-lg" color="secondary">
          A cluster of properties shape how an element responds to the pointer:{' '}
          <code>cursor</code> sets the pointer glyph, <code>user-select</code> controls text
          selection, <code>pointer-events</code> toggles hit-testing, and <code>resize</code>{' '}
          gives a drag handle. Try each one below.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <CursorDemo />
          <UserSelectDemo />
          <PointerEventsDemo />
          <ResizeDemo />
        </div>
      </section>

      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`.draggable { cursor: grab; }
.chrome    { user-select: none; }      /* don't highlight UI text */
.overlay   { pointer-events: none; }   /* let clicks pass through */
.panel     { pointer-events: auto; }   /* …but re-enable a child */
textarea   { resize: vertical; }       /* allow height drag only */`}
        />
        <Text variant="body-xs" color="muted" className="mt-2 block">
          A common combo: <code>pointer-events: none</code> on a full-screen overlay, then{' '}
          <code>auto</code> on the dialog inside it, so clicks pass through the backdrop but the
          dialog stays interactive.
        </Text>
      </section>
    </div>
  )
}
