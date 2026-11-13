---
name: Mohan Kumar B.H Portfolio
description: Centre-Rail Monograph archival reference system for AI, ML, and Software Engineering work on bone paper and rubric vermilion ink.
colors:
  primary: "#B3371E"
  primary-hover: "#962C17"
  primary-edge: "#7D2412"
  neutral-ground: "#F8F5E8"
  neutral-fold: "#F3EEE3"
  ink-primary: "#0F100F"
  ink-secondary: "#434440"
  ink-muted: "#5C5B4F"
  rule-ash: "#C5C2B9"
typography:
  display:
    fontFamily: "Newsreader, Petrona Variable, Petrona, Georgia, serif"
    fontSize: "clamp(38px, 4.6vw, 60px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Newsreader, Petrona Variable, Petrona, Georgia, serif"
    fontSize: "clamp(28px, 3vw, 40px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Petrona Variable, Petrona, Georgia, serif"
    fontSize: "1.09375rem"
    fontWeight: 300
    lineHeight: 1.52
    letterSpacing: "0em"
  body:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0em"
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-ground}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-masthead:
    backgroundColor: "{colors.neutral-ground}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "36px"
  button-masthead-hover:
    backgroundColor: "{colors.ink-primary}"
    textColor: "{colors.neutral-ground}"
  input-field:
    backgroundColor: "{colors.neutral-ground}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "42px"
  specimen-card:
    backgroundColor: "{colors.neutral-ground}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.none}"
    padding: "16px"
---

# Design System: Mohan Kumar B.H Portfolio

## Overview

**Creative North Star: "The Centre-Rail Monograph"**

This design system treats an AI and software systems portfolio as a bound technical reference monograph rather than a marketing SaaS template. Pages rest on quiet Editorial Bone paper, bisected on desktop by a vertical centre-rail spine (`M O H A N`) that anchors credentials, empirical IEEE benchmarks, and live interactive software artifacts side by side. Structural hierarchy comes strictly from typographic scale shifts between literary serif titles and crisp sans/mono metadata, separated by razor-sharp single-pixel rules with zero corner rounding.

Every interactive surface favors archival restraint: no ambient drop shadows, no gradient fills, and no decorative badge inflation. Rubric Vermilion serves exclusively as the proofreader's ink—marking active navigation states, section indices, focus outlines, text selection highlights, and primary action plates.

**Key Characteristics:**
- Editorial Bone paper ground paired with carbon-ink hairline framing (`1px`) and zero rounded corners (`0px`) everywhere
- Three-register typography uniting `Newsreader` display heads, `Petrona Variable` lead summaries, `IBM Plex Sans` interface copy, and `IBM Plex Mono` tabular indices
- Strictly flat elevation model using warm vellum tonal shifts rather than blurred or hard-offset box shadows
- Self-hosted open-source WOFF2 font families bundled locally for deterministic rendering under strict CSP rules

## Colors

One warm archival neutral paper palette punctuated by a single proofreader's vermilion accent (`primary`) and zero decorative secondary gradients.

### Primary
- **Rubric Vermilion** (`primary`): Proofreader accent ink used sparingly for section indices (`01`–`07`), primary action buttons, active navigation states, caret color, `:focus-visible` outlines (`2px` solid), and text selection fill.
- **Pressed Vermilion** (`primary-hover`): Hover state surface for primary filled action plates, providing clear tactile ink darkening without shifting luminance violently.
- **Deep Rubric Edge** (`primary-edge`): Outer `1px` perimeter hairline stroke on primary action buttons and error-status markers to keep warm red edges crisp against light paper.

### Neutral
- **Editorial Bone** (`neutral-ground`): Unbleached warm paper canvas covering the main reading ground, specimen card wells, and modal surfaces.
- **Recessed Vellum Fold** (`neutral-fold`): Subtle warm tonal shift used behind secondary table headers, credential strips, alternating specification bands, and active navigation drawer items.
- **Graphite Carbon Ink** (`ink-primary`): High-contrast neutral black-olive ink for display headings, section rules, masthead actions, and primary reading copy.
- **Soot Charcoal** (`ink-secondary`): Softened dark mineral tone for lead paragraphs (`Petrona Variable`), body abstracts, and form field framing borders.
- **Archival Slate Olive** (`ink-muted`): Accessible muted label and placeholder ink darkened to preserve WCAG AA contrast (`>= 4.5:1`) on both Editorial Bone (`6.27:1`) and Recessed Vellum Fold (`5.92:1`).
- **Fine Ash Rule** (`rule-ash`): Delicate secondary divider rule separating internal metadata rows, specimen card footers, and tag outlines inside heavier `ink-primary` containers.

