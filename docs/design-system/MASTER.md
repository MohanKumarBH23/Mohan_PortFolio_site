# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Mohan Portfolio
**Generated:** 2026-11-09 14:25:32
**Category:** General

---

## Global Rules

### Color Palette

#### Dark Mode (Default)
| Role | Color / Token | Value | Usage |
|------|---------------|-------|-------|
| Ground | `--bg-primary` | `oklch(9% 0.007 95)` | Lacquer Black ground |
| Surface | `--bg-surface` | `oklch(12% 0.008 95)` | Raised cards, panels, navbar |
| Text Primary | `--text-primary` | `oklch(93% 0 0)` | Champagne titles |
| Text Body | `--text-body` | `oklch(88% 0 0)` | Warm crisp white |
| Primary Accent | `--color-kinpaku` | `oklch(84% 0.19 80.46)` | Kinpaku Gold leaf mark & CTA |
| Telemetry / Secondary | `--color-patina` | `oklch(70% 0.12 188)` | Verdigris Patina metrics |

#### Light Mode (Navy, Cream & Coral)
| Role | Color / Token | Value / Hex | Usage |
|------|---------------|-------------|-------|
| Primary Ground | `--bg-primary` | `oklch(97.8% 0.015 85)` (`#FAF7F2`) | Warm Linen Cream ground |
| Navy Anchor Ground | `--bg-secondary` | `#0A192F` | Deep Oxford Navy for Navbar, Publications & Footer |
| Raised Surface | `--bg-surface` | `oklch(99.6% 0.005 85)` (`#FFFFFF`) | Pure Milk Cream cards & panels |
| Elevated Surface | `--bg-surface-elevated` | `oklch(96.2% 0.018 85)` (`#F6EFE3`) | Hover panels, inputs |
| Inset Wells | `--bg-well` | `oklch(93.5% 0.022 85)` (`#EFE6D6`) | Code insets, metric boxes, badges |
| Text Primary | `--text-primary` | `oklch(20% 0.055 252)` (`#0B1B32`) | Midnight Oxford Navy headlines & titles |
| Text Body | `--text-body` | `oklch(28% 0.045 252)` (`#1C2E46`) | Deep Oxford Navy body copy (AAA >= 7:1) |
| Text Secondary | `--text-secondary` | `oklch(40% 0.04 252)` (`#354B66`) | Slate Navy secondary copy |
| Text Muted | `--text-muted` | `oklch(52% 0.035 252)` (`#516681`) | Muted Navy dates, micro-metadata |
| Hairline Borders | `--border-subtle` | `oklch(25% 0.05 252 / 0.12)` | Subtle Navy boundary rules |
| Active Borders | `--border-strong` | `oklch(25% 0.05 252 / 0.26)` | Active Navy hairline boundary |
| Primary Accent / CTA | `--color-coral` | `oklch(64% 0.21 28)` (`#F05A48`) | Electric Coral CTA fill & brand mark |
| Button Text | `--color-dark-ink` | `#FFFFFF` | Pure white text on Coral buttons |
| Readable Text Accent | `--text-accent` | `oklch(56% 0.22 28)` (`#D94332`) | Deep Coral for roles, metrics, details |
| Focus Ring | `--border-focus` | `oklch(64% 0.21 28)` | Coral focus ring |
| Secondary Telemetry | `--color-patina` | `oklch(42% 0.13 250)` (`#1E3A8A`) | Deep Navy Blue signal |

### Typography

- **Heading Font:** Archivo
- **Body Font:** Space Grotesk
- **Mood:** minimal, portfolio, designer, creative, clean, artistic
- **Google Fonts:** [Archivo + Space Grotesk](https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #EC4899;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #7C3AED;
  border: 2px solid #7C3AED;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FAF5FF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #7C3AED;
  outline: none;
  box-shadow: 0 0 0 3px #7C3AED20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Minimalism & Swiss Style

**Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential

**Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools

**Key Effects:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Page Pattern

**Pattern Name:** Hero + Features + CTA

- **Conversion Strategy:** Deep CTA placement. For CTA label text, verify at least 4.5:1 against the button fill; use 7:1 only when the product explicitly targets AAA normal-text contrast. Keep focus and component boundaries independently visible. Disable hero parallax under reduced motion and render its static final state.
- **CTA Placement:** Hero (sticky) + Bottom
- **Section Order:** Hero with headline/image > Value prop > Key features (3-5) > CTA section > Footer

---

## Anti-Patterns (Do NOT Use)


### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
