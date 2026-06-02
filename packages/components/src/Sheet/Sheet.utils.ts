export { mergeRefs } from '../internal/refs'
export { useControllableState } from '../internal/state'
export {
  FOCUSABLE_SELECTOR,
  getFocusable,
  isTopOverlay,
  pushOverlay,
  removeOverlay,
  useInertBackground,
  usePresence,
  useScrollLock,
} from '../internal/overlay'

export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}
