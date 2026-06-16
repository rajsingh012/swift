import { useState, type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive counters & list-markers lesson. The list-style-type demo is
 * live; the hierarchical counter demo uses real `counter-reset` /
 * `counter-increment` + `::before content: counters()` injected as a
 * stylesheet (generated content can't be set inline).
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const COUNTER_CSS = `
.swiftctr { counter-reset: sect; list-style: none; padding-left: 0; margin: 0; }
.swiftctr li { counter-increment: sect; padding: 3px 0; color: var(--color-content); }
.swiftctr li::before {
  content: counters(sect, '.') '  ';
  font-weight: 700; color: var(--color-content-brand);
  font-family: var(--font-mono, ui-monospace, monospace);
}
.swiftctr ol { counter-reset: sect; list-style: none; padding-left: 22px; margin: 0; }
`

const TYPES = [
  'disc',
  'circle',
  'square',
  'decimal',
  'lower-alpha',
  'upper-roman',
  'none',
] as const
type ListType = (typeof TYPES)[number]

export function CountersMarkersPanel() {
  const [type, setType] = useState<ListType>('disc')

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <style>{COUNTER_CSS}</style>

      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Counters &amp; markers
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>list-style-type</code> sets a list&rsquo;s bullet or number, and{' '}
          <code>::marker</code> styles it. For anything beyond a flat list — hierarchical
          numbering, step badges, figure captions — CSS counters (<code>counter-reset</code> /{' '}
          <code>counter-increment</code> read back with <code>counter()</code>) generate the
          labels for you.
        </Text>
      </header>

      <section>
        <SectionHeader>list-style-type</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-h-56 items-center bg-surface-muted p-8" style={STAGE_STYLE}>
            <ul
              style={{ listStyleType: type, paddingInlineStart: 28, margin: 0 }}
              className="flex flex-col gap-1 text-sm text-content"
            >
              <li>Flights</li>
              <li>Hotels</li>
              <li>Trains</li>
              <li>Buses</li>
            </ul>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
              list-style-type
            </Text>
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors ${
                    t === type
                      ? 'bg-surface-brand-muted font-semibold text-content-brand'
                      : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <Text variant="body-xs" color="muted">
              Style just the bullet with <code>li::marker</code> (colour, font, size). Use{' '}
              <code>list-style-type: none</code> + a custom <code>::marker</code> content for full
              control.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={`ul { list-style-type: ${type}; }\nli::marker { color: var(--brand); }`} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Hierarchical counters · 1, 1.1, 1.2 …</SectionHeader>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div className="rounded-xl border border-stroke bg-surface-elevated p-6" style={STAGE_STYLE}>
            <ol className="swiftctr text-sm">
              <li>
                Foundations
                <ol>
                  <li>Tokens</li>
                  <li>Spacing</li>
                </ol>
              </li>
              <li>
                Layout
                <ol>
                  <li>Box model</li>
                  <li>Flexbox</li>
                  <li>Grid</li>
                </ol>
              </li>
              <li>Components</li>
            </ol>
          </div>
          <CodeBlock
            code={`ol { counter-reset: sect; list-style: none; }
li  { counter-increment: sect; }
li::before {
  content: counters(sect, '.') '  ';
  font-weight: 700;
  color: var(--brand);
}`}
          />
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>counter()</code> prints one level; <code>counters(name, '.')</code> joins the
          whole nesting chain with a separator — which is what produces <code>1.1</code>,{' '}
          <code>1.2</code>. Counters also power step badges and auto-numbered figures.
        </Text>
      </section>
    </div>
  )
}
