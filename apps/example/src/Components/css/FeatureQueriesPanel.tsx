import { useMemo, type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { Check } from '@swift/icons/Check'
import { Close } from '@swift/icons/Close'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Feature-queries lesson. The support table runs real `CSS.supports()`
 * checks (the JS mirror of `@supports`), so the ticks reflect THIS
 * browser. Progressive enhancement = ship a baseline, then gate the
 * upgrade behind a query.
 */

type Feature = { label: string } & (
  | { prop: string; value: string }
  | { condition: string }
)

const FEATURES: ReadonlyArray<Feature> = [
  { label: 'display: grid', prop: 'display', value: 'grid' },
  { label: 'aspect-ratio', prop: 'aspect-ratio', value: '1 / 1' },
  { label: 'gap (flex)', prop: 'gap', value: '1px' },
  { label: 'container-type', prop: 'container-type', value: 'inline-size' },
  { label: 'backdrop-filter', prop: 'backdrop-filter', value: 'blur(2px)' },
  { label: 'color: oklch()', prop: 'color', value: 'oklch(0.7 0.1 200)' },
  { label: 'scroll-snap-type', prop: 'scroll-snap-type', value: 'x mandatory' },
  { label: 'selector(:has())', condition: 'selector(:has(*))' },
  { label: 'text-wrap: balance', prop: 'text-wrap', value: 'balance' },
]

function supports(f: Feature): boolean | null {
  if (typeof CSS === 'undefined' || !CSS.supports) return null
  try {
    return 'condition' in f ? CSS.supports(f.condition) : CSS.supports(f.prop, f.value)
  } catch {
    return null
  }
}

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

export function FeatureQueriesPanel() {
  const results = useMemo(() => FEATURES.map((f) => ({ f, ok: supports(f) })), [])
  const supportedCount = results.filter((r) => r.ok).length

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Feature queries
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>@supports</code> applies CSS only when the browser understands a given
          declaration (or selector). It&rsquo;s the foundation of progressive enhancement: ship a
          baseline everyone gets, then layer on upgrades behind a query. The table below runs the
          real checks in <em>your</em> browser.
        </Text>
      </header>

      <section>
        <SectionHeader>
          Support in this browser · {supportedCount}/{results.length}
        </SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {results.map(({ f, ok }) => (
            <div
              key={f.label}
              className="flex items-center justify-between gap-4 border-b border-stroke-muted px-5 py-3 last:border-0"
            >
              <Text variant="body-sm" fontFamily="mono" color="primary">
                {f.label}
              </Text>
              {ok === null ? (
                <Text variant="body-xs" color="muted">unknown</Text>
              ) : ok ? (
                <span className="inline-flex items-center gap-1.5 text-content-success">
                  <Check size={15} />
                  <Text variant="body-xs" color="inherit" className="font-semibold">supported</Text>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-content-critical">
                  <Close size={15} />
                  <Text variant="body-xs" color="inherit" className="font-semibold">not supported</Text>
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader>Progressive enhancement pattern</SectionHeader>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Text variant="body-sm" color="secondary">
              Test for a feature and enhance when it&rsquo;s present:
            </Text>
            <CodeBlock
              code={`/* baseline — works everywhere */
.gallery { display: flex; flex-wrap: wrap; }

/* upgrade — only where grid exists */
@supports (display: grid) {
  .gallery { display: grid; gap: 1rem; }
}`}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Text variant="body-sm" color="secondary">
              Or provide a fallback only where a feature is <em>missing</em> with{' '}
              <code>not</code>:
            </Text>
            <CodeBlock
              code={`.panel { background: rgba(20, 20, 30, .92); }

@supports (backdrop-filter: blur(8px)) {
  .panel {
    background: rgba(20, 20, 30, .55);
    backdrop-filter: blur(8px);
  }
}`}
            />
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-stroke bg-surface-elevated p-5" style={STAGE_STYLE}>
          <Text variant="body-xs" color="secondary">
            Combine conditions with <code>and</code> / <code>or</code> / <code>not</code>, and
            test selectors with <code>@supports selector(:has(a))</code>. In JS, the same check is{' '}
            <code>CSS.supports(&quot;display&quot;, &quot;grid&quot;)</code>.
          </Text>
        </div>
      </section>
    </div>
  )
}
