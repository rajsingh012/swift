import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    dts({
      include: ['src'],
      entryRoot: 'src',
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        Accordion: resolve(__dirname, 'src/Accordion/index.ts'),
        Badge: resolve(__dirname, 'src/Badge/index.ts'),
        Button: resolve(__dirname, 'src/Button/index.ts'),
        Card: resolve(__dirname, 'src/Card/index.ts'),
        Chip: resolve(__dirname, 'src/Chip/index.ts'),
        Text: resolve(__dirname, 'src/Text/index.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) =>
        format === 'es' ? `${entryName}.js` : `${entryName}.cjs`,
      cssFileName: 'styles',
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@swift/icons',
      ],
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
})