### Named Rules
**The Proofreader's Ink Rule.** Reserve Rubric Vermilion (`primary`) for directional focus, indices, and primary calls to action so it occupies less than 10% of any viewport and never dilutes into ambient chrome.
**The Contrast Floor Rule.** Never lighten secondary metadata ink below Archival Slate Olive (`ink-muted`) on Recessed Vellum Fold surfaces; every monospace index and placeholder must clear the `4.5:1` AA threshold.

## Typography

**Display Font:** `Newsreader` with `Petrona Variable`, `Petrona`, `Georgia`, `serif`
**Body Font:** `IBM Plex Sans` with `system-ui`, `-apple-system`, `sans-serif`
**Label/Mono Font:** `IBM Plex Mono` with `ui-monospace`, `SFMono-Regular`, `monospace`

**Character:** Literary serif gravitas meets technical documentation clarity. Classic optical serifs carry authorship and section titles, while geometric grotesque copy and tabular monospace metrics keep complex AI architectures effortlessly scannable.

### Hierarchy
- **Display** (`400` weight, `clamp(38px, 4.6vw, 60px)`, `1.02` line-height, `-0.025em` tracking): Reserved for the hero name plate and primary folio headline.
- **Headline** (`400` weight, `clamp(28px, 3vw, 40px)`, `1.08` line-height, `-0.02em` tracking): Section titles (`02`–`07`), sitting baseline-aligned beside inline vermilion monospace indices.
- **Title** (`300` weight, `17.5px` / `15.5px` lead subtitles, `1.52` line-height): Introductory thesis statements (`Petrona Variable` light) directly under hero names and section headings.
- **Body** (`400` weight, `14px`–`15px`, `1.55` line-height, `68ch` max measure): Biographical prose, technical abstracts, specification tables, and project breakdowns.
- **Label** (`500` weight, `10px`–`12px`, `0.08em` tracking, uppercase + tabular lining numerals): Monospace coordinates, plate stamps (`PLATE 01 · MK`), filter pills, and quantitative metric counters.

### Named Rules
**The Inline Index Rule.** Place section numbers (`02`–`07`) inline with the `h2` display title inside one horizontal baseline; never stack repetitive uppercase eyebrow kickers above section headings.
**The Tabular Metric Rule.** Enforce `font-variant-numeric: tabular-nums` on every benchmark counter, navigation numeral, timestamp, and plate index so animated `SlidingNumber` transitions never jitter adjacent columns.

## Layout

Built around an asymmetrical Swiss monograph grid capped at `1376px` container width with responsive horizontal edge padding (`20px` below `640px`, `32px` on tablet, `56px` at desktop breakpoints). In the opening hero workbench, desktop splits across three tracks (`1fr` copy block, `56px` vertical `M O H A N` spine rail, and `0.82fr` portrait specimen plate). Below the hero workbench, sections `02` through `07` alternate two-column editorial reading grids (`1.15fr / 0.85fr`), crisp multi-column system matrices, and single-rule ledger tables with generous vertical breathing room (`64px`–`88px` between major chapters).

## Elevation & Depth

**Zero Shadows.** This system uses no drop shadows, blur radii, or ambient elevation layers—including on floating notifications (`ToastBanner`) and modal dialogs (`ProjectModal`, `PdfViewerModal`). Depth and interactive hierarchy emerge strictly from stark luminance contrast (`neutral-ground` vs `neutral-fold` wells and crisp backdrop dimming behind dialogs) combined with double-hairline inner specimen frames (`1px` outer carbon border enclosing a recessed inner plate border).

### Named Rules
**The Ink-On-Paper Rule.** Surfaces stay flat at rest and in motion; state changes shift background ink (`neutral-ground` to `ink-primary` or `neutral-fold`) or border weight within a `1px`–`2px` frame rather than casting shadows.

## Shapes

Strict orthogonal geometry with `0px` corner radius applied universally to every element, pseudo-element, button, badge, portrait frame, scrollbar thumb, input box, and modal dialog. Borders rely on continuous `1px solid` rules (`ink-primary` for outer structural boundaries, `ink-ash` for internal partitions) alongside crisp `1px` vertical accent markers (`primary`) on credential strips and IEEE callouts rather than heavy multi-pixel side stripes.

## Components

Every component feels stamped onto archival stock: crisp corners, unambiguous hover inversions, and zero ornamental bloat.

