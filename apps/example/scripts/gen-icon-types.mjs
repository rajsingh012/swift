/**
 * Generates apps/example/src/swift-icons.d.ts — ambient declarations for every
 * `@swift/icons/*` subpath import.
 *
 * Why this exists: the icon package is code-generated at build time
 * (packages/icons/scripts/generate.mjs) and its `dist` is gitignored, so there
 * is no persistent source or checked-in declaration for `tsc` to resolve. On a
 * fresh CI checkout (e.g. Vercel) the built `dist/*.d.ts` may be missing/stale
 * when the example type-checks, breaking `tsc -b` with TS2307/TS7016. This
 * script derives the icon names from the raw SVGs (the same source of truth the
 * icon generator uses) and emits a committed .d.ts so the type-check is
 * independent of the built package.
 *
 * Run after adding/removing icons:
 *   node apps/example/scripts/gen-icon-types.mjs
 */
import { readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '../../..')
const RAW_DIR = join(REPO_ROOT, 'packages/icons/raw')
const OUT_FILE = join(__dirname, '../src/swift-icons.d.ts')

// Mirror packages/icons/scripts/generate.mjs → toPascalCase exactly so the
// declared names match the emitted component names.
const RESERVED = new Set(['Default'])
function toPascalCase(name) {
  const cleaned = name.replace(/[^a-zA-Z0-9]+/g, ' ').trim()
  const parts = cleaned
    .split(/\s+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
  let pascal = parts.join('')
  if (/^\d/.test(pascal)) pascal = 'Icon' + pascal
  if (RESERVED.has(pascal)) pascal = pascal + 'Icon'
  return pascal
}

const seen = new Set()
const names = []
for (const file of readdirSync(RAW_DIR)) {
  if (!file.toLowerCase().endsWith('.svg')) continue
  const name = toPascalCase(file.replace(/\.svg$/i, ''))
  if (!name || seen.has(name)) continue
  seen.add(name)
  names.push(name)
}
names.sort()

const subpathModules = names
  .map(
    (n) => `declare module '@swift/icons/${n}' {
  export const ${n}: SwiftIconComponent
  export default ${n}
}`,
  )
  .join('\n')

// The bare-specifier barrel re-exports every icon (named) plus the shared
// SvgIcon primitive and the download utilities.
const barrelModule = `declare module '@swift/icons' {
  export const SvgIcon: SwiftIconComponent
${names.map((n) => `  export const ${n}: SwiftIconComponent`).join('\n')}
}`

const modules = `${barrelModule}\n\n${subpathModules}`

const content = `/**
 * Ambient declarations for \`@swift/icons/*\` subpath imports.
 *
 * The icon package is CODE-GENERATED at build time (packages/icons/scripts/
 * generate.mjs) and its \`dist\` is gitignored, so there is no persistent
 * source or committed declaration for \`tsc\` to resolve. On a fresh CI
 * checkout (e.g. Vercel) the built \`dist/*.d.ts\` may be missing or stale when
 * the example type-checks, which broke \`tsc -b\` with TS2307/TS7016 across
 * every icon import.
 *
 * This file declares each icon subpath (named + default export) with the
 * shared icon component type, matching how Vite bundles them from source, so
 * the type-check never depends on the built icon package.
 *
 * GENERATED — do not edit by hand. Regenerate with:
 *   node apps/example/scripts/gen-icon-types.mjs
 */
import type {
  ComponentPropsWithoutRef,
  NamedExoticComponent,
  RefAttributes,
} from 'react'

interface SwiftIconProps extends ComponentPropsWithoutRef<'svg'> {
  size?: number | string
  title?: string
}
type SwiftIconComponent = NamedExoticComponent<
  SwiftIconProps & RefAttributes<SVGSVGElement>
>

${modules}
`

writeFileSync(OUT_FILE, content)
console.log(`Generated ${names.length} icon declarations → ${OUT_FILE}`)
