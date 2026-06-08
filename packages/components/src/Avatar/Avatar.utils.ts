import { COLOUR_PALETTE_SIZE } from './Avatar.constants'

/**
 * Extract initials from a display name. Pure, SSR-safe.
 *
 *   "Raj Singh"          → "RS"
 *   "John Doe"           → "JD"
 *   "Madonna"            → "M"
 *   "Mary Jane Watson"   → "MW"  (first + last token)
 *   "  raj  singh  "     → "RS"  (whitespace-tolerant)
 *   ""                   → ""
 *   undefined            → ""
 *
 * Always returns 0–2 characters, uppercased. Uses the first token's
 * first character + the last token's first character (or just the first
 * for a single-token name) — the convention every consumer-facing
 * design system follows.
 */
export function getInitials(name: string | undefined | null): string {
  if (!name) return ''
  const tokens = name.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return ''
  if (tokens.length === 1) return tokens[0][0]!.toUpperCase()
  const first = tokens[0]![0]!
  const last = tokens[tokens.length - 1]![0]!
  return (first + last).toUpperCase()
}

/**
 * Deterministic colour-palette index from a name. DJB2 hash modulo the
 * palette size — same input always maps to the same slot, on both the
 * server and the client. **SSR-safe**: no `Math.random()`, no
 * `Date.now()`, no `window`/`document` reads.
 *
 *   getColourIndex("Raj Singh") === getColourIndex("Raj Singh")  // always
 *
 * Returns `0` for empty / nullish input so the consumer always gets a
 * stable index they can wire into the palette without an extra check.
 */
export function getColourIndex(name: string | undefined | null): number {
  if (!name) return 0
  let hash = 5381
  for (let i = 0; i < name.length; i++) {
    // DJB2: hash * 33 + char. The `| 0` keeps the intermediate value
    // within int32 so multiplication doesn't drift into float arithmetic.
    hash = ((hash << 5) + hash + name.charCodeAt(i)) | 0
  }
  // `>>> 0` converts the (possibly negative) int32 to a uint32 so the
  // modulo result is always non-negative.
  return (hash >>> 0) % COLOUR_PALETTE_SIZE
}
