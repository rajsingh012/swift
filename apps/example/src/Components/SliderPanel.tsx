import { useState } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CopyableImport } from '../lib/CopyableImport'
import { CodeBlock, PreviewRow, SectionHeader } from './shared'

const DESCRIPTION =
  'Accessible slider built as a compound API. Single-thumb & range, controlled & uncontrolled, four sides of math (LTR / RTL / vertical / inverted), full keyboard support (arrows, PageUp/Down, Home/End), pointer & touch drag with capture, marks / ticks, value readouts, theme tokens, hidden inputs for native forms, and ARIA wired by default.'

type PropRow = {
  name: string
  type: string
  defaultValue?: string
  description: string
}

const SLIDER_PROPS: ReadonlyArray<PropRow> = [
  {
    name: 'value',
    type: 'number[]',
    description:
      'Controlled value array. Single-thumb sliders use `[n]`, range sliders `[lo, hi, …]`. Pair with `onValueChange`.',
  },
  {
    name: 'defaultValue',
    type: 'number[]',
    description:
      'Uncontrolled initial value. Ignored when `value` is provided. The array length determines how many thumbs are rendered.',
  },
  {
    name: 'onValueChange',
    type: '(value: number[]) => void',
    description:
      'Fires on every value change — each drag tick, each key press. High-frequency: keep the body cheap (setState only). For network / save side effects use `onValueCommit`.',
  },
  {
    name: 'onValueCommit',
    type: '(value: number[]) => void',
    description:
      'Fires once at the end of an interaction — pointerup, key release. Use this to persist the value (form submit, API call, URL sync).',
  },
  {
    name: 'min',
    type: 'number',
    defaultValue: '0',
    description: 'Lower bound. Combined with `step` to define the value grid.',
  },
  {
    name: 'max',
    type: 'number',
    defaultValue: '100',
    description: 'Upper bound. Must be ≥ `min` — invalid ranges clamp values to `min`.',
  },
  {
    name: 'step',
    type: 'number',
    defaultValue: '1',
    description:
      'Step size for keyboard / pointer movement. Floating-point steps (e.g. `0.1`) are precision-safe — we snap and clean up float dust internally.',
  },
  {
    name: 'orientation',
    type: `'horizontal' | 'vertical'`,
    defaultValue: `'horizontal'`,
    description:
      'Layout axis. Vertical sliders flip the math so top = max, plus ArrowUp / ArrowDown become the primary increase / decrease keys.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Blocks pointer + keyboard interaction. Thumbs receive `tabIndex={-1}` and the range surface tints down via the disabled token.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Focusable but not editable. Tabs reach the thumbs and screen readers announce the value; key presses + pointer drags are rejected.',
  },
  {
    name: 'inverted',
    type: 'boolean',
    defaultValue: 'false',
    description:
      'Flips the visual + value direction. Useful for "credit remaining" sliders or vertical volume controls where lower visual = higher value.',
  },
  {
    name: 'minStepsBetweenThumbs',
    type: 'number',
    defaultValue: '0',
    description:
      'Minimum number of `step`s that must remain between adjacent range thumbs — stops thumbs colliding or crossing. `1` is the common choice.',
  },
  {
    name: 'name',
    type: 'string',
    description:
      'Renders hidden inputs (one per value) for native form submission. Ranges serialise as `name=lo&name=hi` (standard array form).',
  },
  {
    name: 'dir',
    type: `'ltr' | 'rtl'`,
    description:
      'Reading direction override. When omitted we auto-detect from the closest ancestor `dir` attribute. Horizontal RTL flips pointer math + ArrowLeft / ArrowRight semantics.',
  },
  {
    name: 'format',
    type: '(value: number) => string',
    description:
      'Custom value formatter — used by `<Slider.Value>` and for `aria-valuetext` on each thumb. Pass currency / unit formatters for screen readers.',
  },
  {
    name: 'classes',
    type: '{ root?, track?, range?, thumb?, mark?, label?, value? }',
    description:
      'Slot-level className overrides. Composes with the built-in classes — use for one-off chrome adjustments instead of editing the global tokens.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Appended to the root after the structural classes.',
  },
  {
    name: 'ref',
    type: 'Ref<HTMLSpanElement>',
    description: 'Forwarded to the root span. Useful for measuring or programmatic focus.',
  },
  {
    name: '...rest',
    type: 'HTMLAttributes<HTMLSpanElement>',
    description:
      'Standard span attributes pass through (id, role overrides, data-*, aria-*, event handlers). `role` and `aria-orientation` are managed by the component.',
  },
]

