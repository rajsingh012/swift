import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Button } from '@swift/components/Button'
import { SegmentedControl } from '@swift/components/SegmentedControl'
import { Switch } from '@swift/components/Switch'
import { Text } from '@swift/components/Text'
import { Check } from '@swift/icons/Check'
import { useToast } from '../lib/Toast'
import { CodeBlock } from './shared'

/**
 * Interactive prop playground. Panels declare a knob schema; the engine
 * owns the state, renders the controls (dogfooding SegmentedControl /
 * Switch / Input), and generates the matching JSX snippet live.
 *
 * Code generation: a prop is emitted only when its value differs from
 * the knob's `defaultValue`, so the snippet always shows the minimal
 * code that reproduces the preview. Panels with non-prop knobs (e.g.
 * children text) mark them with `asChildren`.
 */

export type Knob =
  | {
      type: 'segmented'
      /** Prop name on the target component (and codegen attribute). */
      name: string
      options: ReadonlyArray<string>
      defaultValue: string
      label?: string
    }
  | {
      type: 'select'
      name: string
      options: ReadonlyArray<string>
      defaultValue: string
      label?: string
    }
  | {
      type: 'boolean'
      name: string
      defaultValue?: boolean
      label?: string
    }
  | {
      type: 'text'
      name: string
      defaultValue: string
      label?: string
      /** Render this value as the element's children instead of a prop. */
      asChildren?: boolean
    }

export type KnobValues = Record<string, string | boolean>

function initialValues(knobs: ReadonlyArray<Knob>): KnobValues {
  const values: KnobValues = {}
  for (const knob of knobs) {
    values[knob.name] = knob.defaultValue ?? false
  }
  return values
}

function generateCode(
  component: string,
  knobs: ReadonlyArray<Knob>,
  values: KnobValues,
): string {
  const attrs: string[] = []
  let children: string | null = null

  for (const knob of knobs) {
    const value = values[knob.name]
    if (knob.type === 'text' && knob.asChildren) {
      children = String(value)
      continue
    }
    // Only emit props that differ from the component's default — except
    // text props, which are content (label, placeholder, title): the
    // snippet must reproduce what the stage shows.
    if (knob.type !== 'text' && value === (knob.defaultValue ?? false)) continue
    if (knob.type === 'text' && String(value).trim() === '') continue
    if (typeof value === 'boolean') {
      attrs.push(value ? knob.name : `${knob.name}={false}`)
    } else {
      attrs.push(`${knob.name}="${value}"`)
    }
  }

  const oneLineAttrs = attrs.length ? ` ${attrs.join(' ')}` : ''
  const oneLine = children
    ? `<${component}${oneLineAttrs}>${children}</${component}>`
    : `<${component}${oneLineAttrs} />`
  if (oneLine.length <= 72) return oneLine

  // Too wide — break one attribute per line.
  const attrLines = attrs.map((a) => `  ${a}`).join('\n')
  return children
    ? `<${component}\n${attrLines}\n>\n  ${children}\n</${component}>`
    : `<${component}\n${attrLines}\n/>`
}

