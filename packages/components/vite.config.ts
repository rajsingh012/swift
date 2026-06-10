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
        Alert: resolve(__dirname, 'src/Alert/index.ts'),
        Avatar: resolve(__dirname, 'src/Avatar/index.ts'),
        Badge: resolve(__dirname, 'src/Badge/index.ts'),
        Button: resolve(__dirname, 'src/Button/index.ts'),
        Card: resolve(__dirname, 'src/Card/index.ts'),
        Carousel: resolve(__dirname, 'src/Carousel/index.ts'),
        Checkbox: resolve(__dirname, 'src/Checkbox/index.ts'),
        Chip: resolve(__dirname, 'src/Chip/index.ts'),
        DatePicker: resolve(__dirname, 'src/DatePicker/index.ts'),
        Input: resolve(__dirname, 'src/Input/index.ts'),
        ListItem: resolve(__dirname, 'src/ListItem/index.ts'),
        Radio: resolve(__dirname, 'src/Radio/index.ts'),
        SegmentedControl: resolve(__dirname, 'src/SegmentedControl/index.ts'),
        Sheet: resolve(__dirname, 'src/Sheet/index.ts'),
        Slider: resolve(__dirname, 'src/Slider/index.ts'),
        Switch: resolve(__dirname, 'src/Switch/index.ts'),
        Tabs: resolve(__dirname, 'src/Tabs/index.ts'),
        Text: resolve(__dirname, 'src/Text/index.ts'),
        Toast: resolve(__dirname, 'src/Toast/index.ts'),
        TimePicker: resolve(__dirname, 'src/TimePicker/index.ts'),
        Tooltip: resolve(__dirname, 'src/Tooltip/index.ts'),
        YearPicker: resolve(__dirname, 'src/YearPicker/index.ts'),
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
