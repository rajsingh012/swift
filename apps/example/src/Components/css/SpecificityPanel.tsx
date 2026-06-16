import { useMemo, useState, type CSSProperties } from 'react'
import { Slider } from '@swift/components/Slider'
import { Switch } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { CodeBlock, SectionHeader } from '../shared'

/**
 * Interactive specificity & cascade lesson. The "battle" runs a real
 * cascade resolver: enabled rules compete by !important → inline →
 * (ids, classes, types) → source order, and the winner's colour is
 * applied to the live sample. The calculator scores any selector shape.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

type Rule = {
  id: string
  selector: string
  /** [ids, classes, types] */
  spec: [number, number, number]
  inline?: boolean
  colorVar: string
  swatch: string
}

const RULES: ReadonlyArray<Rule> = [
  { id: 'type', selector: 'p', spec: [0, 0, 1], colorVar: 'var(--color-content-muted)', swatch: 'bg-content-muted' },
  { id: 'class', selector: '.note', spec: [0, 1, 0], colorVar: 'var(--color-content-brand)', swatch: 'bg-surface-brand' },
  { id: 'attr', selector: '[data-lead]', spec: [0, 1, 0], colorVar: 'var(--color-content-warning)', swatch: 'bg-surface-warning' },
  { id: 'two-class', selector: '.note.featured', spec: [0, 2, 0], colorVar: 'var(--color-content-success)', swatch: 'bg-surface-success' },
  { id: 'id', selector: '#lead', spec: [0, 0, 0], colorVar: 'var(--color-content-critical)', swatch: 'bg-surface-critical' },
  { id: 'inline', selector: 'style="…"', spec: [0, 0, 0], inline: true, colorVar: 'var(--color-content-new)', swatch: 'bg-surface-new' },
]
// `#lead` is an id — fix its spec here to keep the array readable above.
const SPEC_OVERRIDE: Record<string, [number, number, number]> = { id: [1, 0, 0] }

function specOf(r: Rule): [number, number, number] {
  return SPEC_OVERRIDE[r.id] ?? r.spec
}

/** Full cascade score: higher wins. */
function score(r: Rule, important: boolean, index: number): number[] {
  const [ids, classes, types] = specOf(r)
  return [important ? 1 : 0, r.inline ? 1 : 0, ids, classes, types, index]
}

function compare(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return a[i] - b[i]
  }
  return 0
}

function specLabel(r: Rule): string {
  const [a, b, c] = specOf(r)
  return `${a},${b},${c}`
}

const REF_DESCRIPTION =
  'When two rules set the same property, the cascade picks a winner in this order: origin & layer, then `!important`, then inline styles, then specificity — counted as (IDs, classes/attributes/pseudo-classes, element types) — and finally source order. The universal selector `*` and combinators add nothing.'

