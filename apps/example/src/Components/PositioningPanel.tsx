import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { Check } from '@swift/icons/Check'
import { CodeBlock, SectionHeader } from './shared'

/**
 * Interactive CSS `position` lesson — static / relative / absolute live
 * in the contained playground (their differences show without scrolling),
 * while `sticky` and `fixed` get purpose-built scroll demos, since they
 * fundamentally need a scrolling / viewport context to mean anything.
 *
 * Every box is a REAL element — only its `position` (and offsets) change,
 * so flow removal, offset application, and stacking are all genuine.
 */

type FlowPosition = 'static' | 'relative' | 'absolute'
type AnyPosition = FlowPosition | 'sticky' | 'fixed'

const PLAYGROUND_POSITIONS: ReadonlyArray<FlowPosition> = [
  'static',
  'relative',
  'absolute',
]

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

/* Theme-stable palette accents. */
const LIVE_BOX: CSSProperties = {
  background: 'var(--color-brand-100)',
  border: '1px solid var(--color-brand-400)',
  color: 'var(--color-neutral-800)',
}
const FLOW_BOX: CSSProperties = {
  background: 'var(--color-neutral-50)',
  border: '1px dashed var(--color-neutral-300)',
  color: 'var(--color-neutral-600)',
}

type Offsets = { top: number; right: number; bottom: number; left: number }
const DEFAULTS: Offsets = { top: 24, right: 0, bottom: 0, left: 16 }

const SLIDERS: ReadonlyArray<{
  key: keyof Offsets
  label: string
  min: number
  max: number
  step: number
}> = [
  { key: 'top', label: 'top', min: -40, max: 160, step: 4 },
  { key: 'right', label: 'right', min: -40, max: 220, step: 4 },
  { key: 'bottom', label: 'bottom', min: -40, max: 160, step: 4 },
  { key: 'left', label: 'left', min: -40, max: 220, step: 4 },
]

function flowRow(style: CSSProperties, label: string) {
  return (
    <div
      style={{ ...style, ...flowRowBase }}
      className="rounded-md font-mono text-xs"
    >
      {label}
    </div>
  )
}

const flowRowBase: CSSProperties = {
  padding: '10px 12px',
  marginBottom: 10,
  fontWeight: 600,
}

/** The contained frame: three sibling rows + the live, positioned box. */
function PlaygroundStage({
  position,
  offsets,
}: {
  position: FlowPosition
  offsets: Offsets
}) {
  const positioned = position !== 'static'
  return (
    <div
      style={{ position: 'relative', minHeight: 280, overflow: 'hidden' }}
      className="rounded-lg border border-dashed border-stroke bg-surface p-4"
    >
      {flowRow(FLOW_BOX, 'sibling · static')}
      <div
        style={{
          ...LIVE_BOX,
          ...flowRowBase,
          position,
          top: positioned ? offsets.top : undefined,
          right: positioned ? offsets.right : undefined,
          bottom: positioned ? offsets.bottom : undefined,
          left: positioned ? offsets.left : undefined,
          boxShadow: positioned ? 'var(--shadow-level2)' : undefined,
          borderRadius: 6,
        }}
        className="font-mono text-xs"
      >
        position: {position}
      </div>
      {flowRow(FLOW_BOX, 'sibling · static')}
      {flowRow(FLOW_BOX, 'sibling · static')}
    </div>
  )
}

type Behaviour = {
  flow: boolean
  offsets: boolean
  zIndex: boolean
  relativeTo: string
  scrolls: ReactNode
}

const BEHAVIOUR: Record<AnyPosition, Behaviour> = {
  static: {
    flow: true,
    offsets: false,
    zIndex: false,
    relativeTo: 'normal document flow',
    scrolls: true,
  },
  relative: {
    flow: true,
    offsets: true,
    zIndex: true,
    relativeTo: 'its own normal position',
    scrolls: true,
  },
  absolute: {
    flow: false,
    offsets: true,
    zIndex: true,
    relativeTo: 'nearest positioned ancestor',
    scrolls: true,
  },
  sticky: {
    flow: true,
    offsets: true,
    zIndex: true,
    relativeTo: 'nearest scrolling ancestor',
    scrolls: 'until stuck',
  },
  fixed: {
    flow: false,
    offsets: true,
    zIndex: true,
    relativeTo: 'the viewport',
    scrolls: false,
  },
}

function Cell({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex items-center text-content-success">
      <Check size={14} />
      <span className="sr-only">yes</span>
    </span>
  ) : (
    <span aria-label="no" className="text-content-muted">
      —
    </span>
  )
}

