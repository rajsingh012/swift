import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { Check } from '@swift/icons/Check'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive block vs inline vs inline-block lesson.
 *
 * The demo boxes are REAL elements — only their `display` changes, so the
 * browser decides whether `width` / `height` / vertical margins take
 * effect. inline boxes genuinely ignore the dimensions you set; block
 * boxes genuinely break onto their own line. Nothing is faked.
 */

type Display = 'block' | 'inline' | 'inline-block'

const DISPLAYS: ReadonlyArray<Display> = ['block', 'inline', 'inline-block']

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

/* The accent used for every demo box — one colour keeps the focus on the
   layout behaviour, not the palette. Palette shades are theme-stable. */
const BOX: CSSProperties = {
  background: 'var(--color-brand-100)',
  border: '1px solid var(--color-brand-300)',
  borderRadius: 4,
  color: 'var(--color-neutral-800)',
  fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  fontSize: 12,
  fontWeight: 600,
  textAlign: 'center',
  verticalAlign: 'middle',
  boxSizing: 'border-box',
}

type BoxValues = {
  width: number
  height: number
  padding: number
  margin: number
}

const DEFAULTS: BoxValues = {
  width: 120,
  height: 44,
  padding: 8,
  margin: 8,
}

const SLIDERS: ReadonlyArray<{
  key: keyof BoxValues
  label: string
  min: number
  max: number
  step: number
}> = [
  { key: 'width', label: 'width', min: 40, max: 240, step: 4 },
  { key: 'height', label: 'height', min: 24, max: 120, step: 4 },
  { key: 'padding', label: 'padding', min: 0, max: 32, step: 2 },
  { key: 'margin', label: 'margin', min: 0, max: 32, step: 2 },
]

/** A single demo element. Only `display` differs between modes. */
function DemoBox({
  display,
  v,
  children,
}: {
  display: Display
  v: BoxValues
  children: ReactNode
}) {
  return (
    <span
      style={{
        ...BOX,
        display,
        width: v.width,
        height: v.height,
        padding: v.padding,
        margin: v.margin,
        // Centre the label when the box is tall enough to honour height.
        lineHeight: display === 'inline' ? undefined : `${Math.max(0, v.height - 2 * v.padding)}px`,
      }}
    >
      {children}
    </span>
  )
}

/** Demo boxes interleaved with running text, so flow is visible. */
function FlowStage({ display, v }: { display: Display; v: BoxValues }) {
  return (
    <div className="text-sm leading-loose text-content-secondary">
      Pack my box with{' '}
      <DemoBox display={display} v={v}>
        one
      </DemoBox>{' '}
      five dozen{' '}
      <DemoBox display={display} v={v}>
        two
      </DemoBox>{' '}
      liquor jugs and a{' '}
      <DemoBox display={display} v={v}>
        three
      </DemoBox>{' '}
      quart of whisky for the journey ahead.
    </div>
  )
}

/* Per-property behaviour by display mode. `true` = takes effect,
   `false` = ignored by the layout engine. */
const MATRIX: ReadonlyArray<{
  prop: string
  block: boolean
  inline: boolean
  'inline-block': boolean
}> = [
  { prop: 'Starts on a new line', block: true, inline: false, 'inline-block': false },
  { prop: 'Sits next to siblings', block: false, inline: true, 'inline-block': true },
  { prop: 'Respects width / height', block: true, inline: false, 'inline-block': true },
  { prop: 'Top / bottom margin', block: true, inline: false, 'inline-block': true },
  { prop: 'Left / right margin', block: true, inline: true, 'inline-block': true },
  { prop: 'Vertical padding shifts layout', block: true, inline: false, 'inline-block': true },
  { prop: 'Fills available width', block: true, inline: false, 'inline-block': false },
]

const BLOCK_TAGS = ['div', 'p', 'h1–h6', 'section', 'article', 'ul / li', 'header', 'footer', 'form']
const INLINE_TAGS = ['span', 'a', 'strong', 'em', 'code', 'img', 'label', 'b / i', 'small']

