/** Join class fragments, skipping falsy values. */
export function cx(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ')
}
