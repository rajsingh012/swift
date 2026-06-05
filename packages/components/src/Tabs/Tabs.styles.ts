export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}

/* The CSS hooks every part attaches to. All styling lives in theme/tabs.css —
   these strings are the data-attribute anchors and nothing else. */

export const rootClasses = 'swift-tabs'
export const listClasses = 'swift-tabs-list'
export const triggerClasses = 'swift-tabs-trigger'
export const contentClasses = 'swift-tabs-content'
export const indicatorClasses = 'swift-tabs-indicator'
