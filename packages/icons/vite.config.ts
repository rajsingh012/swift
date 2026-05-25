import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { readdirSync } from 'node:fs'

const SRC_TEMP = resolve(__dirname, 'src_temp')

const iconEntries = Object.fromEntries(
  readdirSync(SRC_TEMP)
    .filter((file) => file.endsWith('.tsx') && file !== 'SvgIcon.tsx')
    .map((file) => {
      const name = file.replace(/\.tsx$/, '')
      return [name, resolve(SRC_TEMP, file)]
    }),
)

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(SRC_TEMP, 'index.ts'),
        SvgIcon: resolve(SRC_TEMP, 'SvgIcon.tsx'),
        'utils/createSvgIcon': resolve(SRC_TEMP, 'utils/createSvgIcon.tsx'),
        'utils/download': resolve(SRC_TEMP, 'utils/download.ts'),
        ...iconEntries,
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.js` : `${entryName}.cjs`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        exports: 'named',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
})
