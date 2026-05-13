# @swift/components

Accessible React components.

## Install

```bash
pnpm add @swift/components @swift/icons react react-dom
```

## Usage

Import the stylesheet once at your app entry:

```ts
import '@swift/components/styles.css'
```

Then use components anywhere:

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
