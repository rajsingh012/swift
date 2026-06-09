export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}

/* CSS hooks for each part. All styling lives in theme/segmented-control.css —
   these strings are the class anchors and nothing else. */

export const rootClasses = 'swift-segmented'
export const itemClasses = 'swift-segmented-item'
export const indicatorClasses = 'swift-segmented-indicator'
