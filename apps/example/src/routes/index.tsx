import { useMemo, useState, type ComponentType } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import * as Icons from '@swift/icons'
import { useIconSearch } from '../lib/icon-search'
import { CopyableImport } from '../lib/CopyableImport'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

type IconComp = ComponentType<{ size?: number; className?: string }>

const NON_ICON_EXPORTS = new Set(['SvgIcon', 'createSvgIcon'])

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

function RouteComponent() {
  const [selected, setSelected] = useState(allIcons[0]?.[0] ?? '')
  const { query } = useIconSearch()

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
    <div className="flex h-full w-full overflow-hidden bg-white dark:bg-gray-950">
      <aside className="flex w-72 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3.5 dark:border-gray-800">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              @swift/icons
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {query
                ? `${filtered.length} of ${allIcons.length}`
                : `${allIcons.length} icons`}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filtered.length === 0 ? (
            <p className="px-2 py-4 text-sm text-gray-500 dark:text-gray-400">
              No icons match “{query}”.
            </p>
          ) : (
            <ul className="space-y-0.5">
              {filtered.map(([name, C]) => {
                const isActive = name === selected
                return (
                  <li key={name}>
                    <button
                      type="button"
                      onClick={() => setSelected(name)}
                      className={`group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                        isActive
                          ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                          : 'font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <C
                        size={18}
                        className={
                          isActive
                            ? 'text-indigo-600 dark:text-indigo-300'
                            : colorFor(name)
                        }
                      />
                      <span className="truncate">{name}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {!Selected ? (
          <p className="text-gray-500 dark:text-gray-400">Select an icon from the sidebar.</p>
        ) : (
          <div className="grid gap-8">
            <header className="flex items-center gap-4">
              <div className="flex size-20 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                <Selected size={48} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                  {selected}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {readableName(selected)}
                </p>
              </div>
            </header>

            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Description
              </h2>
              <p className="text-gray-800 leading-relaxed dark:text-gray-200">
                {describe(selected)}
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Sizes
              </h2>
              <div className="flex items-end gap-6">
                {[
                  { size: 16, color: 'text-blue-600' },
                  { size: 20, color: 'text-emerald-600' },
                  { size: 24, color: 'text-violet-600' },
                  { size: 32, color: 'text-orange-500' },
                  { size: 48, color: 'text-red-500' },
                ].map(({ size, color }) => (
                  <div key={size} className="flex flex-col items-center gap-1">
                    <Selected size={size} className={color} />
                    <small className="text-xs text-gray-500 dark:text-gray-400">{size}px</small>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Colors
              </h2>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {[
                  { label: 'default', text: 'text-gray-900 dark:text-gray-100', bg: 'bg-gray-50 dark:bg-gray-800' },
                  { label: 'slate', text: 'text-slate-700', bg: 'bg-slate-100' },
                  { label: 'gray', text: 'text-gray-400', bg: 'bg-gray-100' },
                  { label: 'blue', text: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'indigo', text: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'violet', text: 'text-violet-600', bg: 'bg-violet-50' },
                  { label: 'pink', text: 'text-pink-600', bg: 'bg-pink-50' },
                  { label: 'red', text: 'text-red-500', bg: 'bg-red-50' },
                  { label: 'orange', text: 'text-orange-500', bg: 'bg-orange-50' },
                  { label: 'amber', text: 'text-amber-500', bg: 'bg-amber-50' },
                  { label: 'emerald', text: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'teal', text: 'text-teal-600', bg: 'bg-teal-50' },
                  { label: 'cyan', text: 'text-cyan-600', bg: 'bg-cyan-50' },
                  { label: 'lime', text: 'text-lime-600', bg: 'bg-lime-50' },
                  { label: 'dark', text: 'text-white', bg: 'bg-gray-900' },
                ].map(({ label, text, bg }) => (
                  <div
                    key={label}
                    className={`flex flex-col items-center gap-1 rounded-lg border border-gray-200 p-3 dark:border-gray-700 ${bg}`}
                  >
                    <Selected size={32} className={text} />
                    <small
                      className={`text-xs ${
                        label === 'dark' ? 'text-white' : 'text-gray-600'
                      }`}
                    >
                      {label}
                    </small>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Import
              </h2>
              <div className="grid gap-3">
                <CopyableImport
                  label="Named import"
                  code={`import { ${selected} } from '@swift/icons'`}
                />
                <CopyableImport
                  label="Deep import"
                  code={`import ${selected} from '@swift/icons/${selected}'`}
                />
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Usage
              </h2>
              <pre className="overflow-x-auto rounded bg-gray-900 p-3 text-xs leading-relaxed text-gray-100 dark:border dark:border-gray-700">
                {`<${selected} size={24} />
<${selected} size={32} className="text-blue-600" />`}
              </pre>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
