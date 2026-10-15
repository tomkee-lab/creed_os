# WAY 2.1 Color Tokens & Semantics

## 1. Principles
- **No Arbitrary Hex:** Never hardcode hex colors (`#0891b2`, `#03080e`) into component classes.
- **Pure OKLCH Semantic Tokens:** Colors are defined exclusively as CSS custom properties with perceptual lightness and chroma uniformity.
- **Color Ratio Formula:** 70% Neutral canvas/surface, 15% Content well/borders, 8% Semantic brand accents, 5% State indicators, 2% Expressive focus.

---

## 2. Token Palette

### Light Mode (Linear / Raycast Precision Palette)
- **`--surface-canvas`:** `oklch(0.985 0.003 260)` (L0: Crisp Zinc Canvas `#FAFAFB` base canvas)
- **`--surface-content`:** `oklch(0.965 0.005 260)` (L1: Content Well `#F4F5F7`)
- **`--surface-raised`:** `oklch(1.000 0.000 0)` (L2: Pure White `#FFFFFF` Raised Card Pop)
- **`--surface-overlay`:** `oklch(0.995 0.002 260)` (L3: Elevated Popovers & Dropdowns `#FCFCFD`)
- **`--surface-modal`:** `oklch(1.000 0.000 0)` (L4: Focus Dialogs & Drawers `#FFFFFF`)
- **`--surface-sunken`:** `oklch(0.950 0.006 260)` (Inset Containers & Form Inputs `#EEF0F3`)
- **`--border-subtle`:** `oklch(0.925 0.005 260)` (Subtle Hairline `#EAECEF`)
- **`--border`:** `oklch(0.895 0.008 260)` (Clean Divider `#E2E4E9`)
- **`--border-strong`:** `oklch(0.800 0.010 260)` (Structural Frame Borders `#CBD0D8`)
- **`--text-primary`:** `oklch(0.180 0.015 270)` (Deep Slate Ink `#0F1117`, 15.5:1 AAA contrast)
- **`--text-secondary`:** `oklch(0.460 0.020 270)` (Slate Grey `#4F5464`, 5.4:1 AAA contrast)
- **`--text-muted`:** `oklch(0.580 0.015 270)` (Steel Muted Metadata `#73798C`, 4.5:1 AA contrast)

### Dark Mode (Slate Dimmed & Luminous Iris)
- **`--surface-canvas`:** `oklch(0.205 0.012 265)` (L0: Slate Dimmed Canvas `#1C1F2B`)
- **`--surface-content`:** `oklch(0.245 0.014 265)` (L1: Soft Slate Panel `#242837`)
- **`--surface-raised`:** `oklch(0.285 0.016 265)` (L2: Elevated Dark Cards `#2E3345`)
- **`--surface-overlay`:** `oklch(0.325 0.018 265)` (L3: Popovers `#383E53`)
- **`--surface-modal`:** `oklch(0.285 0.016 265)` (L4: Focus Dialogs & Drawers `#2E3345`)
- **`--surface-sunken`:** `oklch(0.170 0.010 265)` (Inset Wells `#161922`)
- **`--border-subtle`:** `oklch(0.285 0.012 265)` (Subtle Divider `#2E3345`)
- **`--border`:** `oklch(0.330 0.015 265)` (Hairline Divider `#393F55`)
- **`--border-strong`:** `oklch(0.420 0.018 265)` (Structural Borders `#4E5672`)
- **`--text-primary`:** `oklch(0.965 0.005 265)` (Primary Text — Crisp Chalk `#F2F4F8`, 11.5:1 AAA)
- **`--text-secondary`:** `oklch(0.800 0.015 265)` (Secondary Text — Slate White `#B9C1D2`, 7.5:1 AAA)
- **`--text-muted`:** `oklch(0.660 0.018 265)` (Tertiary Text — Soft Slate `#8B95AA`, 4.8:1 AA)

---

## 3. Semantic Accents
- **Primary Hero Iris (`--accent-primary`, `--mint`, `--primary`):** Electric Indigo (`#5B50E6` / `oklch(0.520 0.220 275)` in light, `#8882F9` / `oklch(0.720 0.180 275)` in dark). Main interactive CTA buttons, focus rings, progress indicators.
- **AI Iris (`--accent-indigo`, `--violet`):** Socratic Guide, AI presence indicator, field exploration (`oklch(0.520 0.220 275)` in light, `oklch(0.720 0.180 275)` in dark).
- **Growth Sage (`--accent-success`):** Demonstrated capabilities, verified consent, positive evidence strength (`oklch(0.520 0.220 275)` / `oklch(0.720 0.180 275)`).
- **Attention Ochre (`--accent-warning`):** Growth focus areas, pending notices (`oklch(0.720 0.160 75)` in light, `oklch(0.860 0.160 85)` in dark).
- **Critical Coral (`--accent-danger`):** Errors, DPDP consent revocations, safety blocks (`oklch(0.580 0.190 25)` in light, `oklch(0.680 0.190 25)` in dark).

---

## 4. Strict AI Color Rule
AI styling identifies AI presence; it is never decorative.
- **FORBIDDEN:** Neon glow borders, cyberpunk drop shadows, animated purple/cyan gradients, continuous sparkle animations.
- **MANDATORY:** Quiet Iris tag, contextual explainability trigger, child safety verification indicator.
