# Core_OS — WAY Design System Specification

**Document Version:** 1.0.0  
**Design Philosophy:** Nordic Lagom × Sci-Fi Educational Instrument  
**Audience:** UI/UX Designers, Frontend Engineers, Accessibility Specialists  

---

## 1. Visual Philosophy: Nordic Lagom × Sci-Fi

Core_OS is an instrument of intellectual self-discovery, not a gamified consumer casino.
- **Lagom Ethos ("Just the right amount"):** Clean, uncluttered, focused interfaces. Zero sensory overload. No flashing neon banners, no frantic red countdown timers, and no celebratory confetti bursts during active assessment.
- **Sci-Fi Instrument Quality:** Sharp, precise visual cues, quiet telemetry datums, hairline borders, monospace statistical readouts, and glowing cyan/aurora accents against slate/mineral backgrounds.

---

## 2. OKLCH Semantic Color Tokens

Tokens are declared using the **OKLCH color space** for perceptual uniformity, superior dark-mode contrast, and clean mathematical transformations.

```css
:root {
  /* Surface Tokens (Light: Mineral White) */
  --surface-canvas: oklch(0.985 0.005 240);
  --surface-raised: oklch(1.000 0.000 0);
  --surface-overlay: oklch(0.960 0.008 240);
  --surface-sunken: oklch(0.940 0.010 240);

  /* Border Tokens */
  --border-subtle: oklch(0.900 0.008 240);
  --border-strong: oklch(0.800 0.015 240);
  --border-hairline: rgba(0, 0, 0, 0.08);

  /* Typography Tokens */
  --text-primary: oklch(0.180 0.020 250);
  --text-secondary: oklch(0.420 0.025 250);
  --text-muted: oklch(0.580 0.020 250);
  --text-inverse: oklch(0.990 0.002 240);

  /* Brand & Accents: Precision Cyan & Aurora */
  --accent-cyan: oklch(0.680 0.160 215);
  --accent-cyan-subtle: oklch(0.940 0.040 215);
  --accent-aurora: oklch(0.650 0.180 290);
  --accent-emerald: oklch(0.680 0.150 155);
  --accent-amber: oklch(0.720 0.160 75);
  --accent-crimson: oklch(0.600 0.190 25);
}

.dark {
  /* Surface Tokens (Dark: Deep Slate / Deep Space) */
  --surface-canvas: oklch(0.130 0.018 250);     /* #0c1017 */
  --surface-raised: oklch(0.180 0.020 250);     /* #141a24 */
  --surface-overlay: oklch(0.220 0.025 250);    /* #1c2432 */
  --surface-sunken: oklch(0.100 0.015 250);

  /* Border Tokens */
  --border-subtle: oklch(0.240 0.020 250);
  --border-strong: oklch(0.320 0.030 250);
  --border-hairline: rgba(255, 255, 255, 0.08);

  /* Typography Tokens */
  --text-primary: oklch(0.960 0.005 240);
  --text-secondary: oklch(0.750 0.020 240);
  --text-muted: oklch(0.520 0.020 250);
  --text-inverse: oklch(0.120 0.015 250);

  /* Brand Accents */
  --accent-cyan: oklch(0.760 0.160 215);
  --accent-cyan-subtle: oklch(0.220 0.050 215);
  --accent-aurora: oklch(0.720 0.180 290);
}
```

---

## 3. Typography Scale

- **Primary Sans:** Inter / Geist (`ui-sans-serif, system-ui, sans-serif`) for clarity, balanced kerning, and legibility across low-DPI displays.
- **Data & Telemetry Mono:** JetBrains Mono (`ui-monospace, monospace`) for psychometric ability values ($\theta = +1.42$), question identifiers (`ITEM-STEM-042`), and standard errors.

```css
.font-sans { font-family: var(--font-sans); }
.font-mono { font-family: var(--font-mono); }
```

---

## 4. The Lagom Motion Contract

Animation must never distract, induce anxiety, or delay information display:
- **Duration:** Standard UI transitions operate strictly between **180ms and 300ms**.
- **Easing:** Cubic-bezier `cubic-bezier(0.16, 1, 0.3, 1)` (out-expo style for crisp, responsive settling).
- **Test-Taking Silence:** During active assessment questions, animated decorative elements are disabled. Progress bars transition smoothly without flashing or bouncing.
- **Accessibility:** Mandatory support for `@media (prefers-reduced-motion: reduce)`.

---

## 5. Proprietary Education Component Suite

1. **`AssessmentShell`:** Distraction-free container, displaying clean question numbering, responsive option selectors, and immediate keyboard accessibility (Keys `1`–`4` or `A`–`D`).
2. **`AdaptiveProgress`:** Quietly indicates test progression without stressful percentage countdowns or ticking clocks.
3. **`CompetencyRadar`:** Multi-axis visualization plotting a learner's current $\theta$ ability across Quantitative, Spatial, Logic, Scientific, and Computational domains with confidence intervals.
4. **`EvidenceCard`:** Displays the source, timestamp, confidence badge, and raw observation snippet behind any asserted skill.
5. **`MismatchAlert`:** A constructive card presenting foundation gaps as opportunities, rendering an 8-week developmental bridge and try-before-you-choose trials.
6. **`ParentAlignmentPanel`:** Side-by-side comparison of parental expectations and student evidence, highlighting areas of convergence and joint exploration missions.
7. **`ClassHeatmap`:** Teacher dashboard table grouping learners by conceptual gaps with one-click assignment of differentiated group tasks.
