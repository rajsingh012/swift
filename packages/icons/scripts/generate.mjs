import { readdirSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import optimizeSvg from './utils/optimizeSvg.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = join(__dirname, '..')
const RAW_DIR = join(PKG_ROOT, 'raw')
const SRC_DIR = join(PKG_ROOT, 'src')
const OUT_DIR = join(PKG_ROOT, 'src_temp')

const RESERVED = new Set(['Default'])

function toPascalCase(name) {
  const cleaned = name.replace(/[^a-zA-Z0-9]+/g, ' ').trim()
  const parts = cleaned.split(/\s+/).map((p) => p.charAt(0).toUpperCase() + p.slice(1))
  let pascal = parts.join('')
  if (/^\d/.test(pascal)) pascal = 'Icon' + pascal
  if (RESERVED.has(pascal)) pascal = pascal + 'Icon'
  return pascal
}

// matches the reference cleanPath() — explicit attr renames + strip dark fills + remove clipPath defs
function cleanPath(data) {
  if (!data) return ''
  return data
    .replace(/"\/>/g, '" />')
    .replace(/ fill="(?:#1D263C|#17181C)"/g, '')
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/xlink:href=/g, 'xlinkHref=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/ clip-path=".+?"/g, '')
    .replace(/<clipPath.+?<\/clipPath>/g, '')
}

function getSvgInner(source) {
  return source.slice(source.indexOf('>') + 1).slice(0, -'</svg>'.length)
}

rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })
mkdirSync(join(OUT_DIR, 'utils'), { recursive: true })

copyFileSync(join(SRC_DIR, 'SvgIcon.tsx'), join(OUT_DIR, 'SvgIcon.tsx'))
copyFileSync(join(SRC_DIR, 'utils', 'createSvgIcon.tsx'), join(OUT_DIR, 'utils', 'createSvgIcon.tsx'))
copyFileSync(join(SRC_DIR, 'utils', 'download.ts'), join(OUT_DIR, 'utils', 'download.ts'))

const files = readdirSync(RAW_DIR)
  .filter((f) => f.toLowerCase().endsWith('.svg'))
  .sort()

const seen = new Map()
const entries = []
const skipped = []

for (const file of files) {
  const base = basename(file, extname(file))
  const componentName = toPascalCase(base)
  if (!componentName) {
    skipped.push({ file, reason: 'empty name' })
    continue
  }
  if (seen.has(componentName)) {
    skipped.push({ file, reason: `duplicate of ${seen.get(componentName)}` })
    continue
  }

  const raw = readFileSync(join(RAW_DIR, file), 'utf8')
  const optimized = optimizeSvg(raw)
  const inner = cleanPath(getSvgInner(optimized)).trim()

  const code = `import createSvgIcon from './utils/createSvgIcon'

export default createSvgIcon(<>${inner}</>, '${componentName}')
`
  writeFileSync(join(OUT_DIR, `${componentName}.tsx`), code)
  seen.set(componentName, file)
  entries.push(componentName)
}

const indexContent =
  `// AUTO-GENERATED — do not edit.\n` +
  `export { default as SvgIcon, type SvgIconProps } from './SvgIcon'\n` +
  `export { default as createSvgIcon } from './utils/createSvgIcon'\n` +
  `export { iconToBlob, downloadIcon } from './utils/download'\n` +
  `export type { IconFormat, IconBlobOptions, DownloadIconOptions } from './utils/download'\n\n` +
  entries.map((name) => `export { default as ${name} } from './${name}'`).join('\n') +
  '\n'

writeFileSync(join(OUT_DIR, 'index.ts'), indexContent)

console.log(`Generated ${entries.length} icons into src_temp/`)
if (skipped.length) {
  console.log(`Skipped ${skipped.length}:`)
  for (const s of skipped) console.log(`  - ${s.file}: ${s.reason}`)
}
