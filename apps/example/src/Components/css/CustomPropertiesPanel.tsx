import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive CSS custom-properties (variables) lesson. The sliders set
 * real `--vars` on a container via inline style; the card and its
 * children consume them with `var()`, so changing one variable retints /
 * resizes everything that references it — live cascade + inheritance.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

function SliderRow({
  label,
  value,
  min,
  max,
  suffix = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between">
        <Text variant="body-xs" fontFamily="mono" color="secondary">
          {label}
        </Text>
        <Text variant="body-xs" fontFamily="mono" color="primary">
          {value}
          {suffix}
        </Text>
      </div>
      <Slider value={[value]} min={min} max={max} step={1} onValueChange={([v]) => onChange(v)} aria-label={label} />
    </div>
  )
}

const DESCRIPTION =
  'Custom properties — “CSS variables” — store a value under a `--name` and read it back with `var(--name)`. They inherit down the tree, can be overridden per-scope, cascade like any property, and update live at runtime. That makes them the backbone of theming and design tokens.'

export function CustomPropertiesPanel() {
  const [hue, setHue] = useState(210)
  const [radius, setRadius] = useState(12)
  const [space, setSpace] = useState(16)

  // Real custom properties set on the container; children read them via var().
  const vars = {
    '--demo-hue': hue,
    '--demo-radius': `${radius}px`,
    '--demo-space': `${space}px`,
  } as CSSProperties

  const css = useMemo(
    () =>
      `:root {
  --demo-hue: ${hue};
  --demo-radius: ${radius}px;
  --demo-space: ${space}px;
}

.card {
  background: hsl(var(--demo-hue) 75% 96%);
  border: 1px solid hsl(var(--demo-hue) 60% 60%);
  border-radius: var(--demo-radius);
  padding: var(--demo-space);
  gap: var(--demo-space);
}
.tag { background: hsl(var(--demo-hue) 70% 55%); }`,
    [hue, radius, space],
  )

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Custom properties
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Playground · one variable, many consumers</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{
                ...vars,
                display: 'flex',
                flexDirection: 'column',
                background: 'hsl(var(--demo-hue) 75% 96%)',
                border: '1px solid hsl(var(--demo-hue) 60% 60%)',
                borderRadius: 'var(--demo-radius)',
                padding: 'var(--demo-space)',
                gap: 'var(--demo-space)',
                width: '100%',
                maxWidth: 320,
              }}
            >
              <span style={{ color: 'hsl(var(--demo-hue) 60% 30%)', fontWeight: 700 }}>
                Themed card
              </span>
              <div style={{ display: 'flex', gap: 'calc(var(--demo-space) / 2)', flexWrap: 'wrap' }}>
                {['One', 'Two', 'Three'].map((t) => (
                  <span
                    key={t}
                    style={{
                      background: 'hsl(var(--demo-hue) 70% 55%)',
                      color: '#fff',
                      borderRadius: 'calc(var(--demo-radius) / 1.5)',
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
              {/* Scoped override: this nested block redefines --demo-hue. */}
              <div
                style={{
                  ['--demo-hue' as string]: (hue + 150) % 360,
                  background: 'hsl(var(--demo-hue) 75% 95%)',
                  border: '1px dashed hsl(var(--demo-hue) 60% 55%)',
                  borderRadius: 'calc(var(--demo-radius) / 1.5)',
                  padding: 'calc(var(--demo-space) / 1.5)',
                  color: 'hsl(var(--demo-hue) 55% 30%)',
                  fontSize: 12,
                  fontWeight: 600,
                } as CSSProperties}
              >
                nested scope · overrides --demo-hue
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
              variables
            </Text>
            <SliderRow label="--demo-hue" value={hue} min={0} max={360} suffix="°" onChange={setHue} />
            <SliderRow label="--demo-radius" value={radius} min={0} max={28} suffix="px" onChange={setRadius} />
            <SliderRow label="--demo-space" value={space} min={4} max={32} suffix="px" onChange={setSpace} />
            <Text variant="body-xs" color="muted">
              The card, tags, and nested block all read the same variables — change one and
              everything downstream updates. The dashed block re-defines{' '}
              <code>--demo-hue</code> for its own subtree.
            </Text>
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={css} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Things to know</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['Inherits', 'A variable set on an element is visible to all its descendants — unlike most properties you’d have to re-declare.'],
            ['Scoped overrides', 'Re-declare --name on a child to change it for that subtree only. This is how component variants work.'],
            ['Fallbacks', 'var(--maybe, 8px) uses 8px when --maybe is unset — safe defaults without errors.'],
            ['Runtime', 'JS can read/write them: element.style.setProperty("--name", value). Perfect for theming & live controls.'],
          ].map(([t, b]) => (
            <div key={t} className="flex flex-col gap-1 rounded-xl border border-stroke bg-surface-elevated p-5">
              <Text variant="body-sm" fontWeight="semibold" color="primary">
                {t}
              </Text>
              <Text variant="body-xs" color="secondary">
                {b}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          This whole design system is built on them — every token is a <code>--color-*</code> /{' '}
          <code>--space-*</code> variable, which is how light and dark themes swap with no
          per-component logic.
        </Text>
      </section>
    </div>
  )
}
