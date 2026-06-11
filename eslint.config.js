// Flat ESLint config for the library packages (packages/components,
// packages/icons). apps/example ships its own eslint.config.js.
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'apps/**',
      '**/src_temp/**',
      '**/*.css',
    ],
  },

  // Library sources + package-level config files
  {
    files: [
      'packages/components/src/**/*.{ts,tsx}',
      'packages/components/*.{ts,tsx}',
      'packages/icons/src/**/*.{ts,tsx}',
      'packages/icons/*.{ts,tsx}',
    ],
    extends: [
      eslint.configs.recommended,
      // recommended (NOT type-checked) — keeps lint fast
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat['recommended-latest'],
      jsxA11y.flatConfigs.recommended,
    ],
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Library code forwards arbitrary props by design.
      'react/prop-types': 'off',
      // `{...rest}` spreading is the core pattern of every component here.
      'react/jsx-props-no-spreading': 'off',
      // Allow `as`-casts through unknown that the polymorphic components rely
      // on, but keep it visible as a warning rather than an error.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Components intentionally use empty default handlers in a few stubs.
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // ── Pragmatic downgrades for pre-existing patterns ──────────────
      // `interface FooProps extends BarProps {}` is used as a deliberate
      // alias pattern across the *.types.ts files.
      '@typescript-eslint/no-empty-object-type': 'warn',
      // Mount-detection portals (Toast/Tooltip) and usePresence flip state
      // inside effects on purpose; the new compiler-backed rule flags it.
      'react-hooks/set-state-in-effect': 'warn',
      // "Live ref" mirroring (ref.current = value during render) is a
      // documented pattern in Tabs/Switch/Tooltip for window listeners.
      'react-hooks/refs': 'warn',
      // Two DatePicker assignments flagged; sources are owned elsewhere.
      'no-useless-assignment': 'warn',
      // aria-invalid/aria-required on role="group" / radio inputs — the
      // plugin's ARIA table lags the spec here; treated as advisory.
      'jsx-a11y/role-supports-aria-props': 'warn',
      // Carousel viewport / Sheet content attach drag + key handlers to
      // styled <div>s by design (they manage focus themselves).
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-tabindex': 'warn',
      // Input forwards a consumer-supplied autoFocus.
      'jsx-a11y/no-autofocus': 'warn',
      // Slider.Label associates via context-generated ids.
      'jsx-a11y/label-has-associated-control': 'warn',
    },
  },

  // Tests: jsdom + vitest globals, relax a couple of rules that fight
  // common testing patterns.
  {
    files: ['packages/**/src/**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
)