const COMPOUND_PARTS: ReadonlyArray<{ name: string; desc: string }> = [
  {
    name: 'Slider.Track',
    desc: 'The bar children sit on. Pointer events on the track route through the root — clicking anywhere on the bar snaps the nearest thumb to the click and starts a drag from there.',
  },
  {
    name: 'Slider.Range',
    desc: 'The filled portion. Spans `min → value` for single-thumb sliders and `value[0] → value[n]` for ranges. Anchored via CSS logical properties so RTL flips automatically.',
  },
  {
    name: 'Slider.Thumb',
    desc: "A single draggable handle. Owns its own keyboard input (arrows, PageUp/Down, Home/End) and accessibility (`role=\"slider\"`, `aria-valuemin/now/max`, `aria-valuetext`). Each thumb needs an `aria-label` — especially in range sliders.",
  },
  {
    name: 'Slider.Mark',
    desc: 'A tick at a specific value — rating sliders, timelines, fixed price brackets. `data-active="true"` when the mark falls inside the current range, for CSS styling hooks.',
  },
  {
    name: 'Slider.Value',
    desc: 'A read-only readout of the current value. Pass `index` for a specific thumb in a range, `format` for one-off display logic, or a render-prop child for full layout control.',
  },
  {
    name: 'Slider.Label',
    desc: 'Optional text label. A styled `<label>` — passes `htmlFor` through if you want to point at a specific thumb id, otherwise the surrounding form `<label>` semantics apply.',
  },
]

const KEYBOARD_KEYS: ReadonlyArray<{ keys: string; action: string }> = [
  { keys: 'Arrow ↑ / ↓', action: 'Increase / decrease by `step`' },
  {
    keys: 'Arrow → / ←',
    action: 'Same as Up / Down on horizontal; RTL-aware (Right = decrease in RTL)',
  },
  { keys: 'Page Up / Page Down', action: 'Jump by 10 % of the (max − min) range' },
  { keys: 'Home', action: 'Move to `min` (or `max` if `inverted`)' },
  { keys: 'End', action: 'Move to `max` (or `min` if `inverted`)' },
  { keys: 'Tab', action: 'Move focus across thumbs in order' },
]