/** Live "what applies" readout for the selected playground position. */
function Readout({ position }: { position: FlowPosition }) {
  const b = BEHAVIOUR[position]
  const checks: ReadonlyArray<{ label: string; on: boolean }> = [
    { label: 'Stays in normal flow', on: b.flow },
    { label: 'Offset props apply', on: b.offsets },
    { label: 'z-index applies', on: b.zIndex },
  ]
  return (
    <div className="grid gap-1.5">
      {checks.map(({ label, on }) => (
        <div key={label} className="flex items-center gap-2">
          <span className="flex w-4 shrink-0 justify-center">
            <Cell on={on} />
          </span>
          <Text variant="body-xs" color="secondary">
            {label}
          </Text>
        </div>
      ))}
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pl-6">
        <Text variant="body-xs" color="secondary">
          Positioned relative to
        </Text>
        <Text
          variant="body-xs"
          fontFamily="mono"
          color="inherit"
          className="text-content-brand"
        >
          {b.relativeTo}
        </Text>
      </div>
    </div>
  )
}

/* ── Sticky scroll demo ───────────────────────────────────────────── */

const STICKY_SECTIONS = [
  { title: 'A — Departures', items: ['06:20 DEL → GOX', '07:45 DEL → BOM', '09:10 DEL → BLR'] },
  { title: 'B — Arrivals', items: ['08:50 GOX', '10:15 BOM', '11:40 BLR'] },
  { title: 'C — Delayed', items: ['12:05 → 13:30', '14:20 → 15:10', '16:00 → 17:25'] },
]

function StickyDemo() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5">
      <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
        position: sticky
      </Text>
      <div className="h-64 overflow-y-auto overscroll-contain rounded-lg border border-stroke bg-surface">
        {STICKY_SECTIONS.map((s) => (
          <section key={s.title}>
            <div
              style={{ position: 'sticky', top: 0 }}
              className="z-1 border-b border-stroke bg-surface-brand-muted px-4 py-2 text-xs font-semibold text-content-brand backdrop-blur"
            >
              {s.title}
            </div>
            <ul className="divide-y divide-stroke-muted">
              {s.items.concat(s.items).map((item, i) => (
                <li key={i} className="px-4 py-3 text-sm text-content-secondary">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Text variant="body-xs" color="secondary">
        Each header scrolls normally until it hits <code>top: 0</code>, then pins to the
        scroll container&rsquo;s edge until the next section pushes it off.
      </Text>
    </div>
  )
}

/* ── Fixed scroll demo ────────────────────────────────────────────── */

function FixedDemo() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5">
      <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
        position: fixed
      </Text>
      {/* `transform` makes THIS non-scrolling frame the containing block
          for the fixed child, so it pins to the frame while the inner
          list scrolls. The button stays OUTSIDE the scroller — a child of
          the scroll container would scroll with its content. Real fixed
          targets the browser viewport — noted below. */}
      <div
        style={{ position: 'relative', transform: 'translateZ(0)' }}
        className="h-64 overflow-hidden rounded-lg border border-stroke bg-surface"
      >
        <div className="h-full overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-3 p-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="rounded-md border border-stroke-muted bg-surface-muted px-4 py-3 text-sm text-content-secondary"
              >
                Scrollable row {i + 1}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          style={{ position: 'fixed', bottom: 16, right: 16 }}
          className="flex size-11 items-center justify-center rounded-full bg-surface-brand text-content-on-brand shadow-level3"
          aria-label="Fixed action button"
        >
          <span className="text-lg leading-none">+</span>
        </button>
      </div>
      <Text variant="body-xs" color="secondary">
        The button stays put while the rows scroll behind it. Normally <code>fixed</code> is
        relative to the <strong className="text-content-strong">viewport</strong>; here a
        transformed ancestor contains it so it pins to the frame.
      </Text>
    </div>
  )
}

/* ── z-index / stacking demo ──────────────────────────────────────── */

function ZIndexDemo() {
  const [z, setZ] = useState(0)
  const greenOnTop = z > 1
  return (
    <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_240px]">
      <div
        className="relative flex min-h-56 items-center justify-center bg-surface-muted p-8"
        style={STAGE_STYLE}
      >
        <div style={{ position: 'relative', width: 220, height: 130 }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 130,
              height: 90,
              zIndex: 1,
              background: 'var(--color-critical-200)',
              border: '1px solid var(--color-critical-400)',
              color: 'var(--color-neutral-800)',
            }}
            className="flex items-center justify-center rounded-lg font-mono text-xs font-semibold"
          >
            z-index: 1
          </div>
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 70,
              width: 130,
              height: 90,
              zIndex: z,
              background: 'var(--color-brand-200)',
              border: '1px solid var(--color-brand-400)',
              color: 'var(--color-neutral-800)',
            }}
            className="flex items-center justify-center rounded-lg font-mono text-xs font-semibold"
          >
            z-index: {z}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
        <div className="grid gap-1.5">
          <div className="flex items-baseline justify-between">
            <Text variant="body-xs" fontFamily="mono" color="secondary">
              green z-index
            </Text>
            <Text variant="body-xs" fontFamily="mono" color="primary">
              {z}
            </Text>
          </div>
          <Slider
            value={[z]}
            min={0}
            max={3}
            step={1}
            onValueChange={([next]) => setZ(next)}
            aria-label="green z-index"
          />
        </div>
        <Text variant="body-xs" color="secondary">
          Both boxes are <code>absolute</code>. The green box paints{' '}
          <strong className="text-content-strong">
            {greenOnTop ? 'in front of' : 'behind'}
          </strong>{' '}
          the red one. A higher <code>z-index</code> wins; ties fall back to DOM order.
        </Text>
        <Text variant="body-xs" color="muted">
          <code>z-index</code> only affects positioned elements (and flex / grid items).
        </Text>
      </div>
    </div>
  )
}

