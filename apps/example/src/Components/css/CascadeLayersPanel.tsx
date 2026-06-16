import { useMemo, useState, type CSSProperties } from 'react'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Switch } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive @layer lesson. Two real layers compete on the sample text —
 * `base` targets it with a high-specificity #id rule, `utilities` with a
 * low-specificity class. The injected stylesheet proves layer ORDER beats
 * specificity, and that an unlayered rule beats every layer.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

type Order = 'base, utilities' | 'utilities, base'

function styleSheet(order: Order, unlayered: boolean): string {
  return `@layer ${order};
@layer base { #cl-sample { color: var(--color-content-critical); } }
@layer utilities { .cl-text { color: var(--color-content-success); } }
${unlayered ? '.cl-text { color: var(--color-content-brand); }' : ''}`
}

export function CascadeLayersPanel() {
  const [order, setOrder] = useState<Order>('base, utilities')
  const [unlayered, setUnlayered] = useState(false)

  const sheet = useMemo(() => styleSheet(order, unlayered), [order, unlayered])

  const winner = unlayered
    ? { label: 'the unlayered rule', detail: 'unlayered styles beat every @layer', color: 'text-content-brand' }
    : order === 'base, utilities'
      ? { label: 'utilities', detail: 'declared last → wins, even with lower specificity', color: 'text-content-success' }
      : { label: 'base', detail: 'declared last → wins, even against a class', color: 'text-content-critical' }

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <style>{sheet}</style>

      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Cascade layers
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>@layer</code> lets you order whole buckets of CSS up front. Between layers,{' '}
          <strong className="text-content-strong">layer order wins over specificity</strong> — a
          later layer beats an earlier one even if the earlier rule is more specific. Any
          unlayered CSS outranks all layers. It&rsquo;s how design systems tame the cascade.
        </Text>
      </header>

      <section>
        <SectionHeader>Battle · order vs specificity</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex flex-col items-center justify-center gap-4 bg-surface-muted p-8" style={STAGE_STYLE}>
            <div className="rounded-xl border border-stroke bg-surface px-8 py-6 shadow-level1">
              {/* High-specificity id + low-specificity class both target this. */}
              <span id="cl-sample" className="cl-text font-mono text-lg font-bold">
                Sample text
              </span>
            </div>
            <Text variant="body-xs" color="secondary" className="text-center">
              Winner: <span className={`font-semibold ${winner.color}`}>{winner.label}</span> —{' '}
              {winner.detail}.
            </Text>
          </div>
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="grid gap-1.5">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                @layer order
              </Text>
              <SegmentedControl size="sm" fullWidth value={order} onValueChange={(v) => setOrder(v as Order)} aria-label="layer order">
                <SegmentedControl.Indicator />
                <SegmentedControl.Item value="base, utilities">base → utilities</SegmentedControl.Item>
                <SegmentedControl.Item value="utilities, base">utilities → base</SegmentedControl.Item>
              </SegmentedControl>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Text variant="body-xs" fontFamily="mono" color="secondary">
                add unlayered rule
              </Text>
              <Switch size="sm" checked={unlayered} onCheckedChange={setUnlayered} aria-label="unlayered rule" />
            </div>
            <Text variant="body-xs" color="muted">
              <code>#cl-sample</code> (in <code>base</code>) is far more specific than{' '}
              <code>.cl-text</code> (in <code>utilities</code>) — yet whichever layer is listed{' '}
              <em>last</em> still wins.
            </Text>
          </div>
          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock code={sheet} />
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>The precedence ladder</SectionHeader>
        <ol className="grid gap-2">
          {[
            ['Unlayered styles', 'Anything outside a layer beats everything inside one.'],
            ['Later layers', 'Among layers, the one declared last in @layer order wins.'],
            ['Specificity', 'Only breaks ties WITHIN the same layer — not across layers.'],
            ['Source order', 'The final tie-breaker, as always.'],
          ].map(([t, b], i) => (
            <li key={t} className="flex items-start gap-3 rounded-xl border border-stroke bg-surface-elevated p-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-brand-muted text-xs font-bold text-content-brand">
                {i + 1}
              </span>
              <div className="flex flex-col">
                <Text variant="body-sm" fontWeight="semibold" color="primary">{t}</Text>
                <Text variant="body-xs" color="secondary">{b}</Text>
              </div>
            </li>
          ))}
        </ol>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Declare the order once — <code>@layer reset, base, components, utilities;</code> — then
          append rules to any layer anywhere; precedence stays fixed. <code>!important</code>{' '}
          <em>reverses</em> layer order, so important utilities still win.
        </Text>
      </section>
    </div>
  )
}