function Cell({ on }: { on: boolean }) {
  return on ? (
    <span className="inline-flex items-center gap-1 text-content-success">
      <Check size={14} />
      <span className="sr-only">yes</span>
    </span>
  ) : (
    <span aria-label="no" className="text-content-muted">
      —
    </span>
  )
}

/** Live "what applies" list for the selected mode in the playground. */
function AppliesList({ display }: { display: Display }) {
  return (
    <div className="grid gap-1.5">
      {MATRIX.map((row) => {
        const on = row[display]
        return (
          <div key={row.prop} className="flex items-center gap-2">
            <Cell on={on} />
            <Text
              variant="body-xs"
              color={on ? 'secondary' : 'muted'}
              className={on ? '' : 'line-through'}
            >
              {row.prop}
            </Text>
          </div>
        )
      })}
    </div>
  )
}

const DESCRIPTION =
  'Every element has a default outer display type. Block-level elements stack vertically and fill their container; inline elements flow inside text and hug their content, ignoring width / height and vertical margins. inline-block is the hybrid — it flows inline but still accepts box dimensions. Switch the mode and watch the same three boxes rearrange.'

export function BlockInlinePanel() {
  const [display, setDisplay] = useState<Display>('inline-block')
  const [v, setV] = useState<BoxValues>(DEFAULTS)

  const set = (key: keyof BoxValues, value: number) =>
    setV((prev) => ({ ...prev, [key]: value }))

  const isDirty = useMemo(
    () =>
      display !== 'inline-block' ||
      (Object.keys(DEFAULTS) as Array<keyof BoxValues>).some(
        (k) => v[k] !== DEFAULTS[k],
      ),
    [display, v],
  )

  const css = useMemo(
    () =>
      `.box {
  display: ${display};
  width: ${v.width}px;
  height: ${v.height}px;
  padding: ${v.padding}px;
  margin: ${v.margin}px;
}`,
    [display, v],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Block &amp; inline
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
            className="min-h-72 overflow-auto bg-surface-muted p-8"
            style={STAGE_STYLE}
          >
            <div className="rounded-lg border border-dashed border-stroke bg-surface p-5">
              <FlowStage display={display} v={v} />
            </div>
            <Text variant="body-xs" color="muted" className="mt-3 block">
              The dashed frame is the containing block. Watch the boxes break to new
              lines, flow inline, or ignore the dimensions you set.
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
                display
              </Text>
              {isDirty ? (
                <button
                  type="button"
                  onClick={() => {
                    setDisplay('inline-block')
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
              value={display}
              onValueChange={(val) => setDisplay(val as Display)}
              aria-label="display"
            >
              <SegmentedControl.Indicator />
              {DISPLAYS.map((d) => (
                <SegmentedControl.Item key={d} value={d}>
                  {d}
                </SegmentedControl.Item>
              ))}
            </SegmentedControl>

            <div className="flex flex-col gap-4">
              {SLIDERS.map(({ key, label, min, max, step }) => {
                const ignored = display === 'inline' && (key === 'width' || key === 'height')
                return (
                  <div key={key} className="grid gap-1.5">
                    <div className="flex items-baseline justify-between">
                      <Text variant="body-xs" fontFamily="mono" color="secondary">
                        {label}
                        {ignored ? (
                          <span className="ml-1 text-content-muted">(ignored)</span>
                        ) : null}
                      </Text>
                      <Text
                        variant="body-xs"
                        fontFamily="mono"
                        color={ignored ? 'muted' : 'primary'}
                        className={ignored ? 'line-through' : ''}
                      >
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
                )
              })}
            </div>
          </div>

          {/* Applies-list — spans both columns. */}
          <div className="border-t border-stroke bg-surface p-4 md:col-span-2">
            <Text
              variant="body-xs"
              fontWeight="semibold"
              color="muted"
              className="mb-3 block tracking-wide uppercase"
            >
              What <code>display: {display}</code> respects
            </Text>
            <AppliesList display={display} />
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      {/* ── Side by side · default sizing ───────────────────────────── */}
      <section>
        <SectionHeader>The three modes · default sizing</SectionHeader>
        <div className="grid gap-4 lg:grid-cols-3">
          {DISPLAYS.map((mode) => (
            <div
              key={mode}
              className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                display: {mode}
              </Text>
              <div
                className="overflow-auto rounded-lg bg-surface-muted p-4"
                style={STAGE_STYLE}
              >
                <div className="rounded-md border border-dashed border-stroke bg-surface p-3 text-sm leading-loose text-content-secondary">
                  text{' '}
                  <span style={{ ...BOX, display: mode, padding: 6 }}>A</span>{' '}
                  <span style={{ ...BOX, display: mode, padding: 6 }}>B</span>{' '}
                  <span style={{ ...BOX, display: mode, padding: 6 }}>C</span>{' '}
                  more text
                </div>
              </div>
              <Text variant="body-xs" color="secondary">
                {mode === 'block' ? (
                  <>Each box claims its own line and stretches to the full container width.</>
                ) : mode === 'inline' ? (
                  <>Boxes flow within the sentence and shrink to fit their label.</>
                ) : (
                  <>Boxes flow inline like text, yet can take width, height, and margins.</>
                )}
              </Text>
            </div>
          ))}
        </div>
      </section>

      {/* ── Property matrix ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Behaviour at a glance</SectionHeader>
        <div className="overflow-x-auto overscroll-x-contain touch-pan-x rounded-xl border border-stroke bg-surface-elevated">
          <div className="grid min-w-[480px] grid-cols-[1fr_repeat(3,96px)] gap-4 border-b border-stroke bg-surface-muted px-5 py-3">
            <Text variant="body-xs" fontWeight="bold" color="secondary" className="tracking-wider uppercase">
              Property
            </Text>
            {DISPLAYS.map((d) => (
              <Text
                key={d}
                variant="body-xs"
                fontFamily="mono"
                fontWeight="bold"
                color="secondary"
                className="text-center"
              >
                {d}
              </Text>
            ))}
          </div>
          {MATRIX.map((row) => (
            <div
              key={row.prop}
              className="grid min-w-[480px] grid-cols-[1fr_repeat(3,96px)] items-center gap-4 border-b border-stroke-muted px-5 py-3 last:border-0"
            >
              <Text variant="body-sm" color="secondary">
                {row.prop}
              </Text>
              {DISPLAYS.map((d) => (
                <div key={d} className="flex justify-center">
                  <Cell on={row[d]} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Common elements ─────────────────────────────────────────── */}
      <section>
        <SectionHeader>Default display of common tags</SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5">
            <Text variant="body-sm" fontWeight="semibold" color="primary">
              Block-level
            </Text>
            <div className="flex flex-wrap gap-1.5">
              {BLOCK_TAGS.map((tag) => (
                <code
                  key={tag}
                  className="rounded-md bg-surface-brand-muted px-2 py-1 text-xs font-semibold text-content-brand"
                >
                  {tag}
                </code>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 rounded-xl border border-stroke bg-surface-elevated p-5">
            <Text variant="body-sm" fontWeight="semibold" color="primary">
              Inline
            </Text>
            <div className="flex flex-wrap gap-1.5">
              {INLINE_TAGS.map((tag) => (
                <code
                  key={tag}
                  className="rounded-md bg-surface-success-muted px-2 py-1 text-xs font-semibold text-content-success"
                >
                  {tag}
                </code>
              ))}
            </div>
          </div>
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          These are <em>defaults</em> — any element can be re-typed with the{' '}
          <code>display</code> property. <code>{'<img>'}</code> and form controls are
          technically <code>inline-block</code>-like (they honour width / height while
          flowing inline).
        </Text>
      </section>
    </div>
  )
}
