<!-- Hallmark · genre: editorial · design-system: custom earthy editorial · source: user-selected swatches -->
# Design — April Jiawei Zhang

A unified system for the personal academic website. Every route uses the same clean cream paper, deep-sage structure, dark-brown text, brick emphasis, tan rules, and established serif–sans typography.

## Genre

Editorial: scholarly, warm, restrained, and legible.

## Macrostructure family

- Home: Marquee-style introduction followed by an Explore grid.
- Research, Teaching, Service, Blog, and About: Long Document content pages.
- “Hello, World.” and training tools: Workbench-style interactive pages.

Existing information architecture and component ownership remain unchanged.

## Theme

- Paper: `oklch(97.64% 0.0208 79.10)`, the clean cream used in the AJZ favicon.
- Surface: `oklch(98.70% 0.0107 76.60)`.
- Ink: `oklch(35.93% 0.0641 28.98)` (dark brown).
- Main green: `oklch(41% 0.08 134.57)` (deep sage for navigation and primary structure).
- Brick emphasis: `oklch(51.93% 0.1215 28.38)`.
- Tan structure: `oklch(79.60% 0.0673 71.84)` with a `oklch(62% 0.055 71.84)` functional rule.
- Sage identity: `oklch(65.09% 0.0754 134.57)`.
- Blush anchor: `oklch(84.40% 0.0410 58.70)`.

Green is the dominant site colour: deep sage carries navigation and primary structure, while the original sage identifies April. Dark brown carries long-form text, brick occupies a smaller emphasis role, and clean cream carries the page; blush remains a secondary supporting tint. The AJZ favicon uses the same sage, cream, and brick-red palette as the website.

## Typography

- Display: Source Serif 4, weight 600, normal style.
- Body: Source Sans 3, weights 400–600.
- Display tracking: tight only at large sizes.
- Page-title scale: `clamp(1.9rem, 2vw + 1rem, 2.6rem)`.
- Home-title scale: `clamp(2rem, 2.25vw + 1.25rem, 2.65rem)`.
- Body measure: approximately 45–75 characters.

## Spacing and motion

- Four-point named spacing scale from `tokens.css`.
- Quiet motion using transform and opacity only.
- Reduced-motion behaviour remains required.

## Component voice

- Header and footer: deep sage green with clean cream text.
- Links and primary actions: brick; hover returns to dark brown.
- Cards: light cream surfaces, tan-derived rules, minimal or no shadow, and tighter radii.
- Page motif: one restrained sage bar; it never represents a section category.
- “Hello, World.”: April = sage ring, published co-authors = brick routes and diamonds, visitors = dark-brown circles.

## Accessibility

- Body text and functional colours meet WCAG AA contrast on cream paper.
- Map meaning is communicated by shape and labels as well as colour.
- Focus uses the functional coral token.

## Exports

### tokens.css

The canonical source is [`tokens.css`](tokens.css).

```css
:root {
  --color-paper: oklch(97.64% 0.0208 79.10);
  --color-paper-2: oklch(98.70% 0.0107 76.60);
  --color-paper-3: oklch(94.12% 0.0255 78.92);
  --color-ink: oklch(35.93% 0.0641 28.98);
  --color-ink-2: oklch(43% 0.05 35);
  --color-muted: oklch(43% 0.05 35);
  --color-rule: oklch(62% 0.055 71.84);
  --color-accent: oklch(51.93% 0.1215 28.38);
  --color-accent-ink: oklch(98.70% 0.0107 76.60);
  --color-focus: oklch(35.93% 0.0641 28.98);
  --font-display: "Source Serif 4", ui-serif, serif;
  --font-body: "Source Sans 3", ui-sans-serif, sans-serif;
  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs: 0.75rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.125rem;
  --text-lg: 1.25rem;
  --text-xl: 1.5rem;
  --text-2xl: 1.875rem;
  --text-page-title: clamp(1.9rem, 2vw + 1rem, 2.6rem);
  --text-display: clamp(2rem, 2.25vw + 1.25rem, 2.65rem);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms;
  --dur-short: 220ms;
  --dur-long: 420ms;
  --radius-card: 0.5rem;
  --radius-input: 0.375rem;
}
```

### Tailwind v4

```css
@theme {
  --color-page: var(--color-paper);
  --color-surface: var(--color-paper-2);
  --color-ink: var(--color-ink);
  --color-muted: var(--color-muted);
  --color-main: var(--color-forest-2);
  --color-primary: var(--color-brick);
  --color-border: var(--color-rule);
  --font-serif: var(--font-display);
  --font-sans: var(--font-body);
}
```

### DTCG

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(97.64% 0.0208 79.10)", "$type": "color" },
    "paper-2": { "$value": "oklch(98.70% 0.0107 76.60)", "$type": "color" },
    "ink": { "$value": "oklch(35.93% 0.0641 28.98)", "$type": "color" },
    "brick": { "$value": "oklch(51.93% 0.1215 28.38)", "$type": "color" },
    "tan": { "$value": "oklch(79.60% 0.0673 71.84)", "$type": "color" },
    "sage": { "$value": "oklch(65.09% 0.0754 134.57)", "$type": "color" },
    "blush": { "$value": "oklch(84.40% 0.0410 58.70)", "$type": "color" },
    "visitor": { "$value": "oklch(35.93% 0.0641 28.98)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "Source Serif 4, ui-serif, serif", "$type": "fontFamily" },
    "body": { "$value": "Source Sans 3, ui-sans-serif, sans-serif", "$type": "fontFamily" }
  }
}
```

### shadcn/ui

```css
:root {
  --background: 97.64% 0.0208 79.10;
  --foreground: 35.93% 0.0641 28.98;
  --card: 98.70% 0.0107 76.60;
  --card-foreground: 35.93% 0.0641 28.98;
  --primary: 51.93% 0.1215 28.38;
  --primary-foreground: 98.70% 0.0107 76.60;
  --secondary: 88% 0.035 134.57;
  --secondary-foreground: 41% 0.08 134.57;
  --muted: 94.12% 0.0255 78.92;
  --muted-foreground: 43% 0.05 35;
  --border: 62% 0.055 71.84;
  --ring: 35.93% 0.0641 28.98;
  --radius: 0.5rem;
}
```

## Provenance

The palette was sampled from user-selected colour swatches and refined into accessible functional roles for an academic personal website. The page paper now uses the AJZ mark's clean cream, while the established mark retains its original construction and the shared sage, cream, and brick-red palette. Structure, content, typography, and imagery are original to this website.
