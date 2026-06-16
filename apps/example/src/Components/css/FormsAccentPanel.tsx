import { useState, type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive accent-color / form-styling lesson. A real `accent-color`
 * (and `caret-color`) is applied to native controls, so checkboxes,
 * radios, the range thumb, and the text caret all retint live.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

export function FormsAccentPanel() {
  const [accent, setAccent] = useState('#5b8def')

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Forms &amp; accent
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>accent-color</code> tints native form controls — checkboxes, radios, range
          sliders, and progress bars — in a single line, while keeping their built-in behaviour
          and accessibility. <code>caret-color</code> recolours the text cursor. The cheapest way
          to brand a form.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground · one property, every control</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-72 items-center justify-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              style={{ accentColor: accent, caretColor: accent }}
              className="flex w-full max-w-xs flex-col gap-4 rounded-lg border border-stroke bg-surface p-5"
            >
              <label className="flex items-center gap-2 text-sm text-content">
                <input type="checkbox" defaultChecked /> Window seat
              </label>
              <label className="flex items-center gap-2 text-sm text-content">
                <input type="checkbox" /> Extra baggage
              </label>
              <div className="flex flex-col gap-1.5">
                <label className="flex items-center gap-2 text-sm text-content">
                  <input type="radio" name="fare" defaultChecked /> Economy
                </label>
                <label className="flex items-center gap-2 text-sm text-content">
                  <input type="radio" name="fare" /> Business
                </label>
              </div>
              <input type="range" defaultValue={60} className="w-full" aria-label="budget" />
              <progress value={0.6} className="w-full" />
              <input
                type="text"
                placeholder="Type to see the caret…"
                className="h-9 rounded-md border border-stroke bg-surface px-2.5 text-sm text-content-strong outline-none focus:border-stroke-brand"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <label className="flex items-center justify-between gap-2">
              <Text variant="body-xs" fontFamily="mono" color="secondary">accent-color</Text>
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="size-8 cursor-pointer rounded-md border border-stroke bg-surface" aria-label="accent color" />
            </label>
            <Text variant="body-xs" color="muted">
              The browser keeps a readable check/track contrast automatically — you only supply
              the accent. Set it once on a wrapper (or <code>:root</code>) and it inherits.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={`form {\n  accent-color: ${accent};\n  caret-color: ${accent};\n}`} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Styling native controls</SectionHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['accent-color', 'Tints checkbox, radio, range, and progress — the first thing to reach for.'],
            ['caret-color', 'Colour of the blinking text-input caret.'],
            ['appearance: none', 'Strips the native look so you can fully restyle a control from scratch.'],
            ['::placeholder / ::file-selector-button', 'Pseudo-elements for placeholder text and the file-input button.'],
          ].map(([t, b]) => (
            <div key={t} className="flex flex-col gap-1 rounded-xl border border-stroke bg-surface-elevated p-5">
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">{t}</Text>
              <Text variant="body-xs" color="secondary">{b}</Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Prefer <code>accent-color</code> over a fully custom control — you keep keyboard
          support, focus rings, and form semantics for free.
        </Text>
      </section>
    </div>
  )
}