/* ── Matrix ───────────────────────────────────────────────────────── */

const ALL_POSITIONS: ReadonlyArray<AnyPosition> = [
  'static',
  'relative',
  'absolute',
  'sticky',
  'fixed',
]

const MATRIX: ReadonlyArray<{ label: string; render: (b: Behaviour) => ReactNode }> = [
  { label: 'Stays in normal flow', render: (b) => <Cell on={b.flow} /> },
  { label: 'Offset props apply', render: (b) => <Cell on={b.offsets} /> },
  { label: 'z-index applies', render: (b) => <Cell on={b.zIndex} /> },
  {
    label: 'Positioned relative to',
    render: (b) => (
      <Text variant="body-xs" color="secondary" className="text-center">
        {b.relativeTo}
      </Text>
    ),
  },
  {
    label: 'Moves when page scrolls',
    render: (b) =>
      typeof b.scrolls === 'boolean' ? (
        <Cell on={b.scrolls} />
      ) : (
        <Text variant="body-xs" color="secondary" className="text-center">
          {b.scrolls}
        </Text>
      ),
  },
]

const DESCRIPTION =
  'The `position` property decides how an element is placed and whether the `top` / `right` / `bottom` / `left` offsets do anything. `static` is the default (in flow, offsets ignored); `relative` nudges from the normal spot; `absolute` is lifted out of flow and pinned to the nearest positioned ancestor; `sticky` toggles between relative and fixed as you scroll; `fixed` locks to the viewport.'

