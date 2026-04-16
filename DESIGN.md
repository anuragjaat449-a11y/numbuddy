# Design Brief

## Direction

**Studymore** — A modern dark educational math platform making accessible learning engaging and rewarding through vibrant accents and playful geometry.

## Tone

Bold, energetic, contemporary. Dark theme with vivid teal and warm amber accents creates confidence and joy in learning contexts.

## Differentiation

Module-based color coding (Number Sense purple, Arithmetic teal, Money gold, Time blue) provides instant visual recognition while maintaining a cohesive modern dark aesthetic.

## Color Palette

| Token      | OKLCH          | Role                             |
| ---------- | -------------- | -------------------------------- |
| background | 0.12 0.01 260  | Almost-black base, dark theme    |
| foreground | 0.93 0.01 260  | Off-white text, high contrast    |
| card       | 0.16 0.015 260 | Elevated surfaces, subtle depth  |
| primary    | 0.72 0.18 190  | Vibrant teal, actions & accents  |
| accent     | 0.72 0.16 70   | Warm amber, success & rewards    |
| muted      | 0.22 0.02 260  | Secondary, interactive states    |

## Typography

- **Display**: Space Grotesk — strong, geometric headings and hero text
- **Body**: DM Sans — clean, legible paragraphs and UI labels
- **Scale**: hero `text-5xl md:text-7xl font-bold tracking-tight` | h2 `text-3xl md:text-5xl font-bold tracking-tight` | label `text-sm font-semibold tracking-widest uppercase` | body `text-base md:text-lg`

## Elevation & Depth

Card surfaces sit above background via subtle OKLCH lightness shift (0.04–0.06 L difference) with minimal shadow — no glows, no blur orbs. Buttons and interactive elements pulse slightly on hover without layer jumping.

## Structural Zones

| Zone    | Background              | Border                 | Notes                                |
| ------- | ----------------------- | ---------------------- | ------------------------------------ |
| Header  | `card` (0.16 L)         | `border` bottom, teal  | Logo + nav, top visual anchor        |
| Content | `background` (0.12 L)   | —                      | Alt sections bg-muted/20 every 2-3  |
| Footer  | `muted` (0.22 L)        | `border` top, teal     | Made with ❤️ by anurag_singh.indoliya + Instagram |

## Spacing & Rhythm

Spacious density (1.5x default gaps) with consistent 12px–16px–24px micro-intervals. Module cards stack 2-column on tablet, 1 on mobile. Section dividers use 2rem vertical margin.

## Component Patterns

- **Buttons**: Teal primary (`bg-primary text-primary-foreground`), amber accent (`bg-accent text-accent-foreground`), rounded `lg` (12px)
- **Cards**: `rounded-lg`, `bg-card`, `border border-border`, light hover lift via transform
- **Badges**: Inline module colors (purple #8855FF, teal #00D4AA, gold #FFB800, blue #0099FF) on dark background

## Motion

- **Entrance**: Fade + slide-up (300ms ease-out) on page load, staggered per card
- **Hover**: Button color shift + shadow lift (150ms cubic-bezier)
- **Decorative**: None — focus on clarity and learner engagement over animation spectacle

## Constraints

- No gradients for backgrounds — OKLCH layering only
- Module colors must remain fixed across all screens for learner recognition
- Dark theme is the default; light mode not implemented
- All credits to anurag_singh.indoliya only; no EdUnite or Caffeine.ai branding

## Signature Detail

Teal accent bar beneath header reinforces module color coding and creates visual momentum into content sections.