export function SpecificityPanel() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    type: true,
    class: true,
    id: true,
    attr: false,
    'two-class': false,
    inline: false,
  })
  const [important, setImportant] = useState<Record<string, boolean>>({})

  const winner = useMemo(() => {
    let best: { rule: Rule; s: number[] } | null = null
    RULES.forEach((rule, index) => {
      if (!enabled[rule.id]) return
      const s = score(rule, !!important[rule.id], index)
      if (!best || compare(s, best.s) > 0) best = { rule, s }
    })
    return best as { rule: Rule; s: number[] } | null
  }, [enabled, important])

  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Specificity &amp; cascade
        </Text>
        <Text variant="para-lg" color="secondary">
          {REF_DESCRIPTION}
        </Text>
      </header>

      {/* ── Cascade battle ──────────────────────────────────────────── */}
      <section>
        <SectionHeader>Cascade battle · which rule wins?</SectionHeader>
        <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_320px]">
          {/* Stage */}
          <div className="flex flex-col items-center justify-center gap-4 bg-surface-muted p-8" style={STAGE_STYLE}>
            <div className="rounded-xl border border-stroke bg-surface px-8 py-6 shadow-level1">
              <span
                style={{ color: winner ? winner.rule.colorVar : 'var(--color-content)' }}
                className="font-mono text-lg font-bold transition-colors"
              >
                Sample text
              </span>
            </div>
            {winner ? (
              <Text variant="body-xs" color="secondary" className="text-center">
                <code className="text-content-strong">{winner.rule.selector}</code> wins
                {important[winner.rule.id] ? ' (!important)' : ''} — specificity{' '}
                <code>({specLabel(winner.rule)})</code>
              </Text>
            ) : (
              <Text variant="body-xs" color="muted">
                No rule enabled — the element keeps its inherited colour.
              </Text>
            )}
          </div>

          {/* Rule list */}
          <div className="flex flex-col gap-2 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
            <div className="mb-1 grid grid-cols-[1fr_auto_auto] items-center gap-3 px-1">
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                Rule
              </Text>
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                !important
              </Text>
              <Text variant="body-xs" fontWeight="semibold" color="muted" className="tracking-wide uppercase">
                on
              </Text>
            </div>
            {RULES.map((rule) => {
              const isWinner = winner?.rule.id === rule.id
              const isOn = enabled[rule.id]
              return (
                <div
                  key={rule.id}
                  className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border px-3 py-2 transition-colors ${
                    isWinner
                      ? 'border-stroke-brand bg-surface-brand-muted'
                      : 'border-stroke-muted bg-surface'
                  } ${isOn ? '' : 'opacity-50'}`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`size-2.5 shrink-0 rounded-full ${rule.swatch}`} aria-hidden />
                    <Text variant="body-xs" fontFamily="mono" color="primary" className="truncate">
                      {rule.selector}
                    </Text>
                    <Text variant="body-xs" fontFamily="mono" color="muted">
                      ({specLabel(rule)})
                    </Text>
                  </div>
                  <Switch
                    size="sm"
                    checked={!!important[rule.id]}
                    onCheckedChange={(v) => setImportant((p) => ({ ...p, [rule.id]: v }))}
                    aria-label={`${rule.selector} !important`}
                  />
                  <Switch
                    size="sm"
                    checked={isOn}
                    onCheckedChange={(v) => setEnabled((p) => ({ ...p, [rule.id]: v }))}
                    aria-label={`enable ${rule.selector}`}
                  />
                </div>
              )
            })}
          </div>

          <div className="border-t border-stroke md:col-span-2">
            <CodeBlock
              code={`/* specificity is counted as (ids, classes, types) */
p              { color: gray; }      /* (0,0,1) */
.note          { color: blue; }      /* (0,1,0) */
.note.featured { color: green; }     /* (0,2,0) */
#lead          { color: red; }       /* (1,0,0) */
/* !important and inline styles override the above */`}
            />
          </div>
        </div>
      </section>

      {/* ── Calculator ──────────────────────────────────────────────── */}
      <section>
        <SectionHeader>Specificity calculator</SectionHeader>
        <Calculator />
      </section>

      {/* ── Order of precedence ─────────────────────────────────────── */}
      <section>
        <SectionHeader>Order of precedence · strongest first</SectionHeader>
        <ol className="grid gap-2">
          {[
            ['!important', 'Wins over everything normal (and !important inline beats !important rules).'],
            ['Inline style', 'A style="" attribute beats any selector — short of !important.'],
            ['ID selectors', 'Each #id adds to the first specificity column.'],
            ['Classes / attributes / pseudo-classes', '.class, [attr], :hover — the middle column.'],
            ['Element types / pseudo-elements', 'div, p, ::before — the last column.'],
            ['Source order', 'Among equals, the rule declared later wins.'],
          ].map(([title, body], i) => (
            <li
              key={title}
              className="flex items-start gap-3 rounded-xl border border-stroke bg-surface-elevated p-4"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface-brand-muted text-xs font-bold text-content-brand">
                {i + 1}
              </span>
              <div className="flex flex-col">
                <Text variant="body-sm" fontWeight="semibold" color="primary">
                  {title}
                </Text>
                <Text variant="body-xs" color="secondary">
                  {body}
                </Text>
              </div>
            </li>
          ))}
        </ol>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          The columns never &ldquo;carry&rdquo;: a single <code>#id</code> (1,0,0) beats{' '}
          <em>any</em> number of classes (0,∞,0). Reach for <code>!important</code> last — it&rsquo;s
          hard to override.
        </Text>
      </section>
    </div>
  )
}

function Stepper({
  label,
  value,
  max,
  onChange,
}: {
  label: string
  value: number
  max: number
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
        </Text>
      </div>
      <Slider value={[value]} min={0} max={max} step={1} onValueChange={([v]) => onChange(v)} aria-label={label} />
    </div>
  )
}

function Calculator() {
  const [ids, setIds] = useState(0)
  const [classes, setClasses] = useState(1)
  const [types, setTypes] = useState(1)
  const [inline, setInline] = useState(false)
  const [important, setImportant] = useState(false)

  const selector =
    [
      ...Array.from({ length: ids }, (_, i) => `#id${i + 1}`),
      ...Array.from({ length: classes }, (_, i) => `.cls${i + 1}`),
      ...Array.from({ length: types }, (_, i) => ['div', 'span', 'p', 'a', 'li'][i % 5]),
    ].join(' ') || '*'

  return (
    <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_280px]">
      <div className="flex flex-col items-center justify-center gap-4 bg-surface-muted p-8" style={STAGE_STYLE}>
        <Text variant="body-xs" color="muted" className="tracking-wide uppercase">
          specificity
        </Text>
        <div className="flex items-center gap-2">
          {[ids, classes, types].map((n, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex size-14 items-center justify-center rounded-xl border border-stroke bg-surface text-2xl font-bold text-content-strong shadow-level1">
                {n}
              </div>
              <Text variant="body-xs" color="muted">
                {['ids', 'classes', 'types'][i]}
              </Text>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {important ? (
            <code className="rounded-md bg-surface-critical-muted px-2 py-1 text-xs font-semibold text-content-critical">
              !important
            </code>
          ) : null}
          {inline ? (
            <code className="rounded-md bg-surface-new-muted px-2 py-1 text-xs font-semibold text-content-new">
              inline
            </code>
          ) : null}
          <code className="max-w-full truncate rounded-md bg-surface-brand-muted px-2 py-1 text-xs font-semibold text-content-brand">
            {inline ? `style="…"` : selector}
          </code>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
        <Stepper label="# ids" value={ids} max={3} onChange={setIds} />
        <Stepper label="# classes / attrs" value={classes} max={5} onChange={setClasses} />
        <Stepper label="# element types" value={types} max={5} onChange={setTypes} />
        <div className="flex items-center justify-between gap-3">
          <Text variant="body-xs" fontFamily="mono" color="secondary">
            inline style
          </Text>
          <Switch size="sm" checked={inline} onCheckedChange={setInline} aria-label="inline style" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Text variant="body-xs" fontFamily="mono" color="secondary">
            !important
          </Text>
          <Switch size="sm" checked={important} onCheckedChange={setImportant} aria-label="!important" />
        </div>
      </div>
    </div>
  )
}
