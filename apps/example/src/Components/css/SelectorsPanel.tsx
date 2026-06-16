import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { SectionHeader } from '../shared'

/**
 * Interactive CSS selectors lesson. Whatever selector you type or pick is
 * run with a REAL `querySelectorAll` scoped to the sample tree, and every
 * matched node is highlighted — so `:has()`, `:nth-child()`, combinators,
 * and attribute selectors all resolve exactly as the browser does.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const PRESETS: ReadonlyArray<{ selector: string; label: string }> = [
  { selector: '.item', label: 'class' },
  { selector: 'ul > li', label: 'direct child' },
  { selector: 'li + li', label: 'adjacent sibling' },
  { selector: 'li ~ li', label: 'general sibling' },
  { selector: '[data-active]', label: 'attribute' },
  { selector: 'li:first-child', label: ':first-child' },
  { selector: 'li:nth-child(2)', label: ':nth-child(2)' },
  { selector: 'li:last-child', label: ':last-child' },
  { selector: 'p:not(.muted)', label: ':not()' },
  { selector: ':is(h2, a)', label: ':is()' },
  { selector: '.card:has(a)', label: ':has()' },
  { selector: '*', label: 'universal' },
]

const REFERENCE: ReadonlyArray<{ syntax: string; name: string }> = [
  { syntax: 'A B', name: 'Descendant — any B inside an A' },
  { syntax: 'A > B', name: 'Child — B that is a direct child of A' },
  { syntax: 'A + B', name: 'Adjacent sibling — B immediately after A' },
  { syntax: 'A ~ B', name: 'General sibling — any B after A' },
  { syntax: '[attr=val]', name: 'Attribute — matches the attribute / value' },
  { syntax: ':is() / :where()', name: 'Match any in a list (:where has 0 specificity)' },
  { syntax: ':has(X)', name: 'Parent that contains a matching X' },
  { syntax: '::before / ::after', name: 'Pseudo-elements — generated content' },
]

const DESCRIPTION =
  'Selectors decide which elements a rule targets. Beyond a tag or class, combinators reach by relationship (descendant, child, sibling), attribute selectors match by attribute, and functional pseudo-classes like :is(), :not(), and :has() compose them. Type any selector below — matches highlight live.'

export function SelectorsPanel() {
  const ref = useRef<HTMLDivElement>(null)
  const [selector, setSelector] = useState('.item')
  const [count, setCount] = useState(0)
  const [valid, setValid] = useState(true)

  // Highlighting touches the DOM and reports the match count, so it lives
  // in a stable callback the effect drives — keeping the effect body free
  // of synchronous setState while still re-running on every selector edit.
  const runMatch = useCallback((q: string) => {
    const root = ref.current
    if (!root) return
    root.querySelectorAll('[data-match]').forEach((el) => el.removeAttribute('data-match'))
    const trimmed = q.trim()
    if (!trimmed) {
      setCount(0)
      setValid(true)
      return
    }
    try {
      const matches = root.querySelectorAll(trimmed)
      matches.forEach((el) => el.setAttribute('data-match', ''))
      setCount(matches.length)
      setValid(true)
    } catch {
      setValid(false)
      setCount(0)
    }
  }, [])

  useEffect(() => {
    // DOM-sync effect: CSS matching can't be computed in render, so we
    // query after paint and report the count. The setState here is the
    // measurement result, not a cascading state update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    runMatch(selector)
  }, [selector, runMatch])

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Selectors
        </Text>
        <Text variant="para-lg" color="secondary">
          {DESCRIPTION}
        </Text>
      </header>

      <section>
        <SectionHeader>Live matcher</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_300px]">
          {/* Sample tree — matched nodes get a brand outline + fill. */}
          <div className="overflow-auto bg-surface-muted p-8" style={STAGE_STYLE}>
            <div
              ref={ref}
              className="flex flex-col gap-3 rounded-lg border border-stroke bg-surface p-5 text-sm text-content [&_[data-match]]:[outline:2px_solid_var(--color-stroke-brand)] [&_[data-match]]:[outline-offset:-1px] [&_[data-match]]:bg-surface-brand-muted [&_*]:rounded [&_li]:px-2 [&_li]:py-1 [&_p]:px-2 [&_p]:py-1 [&_a]:px-2 [&_a]:py-1 [&_h2]:px-2 [&_h2]:py-1"
            >
              <h2 className="font-semibold text-content-strong">Section title</h2>
              <ul className="flex flex-col gap-1 border-l border-stroke-muted pl-3">
                <li className="item">One</li>
                <li className="item" data-active>
                  Two · data-active
                </li>
                <li className="item">Three</li>
                <li>Four · no class</li>
              </ul>
              <div className="card flex flex-col gap-1 border-l border-stroke-muted pl-3">
                <p>Alpha</p>
                <p className="muted text-content-muted">Beta · .muted</p>
                <a href="#sample" onClick={(e) => e.preventDefault()} className="text-content-brand">
                  A link
                </a>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <label className="grid gap-1.5">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                selector
              </Text>
              <input
                type="text"
                value={selector}
                spellCheck={false}
                onChange={(e) => setSelector(e.target.value)}
                placeholder=".item"
                className={`h-9 w-full rounded-md border bg-surface px-2.5 font-mono text-sm text-content-strong outline-none transition-colors focus:ring-2 focus:ring-stroke-brand/20 ${
                  valid ? 'border-stroke focus:border-stroke-brand' : 'border-stroke-critical'
                }`}
              />
              <Text variant="body-xs" color={valid ? 'muted' : 'error'}>
                {valid ? (
                  <>
                    matched <span className="font-semibold text-content-brand">{count}</span>{' '}
                    element{count === 1 ? '' : 's'}
                  </>
                ) : (
                  'invalid selector'
                )}
              </Text>
            </label>

            <div className="flex flex-col gap-1.5">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                presets
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((p) => {
                  const isActive = p.selector === selector
                  return (
                    <button
                      key={p.selector}
                      type="button"
                      onClick={() => setSelector(p.selector)}
                      title={p.label}
                      className={`cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors ${
                        isActive
                          ? 'bg-surface-brand-muted font-semibold text-content-brand'
                          : 'bg-surface-muted text-content-secondary hover:bg-surface-subtle'
                      }`}
                    >
                      {p.selector}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeader>Combinators &amp; functional selectors</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {REFERENCE.map(({ syntax, name }) => (
            <div
              key={syntax}
              className="grid gap-1 border-b border-stroke-muted px-5 py-3 last:border-0 md:grid-cols-[200px_1fr] md:items-center md:gap-4"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {syntax}
              </Text>
              <Text variant="body-sm" color="secondary">
                {name}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          <code>:has()</code> is the long-awaited &ldquo;parent selector&rdquo;.{' '}
          <code>:where()</code> matches like <code>:is()</code> but adds zero specificity — handy
          for low-priority base styles.
        </Text>
      </section>
    </div>
  )
}
