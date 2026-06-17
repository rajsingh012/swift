# Swift

Swift is a pnpm monorepo for accessible React UI packages. It contains a component library, a tree-shakeable SVG icon library, and a Vite example app for developing and previewing the system.

## Packages

| Package | Description |
| --- | --- |
| `@swift/components` | Accessible React components with compound APIs, controlled/uncontrolled state patterns, form integration, and shared styling. |
| `@swift/icons` | Tree-shakeable React SVG icons plus helpers for authoring custom icons. |
| `@swift/example` | Vite + React app used to document, preview, and test the packages locally. |

## Getting Started

Install dependencies from the repository root:

```bash
pnpm install
```

Start the example app:

```bash
pnpm dev
```

Build all libraries and the example app:

```bash
pnpm build
```

## Common Commands

```bash
pnpm build        # Build packages and example app
pnpm build:libs   # Build only packages under packages/*
pnpm test         # Run package tests
pnpm lint         # Run package lint checks
pnpm typecheck    # Run package TypeScript checks
pnpm clean        # Remove build output and installed dependencies
```

Package-specific commands can be run with pnpm filters:

```bash
pnpm --filter @swift/components test
pnpm --filter @swift/icons build
pnpm --filter @swift/example dev
```

## Repository Structure

```text
apps/
  example/        Vite app for local previews and documentation
packages/
  components/     React component library
  icons/          React SVG icon library
COMPONENTS.md     Component behavior guide
```

## Using the Libraries

Import component styles once at your app entry:

```ts
import '@swift/components/styles.css'
```

Then import components and icons as needed:

```tsx
import { Button, Card } from '@swift/components'
import { ArrowRight } from '@swift/icons'

export function Example() {
  return (
    <Card title="Hello">
      <Button variant="primary" rightIcon={<ArrowRight size={18} />}>
        Continue
      </Button>
    </Card>
  )
}
```

## Documentation

- [Component package README](./packages/components/README.md)
- [Icon package README](./packages/icons/README.md)
- [Component behavior guide](./COMPONENTS.md)

## Publishing

The libraries are configured for public package publishing through Changesets:

```bash
pnpm changeset
pnpm build:libs
pnpm publish:libs
```