export function PositioningPanel() {
  const [position, setPosition] = useState<FlowPosition>('relative')
  const [offsets, setOffsets] = useState<Offsets>(DEFAULTS)

  const set = (key: keyof Offsets, value: number) =>
    setOffsets((prev) => ({ ...prev, [key]: value }))

  const isDirty = useMemo(
    () =>
      position !== 'relative' ||
      (Object.keys(DEFAULTS) as Array<keyof Offsets>).some(
        (k) => offsets[k] !== DEFAULTS[k],
      ),
    [position, offsets],
  )

  const offsetsApply = position !== 'static'

  const css = useMemo(() => {
    if (position === 'static') {
      return `.box {
  position: static;
  /* top / left are ignored while static */
}`
    }
    return `.box {
  position: ${position};
  top: ${offsets.top}px;
  right: ${offsets.right}px;
  bottom: ${offsets.bottom}px;
  left: ${offsets.left}px;
}`
  }, [position, offsets])

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Positioning
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Interactive playground ──────────────────────────────────── */}
      <section>
        <SectionHeader>Playground · static · relative · absolute</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          {/* Stage */}
          <div className="overflow-auto bg-surface-muted p-8" style={STAGE_STYLE}>
            <PlaygroundStage position={position} offsets={offsets} />
            <Text variant="body-xs" color="muted" className="mt-3 block">
              The dashed frame is a <code>position: relative</code> ancestor. Note how{' '}
              <code>absolute</code> lifts the box out and the siblings close the gap.
            </Text>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="flex items-center justify-between">
              <Text
                variant="body-xs"
                fontWeight="semibold"
                color="muted"
                className="tracking-wide uppercase"
              >
                position
              </Text>
              {isDirty ? (
                <button
                  type="button"
                  onClick={() => {
                    setPosition('relative')
                    setOffsets(DEFAULTS)
                  }}
                  className="anim-fade-in cursor-pointer text-xs font-semibold text-content-brand hover:underline"
                >
                  Reset
                </button>
              ) : null}
            </div>

            <SegmentedControl
              size="sm"
              fullWidth
              value={position}
              onValueChange={(val) => setPosition(val as FlowPosition)}
              aria-label="position"
            >
              <SegmentedControl.Indicator />
              {PLAYGROUND_POSITIONS.map((p) => (
                <SegmentedControl.Item key={p} value={p}>
                  {p}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl>

            <div className="flex flex-col gap-4">
              {SLIDERS.map(({ key, label, min, max, step }) => (
                <div key={key} className="grid gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <Text variant="body-xs" fontFamily="mono" color="secondary">
                      {label}
                      {!offsetsApply ? (
                        <span className="ml-1 text-content-muted">(ignored)</span>
                      ) : null}
                    </Text>
                    <Text
                      variant="body-xs"
                      fontFamily="mono"
                      color={offsetsApply ? 'primary' : 'muted'}
                      className={offsetsApply ? '' : 'line-through'}
                    >
                      {offsets[key]}px
                    </Text>
                  </div>
                  <Slider
                    value={[offsets[key]]}
                    min={min}
                    max={max}
                    step={step}
                    onValueChange={([next]) => set(key, next)}
                    aria-label={label}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Readout — spans both columns. */}
          <div className="border-t border-stroke bg-surface p-4 md:col-span-2">
            <Text
              variant="body-xs"
              fontWeight="semibold"
              color="muted"
              className="mb-3 block tracking-wide uppercase"
            >
              What <code>position: {position}</code> does
            </Text>
            <Readout position={position} />
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      {/* ── Scroll-based positions ──────────────────────────────────── */}
      <section>
        <SectionHeader>Scroll-based · sticky &amp; fixed</SectionHeader>
        <div className="grid gap-4 lg:grid-cols-2">
          <StickyDemo />
          <FixedDemo />
        </div>
      </section>

      {/* ── z-index ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Stacking · z-index</SectionHeader>
        <ZIndexDemo />
      </section>

      {/* ── Matrix ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Behaviour at a glance</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          <div className="grid min-w-[640px] grid-cols-[180px_repeat(5,1fr)] gap-3 border-b border-stroke bg-surface-muted px-5 py-3">
            <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
              Property
            </Text>
            {ALL_POSITIONS.map((p) => (
              <Text
                key={p}
                variant="body-xs"
                fontFamily="mono"
                fontWeight="bold"
                color="secondary"
                className="text-center"
              >
                {p}
              </Text>
            ))}
          </div>
          {MATRIX.map((row) => (
            <div
              key={row.label}
              className="grid min-w-[640px] grid-cols-[180px_repeat(5,1fr)] items-center gap-3 border-b border-stroke-muted px-5 py-3 last:border-0"
            >
              <Text variant="body-sm" color="secondary">
                {row.label}
              </Text>
              {ALL_POSITIONS.map((p) => (
                <div key={p} className="flex justify-center">
                  {row.render(BEHAVIOUR[p])}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Notes ───────────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Gotchas worth remembering</SectionHeader>
        <ul className="grid gap-2">
          {[
            <>
              <strong className="text-content-strong">&ldquo;Positioned&rdquo;</strong> means
              any value other than <code>static</code>. An <code>absolute</code> child looks{' '}
              <em>up</em> the tree for the nearest positioned ancestor — so you usually set{' '}
              <code>position: relative</code> on the parent to anchor it.
            </>,
            <>
              <code>top / right / bottom / left</code> and <code>z-index</code> do{' '}
              <em>nothing</em> on a <code>static</code> element — the default for every box.
            </>,
            <>
              <code>fixed</code> escapes to the viewport, <em>unless</em> an ancestor has a{' '}
              <code>transform</code>, <code>filter</code>, or <code>will-change</code> — that
              ancestor then becomes its containing block.
            </>,
            <>
              <code>sticky</code> needs a scrolling ancestor and at least one offset
              (e.g. <code>top: 0</code>) to have something to stick against.
            </>,
          ].map((note, i) => (
            <li key={i} className="flex gap-2">
              <span aria-hidden className="select-none text-content-muted">
                •
              </span>
              <Text variant="body-sm" color="secondary">
                {note}
              </Text>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
