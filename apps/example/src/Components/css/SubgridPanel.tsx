import { useState, type CSSProperties, type ReactNode } from 'react'
import { Switch } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive subgrid lesson. Three cards span the parent grid's rows; with
 * `grid-template-rows: subgrid` they share the parent's row tracks, so
 * titles, bodies, and footers line up across cards despite different
 * content. Toggle it off and each card sizes its own rows — misaligned.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const CARDS: ReadonlyArray<{ title: string; body: string; price: string }> = [
  { title: 'Window seat', body: 'Non-stop · 2h 30m.', price: '₹4,820' },
  { title: 'Extra legroom & priority boarding', body: 'Non-stop · 2h 30m · front cabin with quicker exit.', price: '₹6,140' },
  { title: 'Refundable fare', body: 'Free changes up to 24h before departure.', price: '₹5,500' },
]

function Card({ subgrid, title, body, price }: { subgrid: boolean; title: string; body: string; price: string }) {
  const inner: CSSProperties = subgrid
    ? { display: 'grid', gridRow: 'span 3', gridTemplateRows: 'subgrid', gap: 8 }
    : { display: 'grid', gridRow: 'span 3', gridTemplateRows: 'auto 1fr auto', gap: 8 }
  return (
    <div
      style={inner}
      className="rounded-lg border border-stroke bg-surface p-3"
    >
      <Text variant="body-sm" fontWeight="semibold" color="primary">
        {title}
      </Text>
      <Text variant="body-xs" color="secondary">
        {body}
      </Text>
      <div className="flex items-center justify-between border-t border-stroke-muted pt-2">
        <Text variant="body-sm" fontWeight="semibold" color="primary">{price}</Text>
        <span className="rounded-md bg-surface-brand-muted px-2 py-0.5 text-xs font-semibold text-content-brand">
          Select
        </span>
      </div>
    </div>
  )
}

function Wrap({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-stroke bg-surface-elevated p-5" style={STAGE_STYLE}>
      {children}
    </div>
  )
}

export function SubgridPanel() {
  const [subgrid, setSubgrid] = useState(true)

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Subgrid
        </Text>
        <Text variant="para-lg" color="secondary">
          Normally a grid item that is itself a grid defines its own independent tracks.{' '}
          <code>grid-template-rows: subgrid</code> (or <code>columns</code>) instead opts the
          child into its <em>parent&rsquo;s</em> tracks — so nested content aligns across siblings.
          The classic fix for &ldquo;card titles and footers that won&rsquo;t line up&rdquo;.
        </Text>
      </header>

      <section>
        <SectionHeader>Playground · three cards, uneven content</SectionHeader>
        <div className="grid gap-4">
          <div className="flex items-center justify-between rounded-xl border border-stroke bg-surface p-4">
            <Text variant="body-sm" color="secondary">
              <code>grid-template-rows: {subgrid ? 'subgrid' : 'auto 1fr auto'}</code> on each card
            </Text>
            <label className="flex items-center gap-2">
              <Text variant="body-xs" fontFamily="mono" color="secondary">subgrid</Text>
              <Switch size="sm" checked={subgrid} onCheckedChange={setSubgrid} aria-label="subgrid" />
            </label>
          </div>

          <Wrap>
            {/* Parent grid: 3 columns, shared header / body / footer rows. */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: 'auto 1fr auto',
                gap: 12,
              }}
            >
              {CARDS.map((c) => (
                <Card key={c.title} subgrid={subgrid} {...c} />
              ))}
            </div>
          </Wrap>
          <Text variant="body-xs" color="muted">
            {subgrid
              ? 'With subgrid, the title row is as tall as the tallest title across all cards, so every body and footer starts on the same line.'
              : 'Without subgrid, each card sizes its own rows — the two-line title pushes that card’s body and footer out of alignment with the others.'}
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>How it works</SectionHeader>
        <CodeBlock
          code={`.list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;   /* header / body / footer */
}
.card {
  grid-row: span 3;          /* occupy all three parent rows */
  display: grid;
  grid-template-rows: subgrid;  /* …and reuse them, not new ones */
}`}
        />
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Subgrid also inherits the parent&rsquo;s gaps. It works on rows, columns, or both, and
          is supported in all current evergreen browsers (Chrome/Edge 117+, Safari 16+, Firefox
          71+).
        </Text>
      </section>
    </div>
  )
}
