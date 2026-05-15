import { useEffect, useRef, useState, type ComponentType } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Text } from '@swift/components'
import { ContentCopy, GridSmallFilled, Tag, Tune } from '@swift/icons'

type IconComponent = ComponentType<{ size?: number; className?: string }>

export const Route = createFileRoute('/foundations')({
  component: FoundationsRoute,
})

type Section = 'Palettes' | 'Semantic' | 'Radius' | 'Shadows'

const SECTIONS: Array<{ name: Section; icon: IconComponent; description: string }> = [
  {
    name: 'Palettes',
    icon: GridSmallFilled,
    description:
      'Raw color scales. Each shade is a fixed value across both themes — pick from these only when you need an exact swatch.',
  },
  {
    name: 'Semantic',
    icon: Tag,
    description:
      'Surface, content, and stroke tokens. These re-alias to different palette shades under [data-theme="dark"] — use these by default.',
  },
  {
    name: 'Radius',
    icon: Tune,
    description:
      'Border-radius scale (xs → 3xl → full). Used by every component for consistent corners.',
  },
  {
    name: 'Shadows',
    icon: ContentCopy,
    description:
      'Elevation tokens (level1 → level6). Geometry is fixed; shadow color shifts between themes.',
  },
]

const PALETTES: Array<{ name: string; shades: number[] }> = [
  { name: 'brand', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'neutral', shades: [0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'ink', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'highlight', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'success', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'warning', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'critical', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
  { name: 'new', shades: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] },
]

const SEMANTIC_GROUPS: Array<{ label: string; vars: string[] }> = [
  {
    label: 'Surface',
    vars: [
      '--color-surface',
      '--color-surface-muted',
      '--color-surface-subtle',
      '--color-surface-elevated',
      '--color-surface-inverse',
      '--color-surface-brand',
      '--color-surface-brand-muted',
      '--color-surface-highlight',
      '--color-surface-highlight-muted',
      '--color-surface-success',
      '--color-surface-success-muted',
      '--color-surface-warning',
      '--color-surface-warning-muted',
      '--color-surface-critical',
      '--color-surface-critical-muted',
      '--color-surface-new',
      '--color-surface-new-muted',
    ],
  },
  {
    label: 'Content',
    vars: [
      '--color-content',
      '--color-content-muted',
      '--color-content-subtle',
      '--color-content-strong',
      '--color-content-inverse',
      '--color-content-on-brand',
      '--color-content-brand',
      '--color-content-highlight',
      '--color-content-success',
      '--color-content-warning',
      '--color-content-critical',
      '--color-content-new',
    ],
  },
  {
    label: 'Stroke',
    vars: [
      '--color-stroke',
      '--color-stroke-muted',
      '--color-stroke-strong',
      '--color-stroke-inverse',
      '--color-stroke-brand',
      '--color-stroke-highlight',
      '--color-stroke-success',
      '--color-stroke-warning',
      '--color-stroke-critical',
      '--color-stroke-new',
    ],
  },
]

const RADIUS_TOKENS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'] as const
const SHADOW_TOKENS = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6'] as const

function rgbToHex(value: string): string {
  const m = value.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
  if (!m) return value
  const toHex = (n: string) => Number(n).toString(16).padStart(2, '0')
  return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`
}

function PanelHeader({ section }: { section: { name: Section; description: string } }) {
  return (
    <header className="mb-8">
      <Text variant="heading-xl" fontWeight="bold" gutterBottom>
        {section.name}
      </Text>
      <Text variant="para-md" color="secondary">
        {section.description}
      </Text>
    </header>
  )
}

function PaletteRow({
  name,
  shades,
  registerRef,
  resolved,
}: {
  name: string
  shades: number[]
  registerRef: (key: string, node: HTMLDivElement | null) => void
  resolved: Record<string, string>
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <Text variant="body-sm" fontWeight="semibold" className="capitalize">
          {name}
        </Text>
        <Text variant="body-xs" color="muted" fontFamily="mono">
          {shades.length} stops
        </Text>
      </div>
      <div className="flex h-16 overflow-hidden rounded-lg border border-stroke shadow-level1">
        {shades.map((shade) => {
          const varName = `--color-${name}-${shade}`
          const hex = resolved[varName]
          return (
            <div
              key={shade}
              ref={(node) => registerRef(varName, node)}
              className="group relative flex flex-1 flex-col items-center justify-end gap-0.5 pb-2 transition-[flex-grow] hover:flex-[1.4]"
              style={{ backgroundColor: `var(${varName})` }}
              title={`${varName}${hex ? ` · ${hex}` : ''}`}
            >
              <span
                className="font-mono text-[10px] font-semibold opacity-0 mix-blend-difference transition-opacity group-hover:opacity-100"
                style={{ color: 'white' }}
              >
                {shade}
              </span>
              <span
                className="font-mono text-[9px] opacity-0 mix-blend-difference transition-opacity group-hover:opacity-100"
                style={{ color: 'white' }}
              >
                {hex ?? ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Swatch({
  label,
  varName,
  onResolveRef,
}: {
  label: string
  varName: string
  onResolveRef: (node: HTMLDivElement | null) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        ref={onResolveRef}
        className="h-16 w-full rounded-md border border-stroke-muted"
        style={{ backgroundColor: `var(${varName})` }}
        title={varName}
      />
      <div className="flex flex-col">
        <Text variant="body-xs" fontWeight="semibold" color="primary">
          {label}
        </Text>
        <Text variant="body-xs" fontFamily="mono" color="muted">
          {varName}
        </Text>
      </div>
    </div>
  )
}

type PanelProps = {
  registerRef: (key: string, node: HTMLDivElement | null) => void
  resolved: Record<string, string>
}

function PalettesPanel({ registerRef, resolved }: PanelProps) {
  return (
    <div className="grid gap-10">
      <PanelHeader section={SECTIONS[0]} />
      <div className="grid gap-8 rounded-xl border border-stroke bg-surface-elevated p-6 shadow-level1">
        {PALETTES.map(({ name, shades }) => (
          <PaletteRow
            key={name}
            name={name}
            shades={shades}
            registerRef={registerRef}
            resolved={resolved}
          />
        ))}
      </div>
    </div>
  )
}

function SemanticPanel({ registerRef }: PanelProps) {
  return (
    <div className="grid gap-10">
      <PanelHeader section={SECTIONS[1]} />
      <div className="grid gap-8 rounded-xl border border-stroke bg-surface-elevated p-6 shadow-level1">
        {SEMANTIC_GROUPS.map(({ label, vars }) => (
          <div key={label} className="grid gap-3">
            <Text variant="body-sm" fontWeight="semibold">
              {label}
            </Text>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {vars.map((v) => (
                <Swatch
                  key={v}
                  label={v.replace('--color-', '')}
                  varName={v}
                  onResolveRef={(node) => registerRef(v, node)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RadiusPanel() {
  return (
    <div className="grid gap-10">
      <PanelHeader section={SECTIONS[2]} />
      <div className="grid grid-cols-2 gap-6 rounded-xl border border-stroke bg-surface-elevated p-6 shadow-level1 sm:grid-cols-4 lg:grid-cols-8">
        {RADIUS_TOKENS.map((r) => (
          <div key={r} className="flex flex-col items-center gap-2">
            <div
              className="h-20 w-20 border border-stroke bg-surface-brand-muted"
              style={{ borderRadius: `var(--radius-${r})` }}
            />
            <Text variant="body-xs" fontFamily="mono" fontWeight="semibold">
              {r}
            </Text>
            <Text variant="body-xs" fontFamily="mono" color="muted">
              --radius-{r}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShadowsPanel() {
  return (
    <div className="grid gap-10">
      <PanelHeader section={SECTIONS[3]} />
      <div className="grid grid-cols-2 gap-6 rounded-xl border border-stroke bg-surface-muted p-8 sm:grid-cols-3 lg:grid-cols-6">
        {SHADOW_TOKENS.map((s) => (
          <div key={s} className="flex flex-col items-center gap-3">
            <div
              className="h-24 w-24 rounded-lg bg-surface-elevated"
              style={{ boxShadow: `var(--shadow-${s})` }}
            />
            <Text variant="body-xs" fontFamily="mono" fontWeight="semibold">
              {s}
            </Text>
            <Text variant="body-xs" fontFamily="mono" color="muted">
              --shadow-{s}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

function FoundationsRoute() {
  const [selected, setSelected] = useState<Section>('Palettes')
  const refs = useRef<Record<string, HTMLDivElement | null>>({})
  const [resolved, setResolved] = useState<Record<string, string>>({})

  const registerRef = (key: string, node: HTMLDivElement | null) => {
    refs.current[key] = node
  }

  useEffect(() => {
    const compute = () => {
      const next: Record<string, string> = {}
      for (const [key, node] of Object.entries(refs.current)) {
        if (!node) continue
        const bg = getComputedStyle(node).backgroundColor
        next[key] = rgbToHex(bg)
      }
      setResolved(next)
    }
    const id = window.setTimeout(compute, 0)
    const observer = new MutationObserver(compute)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => {
      window.clearTimeout(id)
      observer.disconnect()
    }
  }, [selected])

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface">
      <aside className="flex w-72 shrink-0 flex-col border-r border-stroke bg-surface">
        <div className="border-b border-stroke px-4 py-3.5">
          <Text variant="body-sm" fontWeight="semibold">
            Foundations
          </Text>
          <Text variant="body-xs" color="muted" className='block'>
            {SECTIONS.length} sections
          </Text>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <ul className="space-y-0.5">
            {SECTIONS.map(({ name, icon: Icon }) => {
              const isActive = name === selected
              return (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => setSelected(name)}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-surface-brand-muted font-semibold text-content-brand'
                        : 'font-medium text-content hover:bg-surface-muted'
                    }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          {selected === 'Palettes' ? (
            <PalettesPanel registerRef={registerRef} resolved={resolved} />
          ) : selected === 'Semantic' ? (
            <SemanticPanel registerRef={registerRef} resolved={resolved} />
          ) : selected === 'Radius' ? (
            <RadiusPanel />
          ) : (
            <ShadowsPanel />
          )}
        </div>
      </main>
    </div>
  )
}
