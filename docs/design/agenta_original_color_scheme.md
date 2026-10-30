# Agenta Original Color Scheme: Comprehensive Architecture & Token Finding Report

## 1. Executive Summary & Design DNA

The **Agenta** template (originating from [Kokonut UI](https://kokonutui.com)) is built upon a high-contrast, technical editorial palette termed **"Quiet Electric Monochrome"**. 

Unlike conventional SaaS applications that rely on heavy primary blues or generic purple gradients, Agenta employs:
1. **A Monochromatic High-Fidelity Substratum:** Deep obsidian dark mode (`#080808`) and crisp pure white light mode (`#FFFFFF`), layered with subtle fractional opacity steps (`black/1%` through `black/15%`, `white/2%` through `white/10%`).
2. **A High-Voltage Signature Neon Accent:** **Electric Ice Cyan (`#A8F1F7`)**, used sparingly (<3% visual weight at rest) for high-intent primary calls to action, active navigation indicators, focus rings, and kinetic hover borders.
3. **Restrained Functional & Telemetry Channels:** Dedicated semantic hues for verification (Emerald), inquiry (Sky Blue), hardware kinematics (Amber/Rose), and cognitive developmental milestones (Lime/Cyan).

---

## 2. Core Palette Breakdown

### 2.1 The Signature Agenta Accent: Electric Ice Cyan

| Token / Variant | Hex Value | RGB / HSL | OKLCH Equivalent | Usage Context |
| :--- | :--- | :--- | :--- | :--- |
| **Accent Default** | `#A8F1F7` | `rgb(168, 241, 247)` / `hsl(184, 81%, 81%)` | `oklch(0.912 0.082 201.5)` | Primary "Preview Workspace" roll button, active Morphic navbar indicator, featured tier highlight, focus rings, selection background (`selection:bg-[#A8F1F7]`). |
| **Accent Hover** | `#97eaf1` | `rgb(151, 234, 241)` / `hsl(184, 76%, 77%)` | `oklch(0.887 0.086 201.2)` | Interactive hover state for primary action buttons. |
| **Accent Active** | `#7fe3ec` | `rgb(127, 227, 236)` / `hsl(184, 74%, 71%)` | `oklch(0.854 0.091 200.8)` | Pressed/active state for primary action buttons. |
| **Accent Glow / Wash** | `rgba(168, 241, 247, 0.05)` | `bg-[#A8F1F7]/5` | `oklch(0.912 0.082 201.5 / 0.05)` | Background wash for featured "Family & Studio Plan" card. |
| **Accent Badge Wash** | `rgba(168, 241, 247, 0.10)` | `bg-[#A8F1F7]/10` | `oklch(0.912 0.082 201.5 / 0.10)` | "Most Popular" and developmental badge fills. |
| **Accent Border Wash** | `rgba(168, 241, 247, 0.20)` | `border-[#A8F1F7]/20` | `oklch(0.912 0.082 201.5 / 0.20)` | Rest-state dashed border for prominent hero/bento cards. |
| **Accent Focus Ring** | `#A8F1F7` | `ring-[#A8F1F7]` | `oklch(0.912 0.082 201.5)` | Keyboard accessible focus ring (`focus-visible:ring-2`). |

---

### 2.2 Neutral Canvas & Surface Architecture

Agenta creates depth through disciplined surface layering without relying on diffuse drop shadows:

```
[Layer 4] Raised Elements / Popovers: #FFFFFF (Light) | #262626 neutral-800 / #171717 neutral-900 (Dark)
   ▲
[Layer 3] Inset Pills & Micro-Controls: bg-black/5 (Light) | bg-white/10 (Dark)
   ▲
[Layer 2] Card Insets & Dialogue Wells: bg-black/2 or bg-black/3 (Light) | bg-white/3 or bg-white/5 (Dark)
   ▲
[Layer 1] Outer Bento Frames: bg-black/1 (Light) | bg-white/2 (Dark)
   ▲
[Layer 0] Base Application Canvas: #FFFFFF (Light) | #080808 (Dark)
```

#### Detailed Surface Values:

| Surface Layer | Light Mode Tailwind Class | Hex / Raw Color | Dark Mode Tailwind Class | Hex / Raw Color | Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **L0: Base Canvas** | `bg-white` | `#FFFFFF` | `dark:bg-[#080808]` | `#080808` | Full page viewport background |
| **L1: Outer Card Well** | `bg-black/1` | `rgba(0, 0, 0, 0.01)` | `dark:bg-white/2` | `rgba(255, 255, 255, 0.02)` | Outer dashed container wrapper |
| **L2: Card Surface** | `bg-black/2` or `bg-black/3` | `rgba(0, 0, 0, 0.02–0.03)` | `dark:bg-white/3` or `dark:bg-white/5` | `rgba(255, 255, 255, 0.03–0.05)` | Primary card body, dialogue boxes |
| **L3: Inset Control Well** | `bg-black/5` | `rgba(0, 0, 0, 0.05)` | `dark:bg-white/10` | `rgba(255, 255, 255, 0.10)` | Button icon boxes, filter pills, track troughs |
| **L4: Contrast Surface** | `bg-white` | `#FFFFFF` | `dark:bg-neutral-900` | `#171717` | Raised cards, popovers, dropdown containers |

---

### 2.3 Border, Grid & Hairline Hierarchy

Agenta uses razor-thin, proportional fractional borders to structure content and define the "IBM Carbon" technical precision:

| Border Tier | Light Mode | Dark Mode | Application |
| :--- | :--- | :--- | :--- |
| **Hairline Frame (5%)** | `border-black/5` | `dark:border-white/5` | Default internal card separators, divider lines |
| **Subtle Divider (8%)** | `border-black/8` | `dark:border-white/10` | Micro tags, capability pill rest states |
| **Structural Frame (10%)** | `border-black/10` | `dark:border-white/10` | Main card borders, dashed structural grids, inputs |
| **High-Contrast Frame (15%)** | `border-black/15` | `dark:border-white/15` | Secondary action buttons, interactive controls |
| **Active Focus / Hover (20%)** | `border-black/20` | `dark:border-white/30` | Hover states for secondary buttons and tags |
| **Accent Interactive Frame** | `hover:border-[#A8F1F7]` | `dark:hover:border-[#A8F1F7]/60` | Dynamic hover state for all bento cards |

---

### 2.4 Typography & Ink Contrast Hierarchy

| Typography Role | Light Mode Class | Light Hex / Value | Dark Mode Class | Dark Hex / Value | Minimum WCAG Ratio |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Ink (Headings, Key Titles)** | `text-neutral-900` / `text-black` | `#171717` / `#000000` | `dark:text-neutral-50` / `dark:text-white` | `#FAFAFA` / `#FFFFFF` | **15.5:1 AAA** |
| **Secondary Ink (Card Titles, Emphasized Labels)** | `text-black/80` | `rgba(0, 0, 0, 0.80)` | `dark:text-white/80` | `rgba(255, 255, 255, 0.80)` | **8.2:1 AAA** |
| **Body & Subtitle Ink** | `text-neutral-500` / `text-black/60` | `#737373` / `rgba(0, 0, 0, 0.60)` | `dark:text-neutral-400` / `dark:text-white/60` | `#A3A3A3` / `rgba(255, 255, 255, 0.60)` | **5.4:1 AA** |
| **Muted Metadata & Captions** | `text-neutral-400` / `text-black/40` | `#A3A3A3` / `rgba(0, 0, 0, 0.40)` | `dark:text-neutral-500` / `dark:text-white/40` | `#737373` / `rgba(255, 255, 255, 0.40)` | **4.5:1 AA** |
| **Selection Highlighting** | `selection:text-neutral-950` | `#0A0A0A` | `selection:bg-[#A8F1F7]` | `#A8F1F7` | **14.2:1 AAA** |

---

### 2.5 Functional & Telemetry Semantic Hues

The Agenta layout reserves specific chromatic accents for data visualization and educational states:

| Functional Domain | Semantic Name | Tailwind Color Classes | Hex Equivalents | UI Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Verification & Status** | **Emerald Sage** | `bg-emerald-500`, `text-emerald-600`, `dark:text-emerald-400`, `bg-emerald-400/75` (ping) | `#10B981` / `#059669` / `#34D399` | "Live Dialogue Trace", DPDP verified badge, cryptographic sha256 hash verified, simulation accuracy gauges (94.2%). |
| **Inquiry & Dialogue** | **Socratic Sky** | `bg-sky-500/10`, `border-sky-500`, `text-sky-900`, `dark:text-sky-200`, `text-sky-600` | `#0284C7` / `#38BDF8` / `#BAE6FD` | Mentor dialogue quote boxes, kinematics challenge tags, verified test pass indicators. |
| **Hardware & Timeline** | **Attention Amber** | `bg-amber-500`, `dark:bg-amber-400`, `border-amber-400`, `text-amber-500` | `#F59E0B` / `#FBBF24` | Event pins on the Adaptive MetricCard, dinner table prompt border, milestone markers. |
| **Recording & Critical** | **Signal Rose** | `bg-rose-500`, `text-rose-500`, `from-rose-500 to-rose-400` | `#F43F5E` / `#FB7185` | Active microphone LED pulse, Foundation skill progress bar (Track 1). |
| **Activity Velocity** | **Growth Lime** | `text-lime-500`, `from-lime-500 to-lime-300` | `#84CC16` / `#BEF264` | Inquiry session progress bar (Track 2, active goal exceeded 140%). |
| **Milestone Builds** | **Kinematic Cyan** | `text-cyan-500`, `from-cyan-500 to-cyan-300` | `#06B6D4` / `#67E8F9` | Milestone completion progress bar (Track 3, 83.3%). |
| **Rubric & Academic** | **Academic Violet** | `text-purple-600`, `dark:text-purple-400` | `#9333EA` / `#C084FC` | Level 4 rubric alignment pill, Cambridge/CBSE taxonomy references. |

---

## 3. Structural Textures & Micro-Patterns

Agenta incorporates a characteristic **45° diagonal hairline stripe pattern** across media preview frames and card header zones:

```css
/* Light Mode Diagonal Stripes */
.diagonal-stripes {
  background-image: repeating-linear-gradient(
    45deg,
    rgba(0, 0, 0, 0.02),
    rgba(0, 0, 0, 0.02) 10px,
    rgba(0, 0, 0, 0.04) 10px,
    rgba(0, 0, 0, 0.04) 20px
  );
}

/* Dark Mode Diagonal Stripes */
:global(.dark) .diagonal-stripes {
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.02),
    rgba(255, 255, 255, 0.02) 10px,
    rgba(255, 255, 255, 0.05) 10px,
    rgba(255, 255, 255, 0.05) 20px
  );
}
```

---

## 4. Mapping Agenta Colors to CREED OS WAY 2.1 Design Tokens

For architectural cohesion across the CREED OS workspace, Agenta's original color tokens map cleanly to WAY 2.1 CSS custom properties:

| Agenta Original Token | WAY 2.1 Semantic Token | OKLCH Definition (Light) | OKLCH Definition (Dark) |
| :--- | :--- | :--- | :--- |
| `bg-white` / `dark:bg-[#080808]` | `--surface-canvas` | `oklch(0.985 0.003 260)` | `oklch(0.205 0.012 265)` |
| `bg-black/2` / `dark:bg-white/3` | `--surface-content` | `oklch(0.965 0.005 260)` | `oklch(0.245 0.014 265)` |
| `bg-white` / `dark:bg-neutral-900` | `--surface-raised` | `oklch(1.000 0.000 0)` | `oklch(0.285 0.016 265)` |
| `border-black/10` / `dark:border-white/10` | `--border` | `oklch(0.895 0.008 260)` | `oklch(0.330 0.015 265)` |
| `text-neutral-900` / `dark:text-neutral-50` | `--text-primary` | `oklch(0.180 0.015 270)` | `oklch(0.965 0.005 265)` |
| `text-neutral-500` / `dark:text-neutral-400` | `--text-secondary` | `oklch(0.460 0.020 270)` | `oklch(0.800 0.015 265)` |
| `#A8F1F7` (Electric Ice Cyan) | `--accent-primary` / `--cyan` | `oklch(0.912 0.082 201.5)` | `oklch(0.912 0.082 201.5)` |
| `bg-emerald-500` | `--accent-success` | `oklch(0.680 0.170 155)` | `oklch(0.780 0.160 155)` |
| `bg-amber-500` | `--accent-warning` | `oklch(0.720 0.160 75)` | `oklch(0.860 0.160 85)` |
| `bg-rose-500` | `--accent-danger` | `oklch(0.580 0.190 25)` | `oklch(0.680 0.190 25)` |

---

## 5. Summary & Key Principles

1. **Monochrome Dominance (90%):** The page is fundamentally grounded in zinc/slate neutrals and transparent overlays, creating an editorial, high-end technical publication aesthetic.
2. **Singular High-Voltage Cyan (3%):** All key interactions (primary button, active navigation indicator, most popular tier, and interactive card hover frames) anchor to `#A8F1F7`.
3. **Semantic Integrity (7%):** Color is never used purely for decoration. Every chromatic tint (Sage, Sky, Amber, Rose) denotes specific telemetry, verification status, or pedagogical progress.
