import { useMemo, useRef, useState, type ComponentType, type CSSProperties } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@swift/components/Button'
import { Text } from '@swift/components/Text'
import * as Icons from '@swift/icons'
import { downloadIcon, type IconFormat } from '@swift/icons/download'
import { Download } from '@swift/icons/Download'
import { CopyableImport } from '../lib/CopyableImport'
import { useIconSearch } from '../lib/iconSearch'
import { SidebarLayout } from '../lib/SidebarLayout'
import { useToast } from '../lib/Toast'

export const Route = createFileRoute('/icons')({
  component: RouteComponent,
})

type IconComp = ComponentType<{
  size?: number
  className?: string
  ref?: React.Ref<SVGSVGElement>
}>

const NON_ICON_EXPORTS = new Set(['SvgIcon', 'createSvgIcon', 'iconToBlob', 'downloadIcon'])

const allIcons = (Object.entries(Icons) as Array<[string, IconComp]>)
  .filter(([name]) => !NON_ICON_EXPORTS.has(name))
  .sort(([a], [b]) => a.localeCompare(b))

const ICON_COLOR_PALETTE = [
  'text-blue-600',
  'text-indigo-600',
  'text-violet-600',
  'text-pink-600',
  'text-red-500',
  'text-orange-500',
  'text-amber-500',
  'text-emerald-600',
  'text-teal-600',
  'text-cyan-600',
] as const

function colorFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  return ICON_COLOR_PALETTE[hash % ICON_COLOR_PALETTE.length]
}

/** Inline stagger index for the motion.css `anim-*` utilities (55ms steps, capped). */
function stagger(i: number) {
  return { '--stagger-i': Math.min(i, 12) } as CSSProperties
}

function readableName(name: string) {
  return name.replace(/([A-Z])([a-z])/g, ' $1$2').replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2').trim()
}

function describe(name: string) {
  if (name.endsWith('Filled')) {
    const base = readableName(name.replace(/Filled$/, ''))
    return `Filled variant of ${base.toLowerCase()}. Use it for solid emphasis — selected tabs, active toggles, or current state.`
  }
  if (name.startsWith('Chevron')) {
    return `Directional chevron. Common in pagination controls, expandable lists, breadcrumbs, and navigation affordances.`
  }
  if (name.startsWith('Arrow')) {
    return `Arrow used for navigation, sort indicators, trend direction, and directional cues.`
  }
  if (name.startsWith('No')) {
    return `Negative / unavailable state — pairs with its positive counterpart to convey absence or restriction.`
  }
  if (name.includes('Circle')) {
    return `Glyph enclosed in a circle. Use it where you need a stronger, button-like visual weight.`
  }
  return `The ${readableName(name).toLowerCase()} icon. Sizing follows font-size by default (1em) or pass the size prop. Color inherits from the current text color.`
}

const ICON_PROPS: ReadonlyArray<{
  name: string
  type: string
  defaultValue?: string
  description: string
}> = [
    {
      name: 'size',
      type: 'number | string',
      defaultValue: `'1em'`,
      description:
        'Sets both width and height of the underlying <svg>. Numbers become pixels; strings can be any CSS length (em, rem, %). Defaults to 1em so the icon scales with the surrounding font size.',
    },
    {
      name: 'title',
      type: 'string',
      description:
        'Accessible label. When provided, the icon renders a <title> element and switches to role="img"; when omitted, it is treated as decorative (aria-hidden). Use it only when the icon conveys meaning on its own.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Forwarded to the <svg>. Color is driven by currentColor — set a text-* utility (e.g. text-content-brand) or any Tailwind text color to recolor the glyph.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Merged with the defaults { userSelect: "none", display: "inline-block" }. Use for one-off color/transform overrides; prefer className for shared styling.',
    },
    {
      name: 'onClick',
      type: '(event: MouseEvent<SVGSVGElement>) => void',
      description:
        'Standard SVG click handler. If you make an icon interactive, also pair it with a button/link wrapper and a meaningful title or aria-label.',
    },
    {
      name: 'ref',
      type: 'Ref<SVGSVGElement>',
      description:
        'Forwarded to the underlying <svg> element — useful for measurement, focus, or animation hooks.',
    },
    {
      name: '...rest',
      type: 'SVGAttributes<SVGSVGElement>',
      description:
        'All other standard SVG attributes (id, role, aria-*, data-*, event handlers, fill, stroke, etc.) are forwarded to the rendered <svg>.',
    },
  ]

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <Text
      variant="body-xs"
      fontWeight="semibold"
      color="muted"
      className="mb-3 block uppercase tracking-wide"
      variantMapping={{ 'body-xs': 'h2' }}
    >
      {children}
    </Text>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <Text variant="body-xs" color="muted" fontWeight="semibold" className="tracking-wide uppercase">
        {label}
      </Text>
      {children}
    </label>
  )
}

