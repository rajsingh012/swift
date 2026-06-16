import { useMemo, useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive box-model lesson — the classic `box-sizing: content-box`
 * vs `border-box` demonstration, driven by live sliders.
 *
 * The diagram is a REAL element: it applies the chosen `box-sizing`,
 * `width`, `height`, `padding`, `border`, and `margin` as actual CSS, so
 * the browser does the box-model math and the rendered size genuinely
 * reflects the mode. The coloured layers (margin → border → padding →
 * content) just make each region visible.
 */

type BoxSizing = 'content-box' | 'border-box'

/* Devtools-style region colours. Palette shades are fixed across light /
   dark themes, so the diagram reads identically in both — labels stay
   dark on the pastel fills. */
const REGION = {
  margin: 'var(--color-warning-100)',
  border: 'var(--color-critical-400)',
  padding: 'var(--color-success-100)',
  content: 'var(--color-brand-100)',
} as const
const INK = 'var(--color-neutral-800)'

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

type BoxValues = {
  width: number
  height: number
  padding: number
  border: number
  margin: number
}

const DEFAULTS: BoxValues = {
  width: 200,
  height: 140,
  padding: 24,
  border: 8,
  margin: 20,
}

const SLIDERS: ReadonlyArray<{
  key: keyof BoxValues
  label: string
  min: number
  max: number
  step: number
}> = [
  { key: 'width', label: 'width', min: 80, max: 320, step: 4 },
  { key: 'height', label: 'height', min: 60, max: 240, step: 4 },
  { key: 'padding', label: 'padding', min: 0, max: 48, step: 2 },
  { key: 'border', label: 'border', min: 0, max: 24, step: 1 },
  { key: 'margin', label: 'margin', min: 0, max: 48, step: 2 },
]

/** Derived box-model dimensions for one mode. */
function compute(v: BoxValues, sizing: BoxSizing) {
  const chrome = 2 * v.padding + 2 * v.border
  const contentW =
    sizing === 'border-box' ? Math.max(0, v.width - chrome) : v.width
  const contentH =
    sizing === 'border-box' ? Math.max(0, v.height - chrome) : v.height
  const borderBoxW = sizing === 'border-box' ? v.width : v.width + chrome
  const borderBoxH = sizing === 'border-box' ? v.height : v.height + chrome
  return {
    contentW,
    contentH,
    borderBoxW,
    borderBoxH,
    footprintW: borderBoxW + 2 * v.margin,
    footprintH: borderBoxH + 2 * v.margin,
  }
}

/**
 * The layered box. `box-sizing` / `width` / `height` / `padding` /
 * `border` apply to the real `.element`; the surrounding wrapper paints
 * the margin region (margin itself is transparent in the box model).
 */
function BoxModelDiagram({
  sizing,
  v,
}: {
  sizing: BoxSizing
  v: BoxValues
}) {
  return (
    <div
      style={{
        display: 'inline-block',
        background: REGION.margin,
        padding: v.margin,
        borderRadius: 4,
      }}
    >
      <div
        style={{
          boxSizing: sizing,
          width: v.width,
          height: v.height,
          padding: v.padding,
          borderWidth: v.border,
          borderStyle: 'solid',
          borderColor: REGION.border,
          background: REGION.padding,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: REGION.content,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: INK,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          content
        </div>
      </div>
    </div>
  )
}

function LegendDot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="size-3 shrink-0 rounded-[3px] border border-stroke-muted"
      style={{ background: color }}
    />
  )
}

/** Small live readout of the derived dimensions. */
function Readout({ sizing, v }: { sizing: BoxSizing; v: BoxValues }) {
  const d = compute(v, sizing)
  const rows: ReadonlyArray<{ label: string; value: string; hint?: string }> = [
    {
      label: 'content',
      value: `${d.contentW} × ${d.contentH}`,
      hint: 'the inner area your text / children get',
    },
    {
      label: 'border-box',
      value: `${d.borderBoxW} × ${d.borderBoxH}`,
      hint: 'what the element actually occupies (incl. padding + border)',
    },
    {
      label: 'footprint',
      value: `${d.footprintW} × ${d.footprintH}`,
      hint: 'border-box + margin on both sides',
    },
  ]
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-stroke bg-stroke-muted">
      {rows.map(({ label, value, hint }) => (
        <div
          key={label}
          className="grid grid-cols-[110px_1fr] items-baseline gap-3 bg-surface px-3 py-2"
        >
          <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" color="primary">
            {label}
          </Text>
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <Text
              variant="body-xs"
              fontFamily="mono"
              color="inherit"
              className="text-content-brand"
            >
              {value}
            </Text>
            {hint ? (
              <Text variant="body-xs" color="muted" className="truncate">
                {hint}
              </Text>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

const DESCRIPTION =
  'Every element is a box: content wrapped in padding, a border, and margin. The `box-sizing` property decides what `width` and `height` actually measure — the content alone (`content-box`, the default) or the content plus padding and border (`border-box`). Drag the sliders and watch the same numbers produce two different boxes.'

export function BoxModelPanel() {
  const [sizing, setSizing] = useState<BoxSizing>('border-box')
  const [v, setV] = useState<BoxValues>(DEFAULTS)

  const set = (key: keyof BoxValues, value: number) =>
    setV((prev) => ({ ...prev, [key]: value }))

  const isDirty = useMemo(
    () =>
      sizing !== 'border-box' ||
      (Object.keys(DEFAULTS) as Array<keyof BoxValues>).some(
        (k) => v[k] !== DEFAULTS[k],
      ),
    [sizing, v],
  )

  const css = useMemo(
    () =>
      `.box {
  box-sizing: ${sizing};
  width: ${v.width}px;
  height: ${v.height}px;
  padding: ${v.padding}px;
  border: ${v.border}px solid;
  margin: ${v.margin}px;
}`,
    [sizing, v],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Box model
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Interactive playground ──────────────────────────────────── */}
      <section>
        <SectionHeader>Playground</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          {/* Stage */}
          <div
            className="flex min-h-72 items-center justify-center overflow-auto bg-surface-muted p-8"
            style={STAGE_STYLE}
          >
            <BoxModelDiagram sizing={sizing} v={v} />
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
                box-sizing
              </Text>
              {isDirty ? (
                <button
                  type="button"
                  onClick={() => {
                    setSizing('border-box')
                    setV(DEFAULTS)
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
              value={sizing}
              onValueChange={(val) => setSizing(val as BoxSizing)}
              aria-label="box-sizing"
            >
              <SegmentedControl.Indicator />
              <SegmentedControl.Item value="content-box">content-box</SegmentedControl.Item>
              <SegmentedControl.Item value="border-box">border-box</SegmentedControl.Item>
            </SegmentedControl>

            <div className="flex flex-col gap-4">
              {SLIDERS.map(({ key, label, min, max, step }) => (
                <div key={key} className="grid gap-1.5">
                  <div className="flex items-baseline justify-between">
                    <Text variant="body-xs" fontFamily="mono" color="secondary">
                      {label}
                    </Text>
                    <Text variant="body-xs" fontFamily="mono" color="primary">
                      {v[key]}px
                    </Text>
                  </div>
                  <Slider
                    value={[v[key]]}
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

          {/* Readout + legend + snippet — span both columns. */}
          <div className="grid gap-4 border-t border-stroke bg-surface p-4 md:col-span-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {(['content', 'padding', 'border', 'margin'] as const).map((r) => (
                <span key={r} className="inline-flex items-center gap-1.5">
                  <LegendDot color={REGION[r]} />
                  <Text variant="body-xs" fontFamily="mono" color="secondary">
                    {r} {v[r === 'content' ? 'width' : r]}
                    {r === 'content' ? '' : 'px'}
                  </Text>
                </span>
              ))}
            </div>
            <Readout sizing={sizing} v={v} />
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      {/* ── Side by side ────────────────────────────────────────────── */}
      <section>
        <SectionHeader>content-box vs border-box · same values</SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {(['content-box', 'border-box'] as const).map((mode) => {
            const d = compute(v, mode)
            return (
              <div
                key={mode}
                className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                    box-sizing: {mode}
                  </Text>
                  <Text variant="body-xs" fontFamily="mono" color="muted">
                    occupies {d.borderBoxW} × {d.borderBoxH}
                  </Text>
                </div>
                <div
                  className="flex min-h-56 items-center justify-center overflow-auto rounded-lg bg-surface-muted p-6"
                  style={STAGE_STYLE}
                >
                  <BoxModelDiagram sizing={mode} v={v} />
                </div>
                <Text variant="body-xs" color="secondary">
                  {mode === 'content-box' ? (
                    <>
                      <code>width: {v.width}px</code> sizes the{' '}
                      <strong className="text-content-strong">content</strong> — padding and
                      border are added <em>on top</em>, so the box grows past {v.width}px.
                    </>
                  ) : (
                    <>
                      <code>width: {v.width}px</code> sizes the whole{' '}
                      <strong className="text-content-strong">border-box</strong> — padding and
                      border are absorbed <em>inside</em>, so the box stays exactly {v.width}px.
                    </>
                  )}
                </Text>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── The width formula ───────────────────────────────────────── */}
      <section>
        <SectionHeader>How rendered width is calculated</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-2 rounded-xl border border-stroke bg-surface-inverse p-5">
            <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" className="text-content-inverse">
              content-box (default)
            </Text>
            <Text variant="body-sm" fontFamily="mono" className="text-content-inverse/80">
              rendered = width + padding·2 + border·2
            </Text>
            <Text variant="body-xs" fontFamily="mono" className="text-content-inverse/60">
              {v.width} + {v.padding}·2 + {v.border}·2 = {compute(v, 'content-box').borderBoxW}px
            </Text>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-stroke bg-surface-inverse p-5">
            <Text variant="body-xs" fontFamily="mono" fontWeight="semibold" className="text-content-inverse">
              border-box
            </Text>
            <Text variant="body-sm" fontFamily="mono" className="text-content-inverse/80">
              rendered = width &nbsp;(content shrinks instead)
            </Text>
            <Text variant="body-xs" fontFamily="mono" className="text-content-inverse/60">
              content = {v.width} − {v.padding}·2 − {v.border}·2 = {compute(v, 'border-box').contentW}px
            </Text>
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Margin always sits <em>outside</em> the border-box in both modes, so the total
          footprint adds <code>margin·2</code> on each axis regardless of <code>box-sizing</code>.
        </Text>
      </section>

      {/* ── The global reset ────────────────────────────────────────── */}
      <section>
        <SectionHeader>The one-line reset most apps use</SectionHeader>
        <CodeBlock
          code={`/* Make every element predictable: width means width. */
*,
*::before,
*::after {
  box-sizing: border-box;
}`}
        />
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>border-box</code> is rarely the platform default, so design systems opt in
          globally. Sizes then stay stable when you add padding or a border — the box never
          overflows the width you asked for.
        </Text>
      </section>
    </div>
  )
}
