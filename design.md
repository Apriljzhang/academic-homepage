<!-- Hallmark · genre: editorial · design-system: studied-DNA · source: user-attached reference -->
# Design — April Jiawei Zhang

A unified system for the personal academic website. Every route uses the same warm cream paper, forest structure, coral emphasis, and established serif–sans typography.

## Genre

Editorial: scholarly, warm, restrained, and legible.

## Macrostructure family

- Home: Marquee-style introduction followed by an Explore grid.
- Research, Teaching, Service, Blog, and About: Long Document content pages.
- “Hello, World.” and training tools: Workbench-style interactive pages.

Existing information architecture and component ownership remain unchanged.

## Theme

- Paper: `oklch(97.64% 0.0208 79.10)`
- Surface: `oklch(99.20% 0.0073 80.72)`
- Ink: `oklch(29.30% 0.0365 169.33)`
- Forest: `oklch(39.56% 0.0607 169.28)`
- Coral: `oklch(66.48% 0.1672 29.23)`
- Functional coral: `oklch(55.06% 0.1497 27.97)`
- Visitor slate blue: `oklch(51.92% 0.0626 227.63)`, restricted to visitor data on “Hello, World.”

Coral occupies a small footprint. Forest carries navigation and structure; cream carries the page.

## Typography

- Display: Source Serif 4, weight 600, normal style.
- Body: Source Sans 3, weights 400–600.
- Display tracking: tight only at large sizes.
- Body measure: approximately 45–75 characters.

## Spacing and motion

- Four-point named spacing scale from `tokens.css`.
- Quiet motion using transform and opacity only.
- Reduced-motion behaviour remains required.

## Component voice

- Header and footer: forest with cream text.
- Links and primary actions: functional coral; hover returns to forest.
- Cards: warm-white surfaces, warm rules, restrained shadows.
- Page motif: one forest bar with one shorter coral bar; it never represents a section category.
- “Hello, World.”: April = green ring, published co-authors = coral routes and diamonds, visitors = slate-blue circles.

## Accessibility

- Body text and functional colours meet WCAG AA contrast on cream.
- Map meaning is communicated by shape and labels as well as colour.
- Focus uses the functional coral token.

## Exports

### tokens.css

The canonical source is [`tokens.css`](tokens.css).

### Tailwind v4

```css
@theme {
  --color-page: var(--color-paper);
  --color-surface: var(--color-paper-2);
  --color-ink: var(--color-ink);
  --color-muted: var(--color-muted);
  --color-main: var(--color-forest);
  --color-primary: var(--color-coral-strong);
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
    "ink": { "$value": "oklch(29.30% 0.0365 169.33)", "$type": "color" },
    "forest": { "$value": "oklch(39.56% 0.0607 169.28)", "$type": "color" },
    "coral": { "$value": "oklch(66.48% 0.1672 29.23)", "$type": "color" },
    "visitor": { "$value": "oklch(51.92% 0.0626 227.63)", "$type": "color" }
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
  --foreground: 29.30% 0.0365 169.33;
  --card: 99.20% 0.0073 80.72;
  --card-foreground: 29.30% 0.0365 169.33;
  --primary: 55.06% 0.1497 27.97;
  --primary-foreground: 99.20% 0.0073 80.72;
  --secondary: 95% 0.0116 162.04;
  --secondary-foreground: 39.56% 0.0607 169.28;
  --muted: 94.94% 0.017 76.11;
  --muted-foreground: 44.51% 0.0225 56.78;
  --border: 84.76% 0.0296 77.52;
  --ring: 55.06% 0.1497 27.97;
  --radius: 0.75rem;
}
```

## Provenance

The palette was adapted from a user-attached public design reference and refined for an academic personal website. Structure, content, typography, and imagery are original to this website.
