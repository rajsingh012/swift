import type { Ref, RefObject } from 'react'

/**
 * Fan a single node out to multiple refs (callback or object). Used wherever
 * a component forwards a ref but also needs a local handle for measuring /
 * focus / pointer capture.
 */
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>): Ref<T> {
  return (node: T | null) => {
    for (const r of refs) {
      if (!r) continue
      if (typeof r === 'function') r(node)
      else (r as RefObject<T | null>).current = node
    }
  }
}
