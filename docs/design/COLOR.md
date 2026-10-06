# WAY 2.1 Color Tokens & Semantics

## 1. Principles
- **No Arbitrary Hex:** Never hardcode hex colors (`#0891b2`, `#03080e`) into component classes.
- **Pure OKLCH Semantic Tokens:** Colors are defined exclusively as CSS custom properties with perceptual lightness and chroma uniformity.
- **Color Ratio Formula:** 70% Neutral canvas/surface, 15% Content well/borders, 8% Semantic brand accents, 5% State indicators, 2% Expressive focus.

---

## 2. Token Palette

### Light Mode (Warm Mineral Canvas)
- **`--surface-canvas`:** `oklch(0.978 0.006 240)` (L0: Warm Mineral White base)
- **`--surface-content`:** `oklch(0.965 0.008 240)` (L1: Soft Content Well)
- **`--surface-raised`:** `oklch(1.000 0.000 0)` (L2: Pure White Raised Focus Card)
- **`--surface-overlay`:** `oklch(0.985 0.004 240)` (L3: Popovers & Dropdowns)
- **`--surface-modal`:** `oklch(1.000 0.000 0)` (L4: Focus Dialogs & Drawers)
- **`--surface-sunken`:** `oklch(0.950 0.010 240)` (Inset Containers & Form Inputs)

### Dark Mode (Deep Slate Studio / Nordic Night)
- **`--surface-canvas`:** `oklch(0.145 0.018 250)` (L0: Deep Slate Base)
- **`--surface-content`:** `oklch(0.180 0.020 250)` (L1: Soft Slate Well)
- **`--surface-raised`:** `oklch(0.210 0.022 250)` (L2: Raised Tile)
- **`--surface-overlay`:** `oklch(0.250 0.025 250)` (L3: Popovers)
- **`--surface-modal`:** `oklch(0.220 0.022 250)` (L4: Drawers & Dialogs)
- **`--surface-sunken`:** `oklch(0.120 0.015 250)` (Inset Wells)

---

## 3. Semantic Accents
- **Primary Teal (`--accent-primary`):** Main interactive controls, progress indicators, dominant action buttons (`oklch(0.550 0.140 215)`).
- **AI Iris (`--accent-indigo`):** Socratic Guide, AI presence indicator, field exploration (`oklch(0.560 0.150 280)`).
- **Growth Sage (`--accent-success`):** Demonstrated capabilities, verified consent, positive evidence strength (`oklch(0.600 0.140 150)`).
- **Attention Ochre (`--accent-warning`):** Growth focus areas, pending notices, scaffold priority (`oklch(0.680 0.150 75)`).
- **Critical Vermilion (`--accent-danger`):** Errors, DPDP consent revocations, safety blocks only (`oklch(0.580 0.180 25)`).

---

## 4. Strict AI Color Rule
AI styling identifies AI presence; it is never decorative.
- **FORBIDDEN:** Neon glow borders, cyberpunk drop shadows, animated purple/cyan gradients, continuous sparkle animations.
- **MANDATORY:** Quiet Iris tag, contextual explainability trigger, child safety verification indicator.
