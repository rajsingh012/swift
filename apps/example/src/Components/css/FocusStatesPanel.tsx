import { type CSSProperties } from 'react'
import { Text } from '@swift/components/Text'
import { SectionHeader } from '../shared'

/**
 * Interactive interaction-states lesson. Real :hover / :active /
 * :disabled / :focus / :focus-visible rules are injected and applied to
 * live controls, so the states fire when you actually hover, click, and
 * Tab — including the keyboard-only ring of :focus-visible.
 */

const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

const STYLES = `
.fx-btn {
  cursor: pointer; outline: none;
  padding: 8px 16px; border-radius: 8px;
  border: 1px solid var(--color-stroke);
  background: var(--color-surface);
  color: var(--color-content-strong);
  font-size: 14px; font-weight: 600;
  transition: background-color .15s, border-color .15s, transform .05s;
}
.fx-btn:hover { background: var(--color-surface-brand-muted); border-color: var(--color-stroke-brand); }
.fx-btn:active { transform: translateY(1px); }
.fx-btn:disabled { opacity: .5; cursor: not-allowed; }
.fx-focus:focus { outline: 3px solid var(--color-stroke-brand); outline-offset: 2px; }
.fx-focusvis:focus-visible { outline: 3px solid var(--color-stroke-brand); outline-offset: 2px; }
.fx-input {
  height: 38px; width: 100%; padding: 0 12px; border-radius: 8px; outline: none;
  border: 1px solid var(--color-stroke); background: var(--color-surface);
  color: var(--color-content-strong); font-size: 14px;
  transition: border-color .15s, box-shadow .15s;
}
.fx-input:focus { border-color: var(--color-stroke-brand); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-stroke-brand) 25%, transparent); }
`

const STATES: ReadonlyArray<{ sel: string; note: string }> = [
  { sel: ':hover', note: 'Pointer is over the element. Skip pointer-only affordances on touch.' },
  { sel: ':focus', note: 'Element has focus — from a click OR the keyboard.' },
  { sel: ':focus-visible', note: 'Focus that the browser thinks deserves a ring — keyboard, not mouse.' },
  { sel: ':focus-within', note: 'The element OR any descendant has focus (great for fields/menus).' },
  { sel: ':active', note: 'Being pressed down (between mousedown and mouseup).' },
  { sel: ':disabled', note: 'A disabled form control — also matches :enabled inversely.' },
  { sel: ':checked', note: 'A checked checkbox / radio, or a selected option.' },
]

export function FocusStatesPanel() {
  return (
    <div className="grid grid-cols-1 gap-10 [&>*]:min-w-0">
      <style>{STYLES}</style>

      <header className="border-b border-stroke pb-6">
        <Text variant="heading-xl" fontWeight="bold" gutterBottom>
          Focus &amp; states
        </Text>
        <Text variant="para-lg" color="secondary">
          Interactive elements expose their state through pseudo-classes — <code>:hover</code>,{' '}
          <code>:active</code>, <code>:disabled</code>, and the focus family. The crucial pair is{' '}
          <code>:focus</code> (any focus) vs <code>:focus-visible</code> (focus that deserves a
          ring — keyboard, not a mouse click). Interact with the controls to feel the difference.
        </Text>
      </header>

      <section>
        <SectionHeader>Live states · hover, click &amp; Tab through these</SectionHeader>
        <div className="fx-demo flex flex-col gap-6 rounded-xl border border-stroke bg-surface-elevated p-8" style={STAGE_STYLE}>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="fx-btn fx-focusvis">Hover / press me</button>
            <button type="button" className="fx-btn fx-focusvis">Tab to me</button>
            <button type="button" className="fx-btn fx-focusvis" disabled>
              Disabled
            </button>
          </div>
          <label className="block max-w-xs">
            <Text variant="body-xs" color="muted" className="mb-1 block">
              focus this input
            </Text>
            <input className="fx-input" placeholder="Click or Tab here…" />
          </label>
        </div>
      </section>

      <section>
        <SectionHeader>:focus vs :focus-visible</SectionHeader>
        <div className="flex flex-col gap-4 rounded-xl border border-stroke bg-surface-elevated p-8" style={STAGE_STYLE}>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex flex-col items-start gap-2">
              <button type="button" className="fx-btn fx-focus">uses :focus</button>
              <Text variant="body-xs" color="muted">rings on click AND keyboard</Text>
            </div>
            <div className="flex flex-col items-start gap-2">
              <button type="button" className="fx-btn fx-focusvis">uses :focus-visible</button>
              <Text variant="body-xs" color="muted">rings on keyboard only</Text>
            </div>
          </div>
          <Text variant="body-sm" color="secondary">
            <strong className="text-content-strong">Click</strong> each button, then{' '}
            <strong className="text-content-strong">Tab</strong> to them. The first shows a ring
            on a mouse click (often unwanted); the second stays quiet on click but rings for
            keyboard users — accessible by default. Prefer <code>:focus-visible</code> and never
            do <code>outline: none</code> without it.
          </Text>
        </div>
      </section>

      <section>
        <SectionHeader>State pseudo-classes</SectionHeader>
        <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
          {STATES.map(({ sel, note }) => (
            <div
              key={sel}
              className="grid gap-1 border-b border-stroke-muted px-5 py-3 last:border-0 md:grid-cols-[200px_1fr] md:items-center md:gap-4"
            >
              <Text variant="body-sm" fontFamily="mono" fontWeight="semibold" color="primary">
                {sel}
              </Text>
              <Text variant="body-sm" color="secondary">
                {note}
              </Text>
            </div>
          ))}
        </div>
        <Text variant="body-xs" color="muted" className="mt-2 block">
          Order matters when several can apply — the LVHA rule for links:{' '}
          <code>:link</code>, <code>:visited</code>, <code>:hover</code>, <code>:active</code>.
        </Text>
      </section>
    </div>
  )
}