### Buttons
- **Shape:** Sharp rectangular corners (`0px` radius) with subtle internal hairline framing on filled plates.
- **Primary:** Solid Rubric Vermilion (`primary`) fill paired with Editorial Bone (`neutral-ground`) label text, `42px` height, `20px` horizontal padding, and a crisp `1px` inset light hairline frame.
- **Hover / Focus:** Transitions fill smoothly to Pressed Vermilion (`primary-hover`); keyboard focus triggers a crisp `2px` Rubric Vermilion outer ring (`2px` offset).
- **Masthead / Secondary Ghost:** Unfilled Editorial Bone fill enclosed by `1px solid` Graphite Carbon Ink (`ink-primary`), `36px` height, inverts completely to dark ink ground with bone text on hover; secondary inline actions use crisp underline bottom rules shifting to vermilion on hover.

### Chips
- **Style:** Rectangular technical metadata stamps (`1px` `rule-ash` perimeter on Editorial Bone ground, `11px` monospace or concise sans tags).
- **State:** Active category filter tabs (`All Systems`, domain tabs) invert cleanly via shared-layout animated background from muted neutral ink on translucent paper to full Editorial Bone ink atop Graphite Carbon Ink (`ink-primary`).

### Cards / Containers
- **Corner Style:** Orthogonal (`0px` radius).
- **Background:** Editorial Bone (`neutral-ground`) resting canvas; credential callouts and specimen headers step slightly inward to Recessed Vellum Fold (`neutral-fold`) at `50%`–`100%` opacity.
- **Shadow Strategy:** None (`box-shadow: none`); framed strictly by `1px` `ink-primary` or `ink-ash` hairline borders.
- **Internal Padding:** Compact structural rhythm (`16px`–`24px` inside system cards, `8px` double-frame margin on portrait plates).

### Inputs / Fields
- **Style:** Sharp rectangular wells (`0px`), `42px` standard text input height, `1px` Soot Charcoal (`ink-secondary`) stroke over Editorial Bone ground with `14px` horizontal padding and accessible `ink-muted` placeholders.
- **Focus:** Border shifts immediately to Rubric Vermilion (`primary`) alongside the global `2px` `primary` `:focus-visible` keyboard outline; active text cursor inherits `caret-color: var(--rubric-accent)`.
- **Error / Disabled:** Validation messages display inline crisp vermilion feedback slips below the dispatch button; throttled submissions surface countdown cooldown guidance cleanly.

### Navigation
- **Style & States:** Full-bleed sticky-free top masthead rule (`1px` `ink-primary` bottom border) housing the crosshair brand monogram, numbered inline chapter links (`01`–`07` with `ink-muted` numerals), and right-aligned `RESUME PDF +` trigger. Active scroll-spy chapter highlights in Rubric Vermilion (`primary`, medium weight); viewports below `768px` collapse links into a bordered full-width slide drawer aligned cleanly with page margins.

### Signature Component: Specimen Portrait & Centre-Rail Spine
- Framed editorial figure plate (`PLATE 01 · MK`) pairing an outer `1px` carbon ink mat around a recessed square portrait frame with tabular footer coordinates, balanced centrally by a vertical hairline spine punctuated with `6px` square vermilion terminal nodes and stacked `M · O · H · A · N` glyphs.

## Do's and Don'ts

### Do:
- **Do** enforce `0px` corner radius on every container, tag, image mat, scrollbar, and dialog without exception.
- **Do** validate every text/surface combination—especially small monospace indices over Recessed Vellum Fold (`neutral-fold`)—to maintain `>= 4.5:1` WCAG AA contrast via `ink-muted` (`#5C5B4F`) or darker.
- **Do** restore keyboard focus back to the invoking trigger element whenever `ProjectModal` or `PdfViewerModal` closes.
- **Do** keep portrait plates cleanly anchored (`object-contain object-bottom`) and architectural board captures uncropped inside fixed specimen containers.

### Don't:
- **Don't** introduce drop shadows, ambient neon glows, frosted glass blurs, or multi-stop gradients anywhere on cards, toasts, or buttons.
- **Don't** stack uppercase eyebrow kickers above section `h2` headings; integrate chapter indices inline on one baseline.
- **Don't** use heavy `>= 2px` colored vertical bars on callout strips; stick to `1px` hairline accents matching the grid stroke weight.
- **Don't** leave unstyled browser defaults on `::selection`, `caret-color`, scrollbars, or focus rings; bind them to Rubric Vermilion and Editorial Bone tokens.
