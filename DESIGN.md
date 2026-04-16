# Design Brief

## Direction

**Brain Warmup** — Premium educational math platform with warm light aesthetic, professional typography, and refined modern UI for confident learning.

## Tone

Warm, educational, professional. Cream background with dark brown typography and amber/teal interactive accents create calm learning without sterility.

## Differentiation

Gradient button accents (amber-to-teal) and refined card elevation deliver modern polish while maintaining approachable warmth for all learner types.

## Color Palette

| Token      | OKLCH          | Role                             |
| ---------- | -------------- | -------------------------------- |
| background | 0.98 0.006 75  | Cream base, light theme          |
| foreground | 0.22 0.02 55   | Dark brown text, high contrast   |
| card       | 1 0 0          | White cards, elevated surfaces   |
| primary    | 0.28 0.025 55  | Dark brown action accent         |
| accent     | 0.72 0.15 50   | Warm amber, interactive states   |
| muted      | 0.94 0.008 75  | Light neutral, secondary text    |

## Typography

- **Display**: Fraunces — warm serif, confident headings and branding
- **Body**: Figtree — accessible sans, paragraphs and UI labels
- **Scale**: hero `text-5xl md:text-7xl font-bold tracking-tight` | h2 `text-3xl md:text-5xl font-bold tracking-tight` | label `text-sm font-semibold` | body `text-base md:text-lg`

## Elevation & Depth

Cards elevated via white background and refined shadow. Subtle border on darker surfaces. Button hover: color shift + shadow increase (150ms ease). No glows or artificial bloom.

## Structural Zones

| Zone    | Background          | Border                     | Notes                                    |
| ------- | ------------------- | -------------------------- | ---------------------------------------- |
| Header  | `card` (white)      | `border` bottom            | Logo + nav, visual anchor, no shadow     |
| Content | `background` (cream)| —                          | Card sections with 24px spacing          |
| Footer  | `muted` (0.94 L)    | `border` top               | Made with ❤️ by anurag_singh.indoliya    |

## Spacing & Rhythm

Consistent 12px–16px–24px micro-intervals. Content cards centered with max-width lg (32rem). Section dividers use 2rem vertical margin. Mobile-first responsive at sm/md/lg.

## Component Patterns

- **Buttons**: Primary dark brown, accent amber-to-teal gradient, rounded `md` (8px), text center, 16px padding
- **Cards**: White background, `rounded-md`, subtle shadow, `border border-border`, internal padding 16–24px
- **Input**: Light border, no shadow, focus ring via `primary` color outline

## Motion

- **Entrance**: Fade + slide-up (300ms ease-out) on load, staggered cards
- **Hover**: Button color shift, shadow scale, 150ms transition
- **Interactive**: No decorative animations; focus on clarity and learner engagement

## Constraints

- Warm light theme only — no dark mode toggle
- Fraunces + Figtree fonts exclusively; no system fallbacks
- All credits to anurag_singh.indoliya; no EdUnite/Caffeine.ai references
- App name: Brain Warmup across all metadata and UI text

## Signature Detail

Gradient button accents and refined card spacing deliver modern professionalism while maintaining warm, approachable educational atmosphere.
