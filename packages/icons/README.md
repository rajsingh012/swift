# @swift/icons

Tree-shakeable React SVG icon library.

## Install

```bash
pnpm add @swift/icons
# or
npm install @swift/icons
```

## Usage

```tsx
import { Check, ArrowRight } from '@swift/icons'

export function Example() {
  return (
    <>
      <Check size={20} color="green" />
      <ArrowRight size={24} />
    </>
  )
}
```

## Author your own icon

```tsx
import { createIcon } from '@swift/icons'

export const Star = createIcon(
  'Star',
  <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5" />,
)
```
