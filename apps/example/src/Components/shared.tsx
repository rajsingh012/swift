import type { ReactNode } from 'react'
import { Text } from '@swift/components'

export function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <Text
      variant="body-xs"
      fontWeight="semibold"
      color="muted"
      className="mb-3 block uppercase tracking-wide"
      variantMapping={{ 'body-xs': 'h2' }}
    >
      {children}
    </Text>
  )
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded bg-surface-inverse p-3 text-xs leading-relaxed text-content-inverse">
      {code}
    </pre>
  )
}

export function PreviewRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-stroke bg-surface-muted p-4">
      {children}
    </div>
  )
}
