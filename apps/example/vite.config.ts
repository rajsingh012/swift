import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// Resolve every `@swift/components/*` import (and the bare specifier) to
// the package's `src/` so edits inside the components workspace HMR live
// instead of waiting for `pnpm build` to refresh `dist/`. Production
// consumers still go through the published exports map — this is dev only.
const componentsSrc = resolve(__dirname, '../../packages/components/src')

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter(), react(), tailwindcss()],
  resolve: {
    alias: [
      // Bare specifier first so `@swift/components` (no subpath) resolves
      // to the package's barrel.
      {
        find: /^@swift\/components$/,
        replacement: `${componentsSrc}/index.ts`,
      },
      // Subpaths — `@swift/components/Switch` → `.../src/Switch/index.ts`.
      // Every component directory starts with an uppercase letter; the
      // PascalCase guard keeps `styles.css`, `theme.css`, and `theme/*`
      // (which point at real files, not component dirs) routing through
      // the package.json exports map as normal.
      {
        find: /^@swift\/components\/([A-Z][^/]*)$/,
        replacement: `${componentsSrc}/$1/index.ts`,
      },
    ],
  },
})
