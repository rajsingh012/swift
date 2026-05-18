# Font Assets

The design-system ships **three embedded font families** plus CSS-vars so hosts can swap or extend:

| Token            | Internal family | Weights |
|------------------|-----------------|---------|
| `--font-figtree` | **Figtree**     | 400 · 500 · 600 · 700 |
| `--font-dmmono`  | **DM Mono**     | 400 · 500 |
| `--font-playfair`| **Playfair**    | 400 · 700 |

Each token feeds the composite variables consumed by Tailwind:
`--font-sans` → var(--font-figtree) + system fallbacks, etc.

## Usage

### Step 1: Import Font CSS

```typescript
import '@ixigo/iui/fonts/style.css';
```

That's it – font faces are registered and CSS variables are defined:

```css
:root {
  --font-figtree: 'Figtree', '__figtree_Fallback';
  --font-sans: var(--font-figtree), ui-sans-serif, system-ui, sans-serif;
  /* …similar for --font-serif / --font-mono */
}
```

Override in host app simply by redefining the variables:

```css
/* e.g. globals.css in Next.js */
:root { --font-sans: var(--font-figtree), '__figtree_Fallback', Inter, sans-serif; }
```

### Step 2: Use Tailwind Classes

The `iuiThemePlugin()` automatically configures font families:

```typescript
import type { Config } from 'tailwindcss';
import { iuiThemePlugin } from '@ixigo/iui/tailwind';

export default {
  plugins: [iuiThemePlugin()],
} satisfies Config;
```

This configures:
- `font-sans` → Figtree
- `font-mono` → DM Mono
- `font-serif` → Playfair

Now use Tailwind classes:

```tsx
<div className="font-sans">Figtree font</div>
<div className="font-mono">DM Mono font</div>
<div className="font-serif">Playfair font</div>
```

## Advanced: Font Preloading (Optional)

For advanced performance optimization, you can preload the primary font.  
Import the font file directly - your bundler will resolve the correct URL:

### Vite/Rspress

```typescript
import { defineConfig } from 'vite';
import figtreeRegular from '@ixigo/iui/fonts/assets/figtree_regular.ttf';

export default defineConfig({
  head: [
    [
      'link',
      {
        rel: 'preload',
        href: figtreeRegular,
        as: 'font',
        type: 'font/ttf',
        crossOrigin: 'anonymous',
      },
    ],
  ],
});
```

### Next.js

```tsx
// app/layout.tsx
import figtreeRegular from '@ixigo/iui/fonts/assets/figtree_regular.ttf';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link
          rel="preload"
          href={figtreeRegular}
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Available Fonts for Import

```typescript
import sansRegular from '@ixigo/iui/fonts/assets/sans.regular.ttf';
import sansMedium from '@ixigo/iui/fonts/assets/sans.medium.ttf';
import sansSemibold from '@ixigo/iui/fonts/assets/sans.semibold.ttf';
import sansBold from '@ixigo/iui/fonts/assets/sans.bold.ttf';
import monoRegular from '@ixigo/iui/fonts/assets/mono.regular.ttf';
import monoMedium from '@ixigo/iui/fonts/assets/mono.medium.ttf';
import serifRegular from '@ixigo/iui/fonts/assets/serif.regular.ttf';
import serifBold from '@ixigo/iui/fonts/assets/serif.bold.ttf';
```

## Direct CSS Usage

```css
body {
  font-family: 'Figtree', sans-serif;
}

code {
  font-family: 'DM Mono', monospace;
}

.serif {
  font-family: 'IUI Serif', serif;
}
```