function PropsTable({ rows }: { rows: ReadonlyArray<PropRow> }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
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

export function SliderPanel() {
  const [single, setSingle] = useState<number[]>([40])
  const [range, setRange] = useState<number[]>([20, 75])
  const [price, setPrice] = useState<number[]>([2000, 8500])
  const [volume, setVolume] = useState<number[]>([60])
  const [committed, setCommitted] = useState<number[]>([40])
  const [tagRange, setTagRange] = useState<number[]>([1, 4])

  // Six category labels — the dual-thumb demo treats the slider as a
  // range across this set, like a year / size / tier filter.
  const TAGS = ['Meta', 'Meta', 'Meta', 'Meta', 'Meta', 'Meta']

  const currency = (v: number) => `₹${v.toLocaleString('en-IN')}`

  return (
    <div className="grid gap-10">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Slider
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      {/* ── Basic · uncontrolled ───────────────────────────── */}
      <section>
        <SectionHeader>Basic · uncontrolled</SectionHeader>
        <PreviewRow
          code={`<Slider defaultValue={[50]} aria-label="Volume" />`}
        >
          <div className="w-full max-w-md">
            <Slider defaultValue={[50]} aria-label="Volume" />
          </div>
        </PreviewRow>
      </section>

      {/* ── Controlled + readout ───────────────────────────── */}
      <section>
        <SectionHeader>Controlled · with readout</SectionHeader>
        <PreviewRow
          code={`const [value, setValue] = useState<number[]>([40])

<Slider value={value} onValueChange={setValue} aria-label="Brightness">
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb aria-label="Brightness" />
</Slider>
<Slider.Value /> → reads the current value`}
        >
          <div className="flex w-full max-w-md flex-col gap-3">
            <div className="flex items-center justify-between">
              <Text variant="body-sm" fontWeight="medium">
                Brightness
              </Text>
              <Slider value={single} onValueChange={setSingle}>
                <Slider.Value />
              </Slider>
            </div>
            <Slider
              value={single}
              onValueChange={setSingle}
              aria-label="Brightness"
            />
          </div>
        </PreviewRow>
      </section>

      {/* ── Range · two thumbs ─────────────────────────────── */}
      <section>
        <SectionHeader>Range · two thumbs with min step gap</SectionHeader>
        <PreviewRow
          code={`<Slider
  defaultValue={[20, 75]}
  minStepsBetweenThumbs={5}
>
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb index={0} aria-label="Minimum" />
  <Slider.Thumb index={1} aria-label="Maximum" />
</Slider>`}
        >
          <div className="flex w-full max-w-md flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="font-mono text-content-strong">{range[0]}</span>
              <span className="font-mono text-content-strong">{range[1]}</span>
            </div>
            <Slider
              value={range}
              onValueChange={setRange}
              minStepsBetweenThumbs={5}
            >
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb index={0} aria-label="Minimum" />
              <Slider.Thumb index={1} aria-label="Maximum" />
            </Slider>
          </div>
        </PreviewRow>
      </section>

      {/* ── Price filter · format + commit ─────────────────── */}
      <section>
        <SectionHeader>Price filter · `format` + `onValueCommit`</SectionHeader>
        <PreviewRow
          code={`const [price, setPrice] = useState([2000, 8500])

<Slider
  value={price}
  onValueChange={setPrice}              // live, every tick
  onValueCommit={(v) => syncToUrl(v)}   // once, on release
  min={0}
  max={15000}
  step={100}
  minStepsBetweenThumbs={5}
  format={(v) => '₹' + v.toLocaleString('en-IN')}
>
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb index={0} aria-label="Minimum price" />
  <Slider.Thumb index={1} aria-label="Maximum price" />
</Slider>`}
        >
          <div className="flex w-full max-w-md flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <Text variant="body-sm" fontWeight="medium">
                Price range
              </Text>
              <Text variant="body-sm" color="muted" className="font-mono">
                {currency(price[0])} – {currency(price[1])}
              </Text>
            </div>
            <Slider
              value={price}
              onValueChange={setPrice}
              min={0}
              max={15000}
              step={100}
              minStepsBetweenThumbs={5}
              format={currency}
            >
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb index={0} aria-label="Minimum price" />
              <Slider.Thumb index={1} aria-label="Maximum price" />
            </Slider>
          </div>
        </PreviewRow>
      </section>

      {/* ── Steps + marks ──────────────────────────────────── */}
      <section>
        <SectionHeader>Steps · with marks</SectionHeader>
        <PreviewRow
          code={`<Slider defaultValue={[60]} min={0} max={100} step={20}>
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb aria-label="Quality" />
  <Slider.Mark value={0}>Low</Slider.Mark>
  <Slider.Mark value={20}>20</Slider.Mark>
  <Slider.Mark value={40}>40</Slider.Mark>
  <Slider.Mark value={60}>60</Slider.Mark>
  <Slider.Mark value={80}>80</Slider.Mark>
  <Slider.Mark value={100}>High</Slider.Mark>
</Slider>`}
        >
          <div className="w-full max-w-md pb-6">
            <Slider defaultValue={[60]} min={0} max={100} step={20}>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb aria-label="Quality" />
              <Slider.Mark value={0}>Low</Slider.Mark>
              <Slider.Mark value={20}>20</Slider.Mark>
              <Slider.Mark value={40}>40</Slider.Mark>
              <Slider.Mark value={60}>60</Slider.Mark>
              <Slider.Mark value={80}>80</Slider.Mark>
              <Slider.Mark value={100}>High</Slider.Mark>
            </Slider>
          </div>
        </PreviewRow>
      </section>

      {/* ── Dense marks · step selector ─────────────────────── */}
      <section>
        <SectionHeader>Dense marks · ticks on the track</SectionHeader>
        <PreviewRow
          code={`{/* Marks render a dot ON the track + label below.
    Active dots flip to content-on-brand (white) when they fall inside
    the value range; inactive dots stay strong-stroke grey on the unfilled
    portion. Both colours route through --slider-mark-dot-bg tokens. */}
<Slider defaultValue={[2]} min={0} max={5} step={1}>
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb aria-label="Model size" />
  {Array.from({ length: 6 }, (_, i) => (
    <Slider.Mark key={i} value={i}>Meta</Slider.Mark>
  ))}
</Slider>`}
        >
          <div className="w-full max-w-xl pb-6">
            <Slider defaultValue={[2]} min={0} max={5} step={1}>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb aria-label="Model size" />
              {Array.from({ length: 6 }, (_, i) => (
                <Slider.Mark key={i} value={i}>
                  Meta
                </Slider.Mark>
              ))}
            </Slider>
          </div>
        </PreviewRow>
      </section>

      {/* ── Range + dense marks ────────────────────────────── */}
      <section>
        <SectionHeader>
          Range + dense marks · selecting a band across discrete steps
        </SectionHeader>
        <PreviewRow
          code={`const [range, setRange] = useState([1, 4])
const TAGS = ['Meta', 'Meta', 'Meta', 'Meta', 'Meta', 'Meta']

<Slider
  value={range}
  onValueChange={setRange}
  min={0}
  max={TAGS.length - 1}
  step={1}
  minStepsBetweenThumbs={1}
>
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb index={0} aria-label="From" />
  <Slider.Thumb index={1} aria-label="To" />
  {TAGS.map((label, i) => (
    <Slider.Mark key={i} value={i}>{label}</Slider.Mark>
  ))}
</Slider>`}
        >
          <div className="flex w-full max-w-xl flex-col gap-3 pb-6">
            <div className="flex items-baseline justify-between">
              <Text variant="body-sm" fontWeight="medium">
                Selected band
              </Text>
              <Text variant="body-sm" color="muted" className="font-mono">
                {TAGS[tagRange[0]]} #{tagRange[0]} → {TAGS[tagRange[1]]} #{tagRange[1]}
              </Text>
            </div>
            <Slider
              value={tagRange}
              onValueChange={setTagRange}
              min={0}
              max={TAGS.length - 1}
              step={1}
              minStepsBetweenThumbs={1}
            >
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumb index={0} aria-label="From" />
              <Slider.Thumb index={1} aria-label="To" />
              {TAGS.map((label, i) => (
                <Slider.Mark key={i} value={i}>
                  {label}
                </Slider.Mark>
              ))}
            </Slider>
          </div>
        </PreviewRow>
      </section>

      {/* ── Vertical orientation ───────────────────────────── */}
      <section>
        <SectionHeader>Vertical · ArrowUp / ArrowDown are the primary keys</SectionHeader>
        <PreviewRow
          code={`<Slider
  orientation="vertical"
  value={volume}
  onValueChange={setVolume}
  aria-label="Volume"
/>`}
        >
          <div className="flex h-56 w-full items-center justify-center gap-8">
            <div className="flex h-full flex-col items-center justify-between">
              <Text variant="body-xs" color="muted">
                max
              </Text>
              <Slider
                orientation="vertical"
                value={volume}
                onValueChange={setVolume}
                aria-label="Volume"
              />
              <Text variant="body-xs" color="muted">
                min
              </Text>
            </div>
            <Text variant="body-sm" color="secondary" className="font-mono">
              value: {volume[0]}
            </Text>
          </div>
        </PreviewRow>
      </section>

      {/* ── States ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>States · disabled · readOnly · inverted</SectionHeader>
        <PreviewRow
          code={`<Slider defaultValue={[40]} disabled aria-label="Disabled" />
<Slider defaultValue={[40]} readOnly aria-label="Read-only" />
<Slider defaultValue={[40]} inverted aria-label="Inverted" />`}
        >
          <div className="flex w-full max-w-md flex-col gap-6">
            <div className="flex flex-col gap-1">
              <Text variant="body-xs" color="muted">
                disabled
              </Text>
              <Slider defaultValue={[40]} disabled aria-label="Disabled" />
            </div>
            <div className="flex flex-col gap-1">
              <Text variant="body-xs" color="muted">
                readOnly · focusable but locked
              </Text>
              <Slider defaultValue={[40]} readOnly aria-label="Read-only" />
            </div>
            <div className="flex flex-col gap-1">
              <Text variant="body-xs" color="muted">
                inverted · max on the left, ArrowRight decreases
              </Text>
              <Slider defaultValue={[40]} inverted aria-label="Inverted" />
            </div>
          </div>
        </PreviewRow>
      </section>

      {/* ── Commit vs change ───────────────────────────────── */}
      <section>
        <SectionHeader>onValueChange vs onValueCommit</SectionHeader>
        <PreviewRow
          code={`<Slider
  onValueChange={setLive}             // every tick — UI sync
  onValueCommit={setCommitted}        // pointerup — persist
  defaultValue={[40]}
/>`}
        >
          <div className="flex w-full max-w-md flex-col gap-3">
            <Slider
              defaultValue={[40]}
              onValueChange={setSingle}
              onValueCommit={setCommitted}
              aria-label="Drag to see both callbacks fire"
            />
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="rounded border border-stroke bg-surface-elevated px-3 py-2">
                <span className="block text-content-muted">live (change)</span>
                <span className="text-content-strong">{single[0]}</span>
              </div>
              <div className="rounded border border-stroke bg-surface-elevated px-3 py-2">
                <span className="block text-content-muted">committed</span>
                <span className="text-content-strong">{committed[0]}</span>
              </div>
            </div>
          </div>
        </PreviewRow>
      </section>

      {/* ── Keyboard reference ─────────────────────────────── */}
      <section>
        <SectionHeader>Keyboard reference</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {KEYBOARD_KEYS.map(({ keys, action }) => (
            <div
              key={keys}
              className="grid grid-cols-[180px_1fr] items-center gap-6 border-b border-stroke-muted px-6 py-3 last:border-0"
            >
              <Text
                variant="body-sm"
                fontFamily="mono"
                fontWeight="semibold"
                color="primary"
              >
                {keys}
              </Text>
              <Text variant="body-sm" color="secondary">
                {action}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Theme tokens ───────────────────────────────────── */}
      <section>
        <SectionHeader>Theme tokens · overrideable per slider or globally</SectionHeader>
        <CodeBlock
          code={`/* On the root, or per slider via style={{ '--slider-thumb-size': '20px' }} */
.swift-slider {
  --slider-track-size:    4px;
  --slider-thumb-size:    16px;
  --slider-track-bg:      var(--color-stroke-muted);
  --slider-range-bg:      var(--color-surface-brand);
  --slider-thumb-bg:      var(--color-surface);
  --slider-thumb-border:  var(--color-stroke-brand);
  --slider-thumb-shadow:  0 1px 2px rgb(0 0 0 / 0.12), 0 0 0 1px rgb(0 0 0 / 0.04);
  --slider-focus-ring:    color-mix(in srgb, var(--color-stroke-brand) 30%, transparent);
}`}
        />
      </section>

      {/* ── Compound parts ─────────────────────────────────── */}
      <section>
        <SectionHeader>Compound parts</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {COMPOUND_PARTS.map(({ name, desc }) => (
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

      {/* ── Props table ────────────────────────────────────── */}
      <section>
        <SectionHeader>Slider · props</SectionHeader>
        <PropsTable rows={SLIDER_PROPS} />
      </section>

      {/* ── Accessibility ──────────────────────────────────── */}
      <section>
        <SectionHeader>Accessibility</SectionHeader>
        <div className="grid gap-2 rounded-xl border border-stroke bg-surface-elevated p-5">
          <Text variant="body-sm">
            <strong className="text-content-strong">role="slider".</strong>{' '}
            Each thumb sets <code>role="slider"</code> with{' '}
            <code>aria-valuemin / valuenow / valuemax / valuetext</code>. The
            value text uses the root's <code>format</code> so screen readers
            announce "₹2,500" instead of bare "2500".
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Labelling.</strong>{' '}
            Single-thumb sliders take an <code>aria-label</code> on the root
            (forwarded to the thumb). Range sliders need an explicit{' '}
            <code>aria-label</code> on each <code>Slider.Thumb</code> — "Min
            price" / "Max price" rather than two thumbs both labelled "Price".
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Keyboard.</strong>{' '}
            Arrows ± `step`, PageUp/Down ± 10 % of (max − min), Home/End jump
            to ends. Right/Left adapt to RTL automatically; Up/Down always
            increase / decrease regardless of orientation.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">Touch.</strong>{' '}
            <code>touch-action: none</code> on the root prevents the browser
            from stealing pan gestures. Pointer events use{' '}
            <code>setPointerCapture</code> so fast drags don't drop tracking
            when the cursor leaves the thumb.
          </Text>
          <Text variant="body-sm">
            <strong className="text-content-strong">SSR-safe.</strong>{' '}
            No <code>window</code> or <code>getBoundingClientRect</code> reads
            during render — initial position comes purely from the value
            percentages. Hydration matches.
          </Text>
        </div>
      </section>

      {/* ── Import ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Import</SectionHeader>
        <div className="grid gap-3">
          <CopyableImport
            label="Named import"
            code={`import { Slider } from '@swift/components'`}
          />
          <CopyableImport
            label="Deep import"
            code={`import { Slider } from '@swift/components/Slider'`}
          />
          <CopyableImport
            label="With types"
            code={`import { Slider, type SliderProps, type SliderOrientation } from '@swift/components'`}
          />
        </div>
      </section>

      {/* ── Usage ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Usage</SectionHeader>
        <CodeBlock
          code={`// Simple — uncontrolled, default shape
<Slider defaultValue={[50]} aria-label="Volume" />

// Controlled
const [value, setValue] = useState<number[]>([50])
<Slider value={value} onValueChange={setValue} aria-label="Brightness" />

// Range with collision gap
<Slider defaultValue={[20, 80]} minStepsBetweenThumbs={1}>
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb index={0} aria-label="Minimum" />
  <Slider.Thumb index={1} aria-label="Maximum" />
</Slider>

// Marks + custom value readout
<Slider defaultValue={[50]} step={25}>
  <Slider.Track><Slider.Range /></Slider.Track>
  <Slider.Thumb aria-label="Quality" />
  <Slider.Mark value={0}>0%</Slider.Mark>
  <Slider.Mark value={50}>50%</Slider.Mark>
  <Slider.Mark value={100}>100%</Slider.Mark>
</Slider>

// Form integration — renders hidden inputs
<form>
  <Slider name="price" defaultValue={[2000]} min={0} max={15000} />
</form>`}
        />
      </section>
    </div>
  )
}