/* Dotted stage backdrop, drawn from stroke tokens so it themes. */
const STAGE_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(var(--color-stroke-muted) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

function KnobControl({
  knob,
  value,
  onChange,
}: {
  knob: Knob
  value: string | boolean
  onChange: (value: string | boolean) => void
}) {
  const label = knob.label ?? knob.name

  if (knob.type === 'boolean') {
    return (
      <div className="flex items-center justify-between gap-3">
        <Text variant="body-xs" fontFamily="mono" color="secondary">
          {label}
        </Text>
        <Switch
          size="sm"
          checked={value === true}
          onCheckedChange={(checked) => onChange(checked)}
          aria-label={label}
        />
      </div>
    )
  }

  if (knob.type === 'text') {
    return (
      <label className="grid gap-1.5">
        <Text variant="body-xs" fontFamily="mono" color="secondary">
          {label}
        </Text>
        <input
          type="text"
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-full rounded-md border border-stroke bg-surface px-2.5 text-sm text-content-strong outline-none transition-colors focus:border-stroke-brand focus:ring-2 focus:ring-stroke-brand/20"
        />
      </label>
    )
  }

  if (knob.type === 'segmented') {
    return (
      <div className="grid gap-1.5">
        <Text variant="body-xs" fontFamily="mono" color="secondary">
          {label}
        </Text>
        <SegmentedControl
          size="sm"
          fullWidth
          value={String(value)}
          onValueChange={onChange}
          aria-label={label}
        >
          <SegmentedControl.Indicator />
          {knob.options.map((option) => (
            <SegmentedControl.Item key={option} value={option}>
              {option}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl>
      </div>
    )
  }

  // select — token-styled native control; the system ships no Select yet.
  return (
    <label className="grid gap-1.5">
      <Text variant="body-xs" fontFamily="mono" color="secondary">
        {label}
      </Text>
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-full cursor-pointer rounded-md border border-stroke bg-surface px-2 text-sm text-content-strong outline-none transition-colors focus:border-stroke-brand focus:ring-2 focus:ring-stroke-brand/20"
      >
        {knob.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Playground({
  component,
  knobs,
  render,
  code,
}: {
  /** Tag name used in the generated snippet, e.g. `Button`. */
  component: string
  knobs: ReadonlyArray<Knob>
  render: (values: KnobValues) => ReactNode
  /** Override the auto-generated snippet (compound components etc.). */
  code?: (values: KnobValues) => string
}) {
  const [values, setValues] = useState<KnobValues>(() => initialValues(knobs))
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  const snippet = useMemo(
    () => (code ? code(values) : generateCode(component, knobs, values)),
    [code, component, knobs, values],
  )

  const isDirty = useMemo(
    () => knobs.some((k) => values[k.name] !== (k.defaultValue ?? false)),
    [knobs, values],
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      toast.show('Copy failed — clipboard unavailable')
    }
  }

  return (
    <div className="grid overflow-hidden rounded-xl border border-stroke shadow-level1 md:grid-cols-[minmax(0,1fr)_260px]">
      {/* Stage */}
      <div
        className="relative flex min-h-56 items-center justify-center bg-surface-muted p-8"
        style={STAGE_STYLE}
      >
        {render(values)}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 border-t border-stroke bg-surface p-4 md:border-t-0 md:border-l">
        <div className="flex items-center justify-between">
          <Text
            variant="body-xs"
            fontWeight="semibold"
            color="muted"
            className="tracking-wide uppercase"
          >
            Props
          </Text>
          {/* Reset only renders once something diverges — keyed fade so it
              doesn't pop in abruptly. */}
          {isDirty ? (
            <Button
              variant="link"
              size="sm"
              onClick={() => setValues(initialValues(knobs))}
              classes={{ root: 'anim-fade-in text-xs' }}
            >
              Reset
            </Button>
          ) : null}
        </div>
        {knobs.map((knob) => (
          <KnobControl
            key={knob.name}
            knob={knob}
            value={values[knob.name]}
            onChange={(value) =>
              setValues((prev) => ({ ...prev, [knob.name]: value }))
            }
          />
        ))}
      </div>

      {/* Snippet — spans both columns, updates live with the knobs. */}
      <div className="relative border-t border-stroke md:col-span-2">
        <CodeBlock code={snippet} />
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="absolute top-2 right-2 flex size-7 cursor-pointer items-center justify-center rounded-md text-content-inverse/70 transition-colors hover:bg-content-inverse/10 hover:text-content-inverse"
        >
          {copied ? (
            <Check size={14} className="anim-scale-in text-content-success" />
          ) : (
            <CopyGlyph size={14} />
          )}
        </button>
      </div>
    </div>
  )
}

/** Inlined — `@swift/icons` doesn't ship a copy glyph yet (same note as
 *  shared.tsx's CopyIcon, which isn't exported). */
function CopyGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}
