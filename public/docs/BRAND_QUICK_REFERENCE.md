# Musa — Brand Quick Reference

## Colors

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Primary-500 | `#22C55E` | `green-500` | CTAs, links, accents |
| Primary-400 | `#4ADE80` | `green-400` | Hover, glow effects |
| Primary-300 | `#86EFAC` | `green-300` | Subtle backgrounds |
| Primary-600 | `#16A34A` | `green-600` | Pressed states |
| Primary-700 | `#15803D` | `green-700` | Active states |
| Accent-400 | `#A78BFA` | `violet-400` | Secondary accent |
| Background | `#09090B` | `zinc-950` | Page background |
| Surface-1 | `#0F0F12` | — | Cards, panels |
| Surface-2 | `#18181B` | `zinc-900` | Elevated surfaces |
| Surface-3 | `#1F1F23` | — | Highest elevation |
| Text Primary | `#FAFAFA` | `zinc-50` | Headings, body |
| Text Secondary | `#A1A1AA` | `zinc-400` | Descriptions |
| Text Muted | `#71717A` | `zinc-500` | Captions, hints |
| Error | `#EF4444` | `red-500` | Errors |
| Warning | `#F59E0B` | `amber-500` | Warnings |
| Info | `#3B82F6` | `blue-500` | Information |

## Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| Display | Space Grotesk | 700 | Hero, page titles |
| Heading | Space Grotesk | 600 | Section headings |
| Body | Inter | 400–500 | Paragraphs, UI text |
| Mono | Geist Mono | 400 | Code, technical data |

### Type Scale

| Name | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| Display | 3.5rem (56px) | 1.05 | -0.025em |
| H1 | 3rem (48px) | 1.1 | -0.025em |
| H2 | 2.25rem (36px) | 1.15 | -0.02em |
| H3 | 1.875rem (30px) | 1.2 | -0.02em |
| H4 | 1.5rem (24px) | 1.25 | -0.01em |
| Body LG | 1.125rem (18px) | 1.5 | 0 |
| Body | 1rem (16px) | 1.5 | 0 |
| Body SM | 0.875rem (14px) | 1.5 | 0 |
| Caption | 0.75rem (12px) | 1.5 | 0.025em |

## Spacing Scale

`0 2 4 6 8 10 12 16 20 24 32 40 48 64 80 96 128` (px)

Tailwind: `space-0 space-0.5 space-1 ... space-32`

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Tags, small chips |
| md | 8px | Buttons, inputs |
| lg | 12px | Cards, panels |
| xl | 16px | Modals, large cards |
| 2xl | 24px | Hero sections |
| full | 9999px | Avatars, pills |

## Shadows

| Token | CSS | Usage |
|-------|-----|-------|
| sm | `0 1px 2px rgba(0,0,0,0.3)` | Subtle depth |
| md | `0 4px 6px -1px rgba(0,0,0,0.4)` | Cards |
| lg | `0 10px 15px -3px rgba(0,0,0,0.5)` | Dropdowns |
| glow | `0 0 20px rgba(34,197,94,0.3)` | CTA emphasis |
| glow-lg | `0 0 40px rgba(34,197,94,0.2), 0 0 80px rgba(34,197,94,0.1)` | Hero |

## Gradients

```css
/* Primary gradient */
background: linear-gradient(135deg, #4ADE80, #22C55E);

/* Accent mix */
background: linear-gradient(135deg, #8B5CF6, #22C55E);

/* Text gradient */
background: linear-gradient(135deg, #86EFAC, #22C55E, #A78BFA);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## CSS Variables (Quick Import)

```css
@import url('./musa-brand.css');
```

Or in Tailwind/Next.js, reference `--color-primary-500`, `--surface-1`, `--font-display`, etc.

## Logo

| Variant | File | Usage |
|---------|------|-------|
| Full | `musa-logo-full.svg` | Marketing, header |
| Icon | `musa-logo-icon.svg` | Favicon, app icon |
| Wordmark | `musa-logo-wordmark.svg` | When icon space is limited |
| Mono White | `musa-logo-mono-white.svg` | On dark photos/video |
| Mono Dark | `musa-logo-mono-dark.svg` | On light backgrounds |
| Favicon | `favicon.svg` | Browser tab |

**Clear space**: 1x height of the icon on all sides.
**Minimum size**: 24px (icon), 80px (full logo).

## Voice & Tone

- **Direto** — sem rodeios, frases curtas
- **Empoderador** — "você consegue", resultados concretos
- **Tech-savvy** — termos de mercado, sem jargão excessivo
- **Confiante** — afirmações, não perguntas
- **Acessível** — profissional sem ser frio

### Do

- "Crie copies que convertem em 30 segundos"
- "Seus dados, sua estratégia"
- "Pipeline completo. Zero atrito."

### Don't

- "Talvez funcione para o seu caso..."
- "Nossa incrível e revolucionária plataforma!!!"
- "Solução sinérgica de paradigma disruptivo"