const DOWNLOAD_SIZES = [24, 48, 96, 256, 512] as const

/* Rainbow ramp is deliberate — structural styling stays on tokens. */
const PREVIEW_RAMP = [
  { size: 16, color: 'text-blue-600' },
  { size: 20, color: 'text-emerald-600' },
  { size: 24, color: 'text-violet-600' },
  { size: 32, color: 'text-orange-500' },
  { size: 48, color: 'text-red-500' },
] as const

function RouteComponent() {
  const [selected, setSelected] = useState(allIcons[0]?.[0] ?? '')
  const [format, setFormat] = useState<IconFormat>('svg')
  const [size, setSize] = useState<(typeof DOWNLOAD_SIZES)[number]>(256)
  const [color, setColor] = useState('#1d263c')
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<SVGSVGElement | null>(null)
  const toast = useToast()
  const { query } = useIconSearch()

  const handleDownload = async () => {
    const svg = previewRef.current
    if (!svg || !selected) return
    setDownloading(true)
    try {
      await downloadIcon(svg, {
        format,
        size,
        color,
        filename: `${selected}.${format}`,
      })
      toast.show(`${selected}.${format} downloaded`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Download failed'
      toast.show(message)
    } finally {
      setDownloading(false)
    }
  }

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return allIcons
    return allIcons.filter(([n]) => n.toLowerCase().includes(term))
  }, [query])

  const Selected = useMemo(
    () => allIcons.find(([n]) => n === selected)?.[1] ?? null,
    [selected],
  )

  return (
    <SidebarLayout
      title="@swift/icons"
      subtitle={
        query
          ? `${filtered.length} of ${allIcons.length}`
          : `${allIcons.length} icons`
      }
      selectedKey={selected}
      triggerLabel={selected || 'Icons'}
      sidebar={
        filtered.length === 0 ? (
          <Text variant="body-sm" color="muted" className="block px-2 py-4">
            No icons match “{query}”.
          </Text>
        ) : (
          <ul className="space-y-0.5">
            {filtered.map(([name, C], i) => {
              const isActive = name === selected
              return (
                <li key={name} className="anim-fade-in" style={stagger(i)}>
                  <button
                    type="button"
                    onClick={() => setSelected(name)}
                    aria-current={isActive || undefined}
                    className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors duration-150 ${isActive
                      ? 'bg-surface-brand-muted font-semibold text-content-brand'
                      : 'font-medium text-content hover:bg-surface-muted hover:text-content-strong'
                      }`}
                  >
                    <C
                      size={18}
                      className={`shrink-0 transition duration-150 motion-reduce:transition-none ${isActive
                        ? 'text-content-brand'
                        : `${colorFor(name)} opacity-70 group-hover:scale-110 group-hover:opacity-100 motion-reduce:group-hover:scale-100`
                        }`}
                    />
                    <span className="truncate">{name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )
      }
    >
      {!Selected ? (
        <Text variant="body-md" color="muted">
          Select an icon from the sidebar.
        </Text>
      ) : (
        <div className="grid gap-8 *:min-w-0">
          <header className="anim-fade-up grid gap-4" style={stagger(0)}>
            <div>
              <Text variant="heading-lg" fontWeight="semibold" color="primary">
                {selected}
              </Text>
              <Text variant="body-sm" color="secondary" className="block">
                {readableName(selected)}
              </Text>
            </div>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px] md:items-start">
              {/* Preview — keyed on `selected` so each pick re-runs the scale-in. */}
              <div
                key={selected}
                className="anim-scale-in overflow-hidden rounded-xl border border-stroke bg-surface-elevated shadow-level1"
              >
                <div className="flex items-center justify-center bg-linear-to-br from-surface-muted via-surface to-surface-muted px-6 py-10 text-content-strong">
                  <Selected size={64} ref={previewRef} />
                </div>
                <div className="flex flex-wrap items-end justify-center gap-x-7 gap-y-3 border-t border-stroke-muted px-6 py-4">
                  {PREVIEW_RAMP.map(({ size: rampSize, color: rampColor }, i) => (
                    <div
                      key={rampSize}
                      className="anim-scale-in flex flex-col items-center gap-1.5"
                      style={stagger(i + 1)}
                    >
                      <div className="flex h-12 items-end">
                        <Selected size={rampSize} className={rampColor} />
                      </div>
                      <Text variant="body-xs" color="muted" fontFamily="mono">
                        {rampSize}px
                      </Text>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download controls */}
              <div className="rounded-xl border border-stroke bg-surface-elevated p-4 shadow-level1">
                <Text
                  variant="body-xs"
                  fontWeight="semibold"
                  color="muted"
                  className="block uppercase tracking-wide"
                >
                  Download
                </Text>
                <div className="mt-3 grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Format">
                      <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as IconFormat)}
                        className="w-full cursor-pointer rounded-md border border-stroke bg-surface px-2.5 py-1.5 text-sm text-content"
                      >
                        <option value="svg">SVG</option>
                        <option value="webp">WebP</option>
                        <option value="png">PNG</option>
                        <option value="jpeg">JPEG</option>
                      </select>
                    </Field>
                    <Field label="Size">
                      <select
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value) as (typeof DOWNLOAD_SIZES)[number])}
                        disabled={format === 'svg'}
                        className="w-full cursor-pointer rounded-md border border-stroke bg-surface px-2.5 py-1.5 text-sm text-content disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {DOWNLOAD_SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}px
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Color">
                    <div className="flex items-center gap-2 rounded-md border border-stroke bg-surface px-2 py-1">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        aria-label="Pick icon color"
                        className="size-6 cursor-pointer rounded border-0 bg-transparent p-0"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        spellCheck={false}
                        className="w-full min-w-0 bg-transparent font-mono text-sm text-content outline-none"
                      />
                    </div>
                  </Field>
                  <Button
                    onClick={handleDownload}
                    loading={downloading}
                    classes={{ root: 'group w-full' }}
                  >
                    <Button.LeftIcon>
                      <Download
                        size={16}
                        className="transition-transform duration-150 group-hover:translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
                      />
                    </Button.LeftIcon>
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <section className="anim-fade-up" style={stagger(1)}>
            <SectionHeader>Import</SectionHeader>
            <CopyableImport
              label="Named deep import"
              code={`import { ${selected} } from '@swift/icons/${selected}'`}
            />
          </section>

          <section className="anim-fade-up" style={stagger(2)}>
            <SectionHeader>Description</SectionHeader>
            <Text variant="para-md" color="secondary">
              {describe(selected)}
            </Text>
          </section>

          <section className="anim-fade-up" style={stagger(3)}>
            <SectionHeader>Colors</SectionHeader>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {[
                { label: 'default', text: 'text-content-strong', bg: 'bg-surface-muted' },
                { label: 'brand', text: 'text-content-brand', bg: 'bg-surface-brand-muted' },
                { label: 'success', text: 'text-content-success', bg: 'bg-surface-success-muted' },
                { label: 'warning', text: 'text-content-warning', bg: 'bg-surface-warning-muted' },
                { label: 'critical', text: 'text-content-critical', bg: 'bg-surface-critical-muted' },
                { label: 'highlight', text: 'text-content-highlight', bg: 'bg-surface-highlight-muted' },
              ].map(({ label, text, bg }) => (
                <div
                  key={label}
                  className={`flex flex-col items-center gap-1 rounded-lg border border-stroke p-3 ${bg}`}
                >
                  <Selected size={32} className={text} />
                  <Text
                    variant="body-xs"
                    className="text-content-strong"
                  >
                    {label}
                  </Text>
                </div>
              ))}
            </div>
          </section>

          <section className="anim-fade-up" style={stagger(4)}>
            <SectionHeader>Props</SectionHeader>
            <div className="overflow-hidden rounded-xl border border-stroke bg-surface-elevated">
              <div className="hidden grid-cols-[200px_1fr_120px] gap-6 border-b border-stroke-muted bg-surface-muted px-6 py-3 md:grid">
                <Text
                  variant="body-xs"
                  fontWeight="bold"
                  color="secondary"
                  className="tracking-wider uppercase"
                >
                  Prop
                </Text>
                <Text
                  variant="body-xs"
                  fontWeight="bold"
                  color="secondary"
                  className="tracking-wider uppercase"
                >
                  Type
                </Text>
                <Text
                  variant="body-xs"
                  fontWeight="bold"
                  color="secondary"
                  className="tracking-wider uppercase"
                >
                  Default
                </Text>
              </div>
              {ICON_PROPS.map(({ name, type, defaultValue, description }) => (
                <div
                  key={name}
                  className="grid gap-2 border-b border-stroke-muted px-6 py-5 last:border-0 md:grid-cols-[200px_1fr_120px] md:items-start md:gap-6"
                >
                  <Text
                    variant="body-sm"
                    fontFamily="mono"
                    fontWeight="semibold"
                    color="primary"
                  >
                    {name}
                  </Text>
                  <div className="flex flex-col gap-1.5">
                    <Text
                      variant="body-xs"
                      fontFamily="mono"
                      color="secondary"
                      className="wrap-break-word"
                    >
                      {type}
                    </Text>
                    <Text variant="body-sm" color="secondary">
                      {description}
                    </Text>
                  </div>
                  <Text
                    variant="body-xs"
                    fontFamily="mono"
                    color={defaultValue ? 'inherit' : 'muted'}
                  >
                    {defaultValue ?? '—'}
                  </Text>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </SidebarLayout>
  )
}
