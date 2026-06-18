import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
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
        Box: resolve(__dirname, 'src/Box/index.ts'),
        Breadcrumb: resolve(__dirname, 'src/Breadcrumb/index.ts'),
        Button: resolve(__dirname, 'src/Button/index.ts'),
        Card: resolve(__dirname, 'src/Card/index.ts'),
        Carousel: resolve(__dirname, 'src/Carousel/index.ts'),
        Checkbox: resolve(__dirname, 'src/Checkbox/index.ts'),
        Chip: resolve(__dirname, 'src/Chip/index.ts'),
        Collapsible: resolve(__dirname, 'src/Collapsible/index.ts'),
        DatePicker: resolve(__dirname, 'src/DatePicker/index.ts'),
        Dialog: resolve(__dirname, 'src/Dialog/index.ts'),
        Divider: resolve(__dirname, 'src/Divider/index.ts'),
        DropdownMenu: resolve(__dirname, 'src/DropdownMenu/index.ts'),
        Input: resolve(__dirname, 'src/Input/index.ts'),
        ListItem: resolve(__dirname, 'src/ListItem/index.ts'),
        Pagination: resolve(__dirname, 'src/Pagination/index.ts'),
        Popover: resolve(__dirname, 'src/Popover/index.ts'),
        Progress: resolve(__dirname, 'src/Progress/index.ts'),
        Radio: resolve(__dirname, 'src/Radio/index.ts'),
        SegmentedControl: resolve(__dirname, 'src/SegmentedControl/index.ts'),
        Select: resolve(__dirname, 'src/Select/index.ts'),
        Sheet: resolve(__dirname, 'src/Sheet/index.ts'),
        Skeleton: resolve(__dirname, 'src/Skeleton/index.ts'),
        Slider: resolve(__dirname, 'src/Slider/index.ts'),
        Spinner: resolve(__dirname, 'src/Spinner/index.ts'),
        Switch: resolve(__dirname, 'src/Switch/index.ts'),
        Tabs: resolve(__dirname, 'src/Tabs/index.ts'),
        Text: resolve(__dirname, 'src/Text/index.ts'),
        Textarea: resolve(__dirname, 'src/Textarea/index.ts'),
        Toast: resolve(__dirname, 'src/Toast/index.ts'),
        TimePicker: resolve(__dirname, 'src/TimePicker/index.ts'),
        Toggle: resolve(__dirname, 'src/Toggle/index.ts'),
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
      // Declaration emit (vite:dts) is inherently slow — it type-checks the
      // whole package. Silence rolldown's informational plugin-timing check
      // so it doesn't read as a problem on every build.
      checks: { pluginTimings: false },
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
