import { type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * @scope lesson. A real @scope rule is injected: it tints links only
 * inside `.sc-card`, and a donut hole (`to (.sc-footer)`) stops the scope
 * before the footer. Identical markup outside the card is untouched.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const SHEET = `
@scope (.sc-card) to (.sc-footer) {
  a { color: var(--color-content-brand); font-weight: 700; text-decoration: underline; }
  p { color: var(--color-content-strong); }
}
`

const supported =
  typeof CSS !== 'undefined' && CSS.supports ? CSS.supports('selector(:scope)') : null

export function ScopedStylesPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <style>{SHEET}</style>

      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Scoped styles
        </Text>
        <Text variant="para-lg" color="secondary">
          <code>@scope</code> limits where rules apply by DOM subtree, not just by selector. A
          scope has a <em>root</em> (where it starts) and an optional <em>limit</em> (where it
          stops — the &ldquo;donut hole&rdquo;), so component styles stay contained without BEM
          prefixes or extra classes.
        </Text>
      </header>

      <section>
        <SectionHeader>In scope vs out of scope</SectionHeader>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Inside the scope root */}
          <div className="sc-card rounded-xl border border-stroke bg-surface-elevated p-6" style={STAGE_STYLE}>
            <Text variant="body-xs" fontFamily="mono" color="muted" className="mb-2 block">.sc-card (scope root)</Text>
            <p className="text-sm">
              This paragraph and <a href="#scope" onClick={(e) => e.preventDefault()}>this link</a> are
              inside the scope — the link is brand-tinted and bold.
            </p>
            <div className="sc-footer mt-3 border-t border-stroke pt-3">
              <Text variant="body-xs" color="muted" className="mb-1 block">.sc-footer (scope limit — excluded)</Text>
              <p className="text-sm text-content-secondary">
                Past the limit: <a href="#scope" onClick={(e) => e.preventDefault()} className="text-content-secondary underline">this link</a> is
                NOT styled by the scope.
              </p>
            </div>
          </div>

          {/* Outside the scope root entirely */}
          <div className="rounded-xl border border-stroke bg-surface-elevated p-6" style={STAGE_STYLE}>
            <Text variant="body-xs" fontFamily="mono" color="muted" className="mb-2 block">outside .sc-card</Text>
            <p className="text-sm text-content-secondary">
              Identical markup, but <a href="#scope" onClick={(e) => e.preventDefault()} className="text-content-secondary underline">this link</a> sits
              outside the scope root, so the <code>@scope</code> rules never reach it.
            </p>
          </div>
        </div>
        {supported === false ? (
          <div className="mt-3 rounded-lg border border-stroke-warning bg-surface-warning-muted px-4 py-2">
            <Text variant="body-xs" color="warning">
              Your browser doesn&rsquo;t support <code>@scope</code> yet, so the demo above
              won&rsquo;t show the scoping. The concept and code below still apply.
            </Text>
          </div>
        ) : null}
      </section>

      <section>
        <SectionHeader>The syntax</SectionHeader>
        <CodeBlock
          code={`/* root only */
@scope (.card) {
  a { color: var(--brand); }
}

/* root + limit (donut): stops before .card__footer */
@scope (.card) to (.card__footer) {
  p { color: black; }
}`}
        />
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Proximity matters: when two scopes both match, the one whose root is{' '}
          <em>nearer</em> the element wins — handy for theme-within-a-theme. Supported in current
          Chrome / Edge / Safari; Firefox is still catching up.
        </Text>
      </section>
    </div>
  )
}
