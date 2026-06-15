---
"@swift/components": minor
---

Add `Box` — the lowest-level layout primitive.

A polymorphic element with token-driven box-model props that resolve to inline
styles built from design tokens (so a consumer `style`/`className` always wins
the cascade):

- **Spacing** — `p`/`px`/`py`/`pt`/`pr`/`pb`/`pl` and `m`/`mx`/`my`/`mt`/`mr`/`mb`/`ml`.
  A number is a step on the new `--space-*` scale (`p={4}` → `var(--space-4)`); a
  string passes through raw (`mx="auto"`, `p="2rem"`).
- **Sizing** — `width`/`height`/`min*`/`max*` (number → px, string → raw) and `overflow`.
- **Surface** — `bg` (`--color-surface-*`), `radius` (`--radius-*`), `border`
  (`boolean | tone`), `shadow` (`--shadow-*`) — all theme-aware under dark mode.
- **Polymorphic** via `as`, with `...rest` narrowed to the chosen element.

Also adds a `--space-*` spacing token scale (`theme/spacing.css`) and a deep
import entry (`@swift/components/Box`).
