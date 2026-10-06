# CREED OS — WAY 2.0 Design System Specification

**Document Version:** 2.0.0  
**Design Philosophy:** Calm Intelligence (Nordic Lagom × IBM Carbon × Apple HIG)  
**Core Doctrine:** *"Complexity is hidden until it becomes useful. Calm enough to understand, intelligent enough to adapt, human enough to belong to."*  
**Audience:** UI/UX Designers, Frontend Engineers, Antigravity AI Agents, Accessibility Specialists  

---

## 1. Visual & Interaction Philosophy

CREED OS is an instrument of intellectual self-discovery and longitudinal learner navigation, not a gamified consumer casino or a sterile quantitative analytics dashboard.

- **Calmness (Nordic Lagom):** Warm mineral whites, calm ivories, deep slate night modes, quiet tactile surfaces. Zero cyber-neon drop shadows, no red countdown anxiety, no flashing banners.
- **Structural Discipline (IBM Carbon 2× Grid):** Strict 4px micro / 8px core structural rhythm, tokenized L0–L5 layering, high-density accessible data tables, progressive disclosure.
- **Tactile Hierarchy (Apple HIG):** Semantic material hierarchy, purposeful motion curves (140ms–280ms), predictable touch targets (min 44px), and clear focus rings.
- **Form Utility (Untitled UI):** Clean inputs, structured controls, accessible state models.
- **Editorial Warmth & Craft (Japandi Editorial):** Mixed-media illustrations housed in architectural passe-partout frames providing storytelling context without contaminating data evidence.

---

## 2. Architectural Radius System

WAY 2.0 replaces the former rigid zero-radius ideology with an **Architectural Radius System** that preserves precision while eliminating harshness:

| Tier | Radius Value | Tailwind Class | Designated Use Cases |
| :--- | :--- | :--- | :--- |
| **Structural / Technical** | `0px` | `rounded-none` | Data tables, assessment question frames, item studio consoles, technical telemetry grids, code blocks. |
| **Control / Surface** | `4px` | `rounded-sm` | Buttons, form inputs, tiles, content cards, dialogs, sheet panels, tabs, badges, navigation elements. |
| **Expressive Media** | `8px` | `rounded-md` | Hero media, mixed-media illustration frames, immersive student experience containers. |

> [!CAUTION]
> **Prohibited Curves:** 12px, 16px, 20px, and 24px bubbly consumer cards (`rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, pill buttons) are strictly forbidden across CREED OS.

---

## 3. Calibrated Surface Layering (L0 – L5)

To prevent flat "white-out" canvas fatigue, interfaces use a calibrated 5-tier elevation model:

| Layer | Token | Light Mode Value | Dark Mode Value | Function |
| :--- | :--- | :--- | :--- | :--- |
| **L0 Canvas** | `--surface-canvas` | `oklch(0.978 0.006 240)` | `oklch(0.145 0.018 250)` | Base application background (Warm mineral white / Deep slate) |
| **L1 Content** | `--surface-content` | `oklch(0.965 0.008 240)` | `oklch(0.180 0.020 250)` | Secondary wells, section groupings, subtle inset panels |
| **L2 Raised** | `--surface-raised` | `oklch(1.000 0.000 0)` | `oklch(0.210 0.022 250)` | Interactive cards, focus tiles, active content surfaces |
| **L3 Overlay** | `--surface-overlay` | `oklch(0.985 0.004 240)` | `oklch(0.250 0.025 250)` | Popovers, dropdown menus, flyout toolbars |
| **L4 Modal** | `--surface-modal` | `oklch(1.000 0.000 0)` | `oklch(0.220 0.022 250)` | Focus dialogs, drawers, full-screen inspector sheets |
| **L5 Transient**| `--surface-transient`| `oklch(0.200 0.020 250)` | `oklch(0.960 0.005 240)` | High-contrast toasts, keyboard shortcuts, snackbars |

---

## 4. Spacing Rhythm (4px Micro + 8px Structural)

Spacing adheres to a strict geometric progression:

- **Micro Spacing (`4px`):** `--space-1` (`p-1`, `gap-1`) for tags, badges, tight indicators.
- **Core Structural Spacing (`8px` base):**
  - `8px`: `--space-2` (`p-2`, `gap-2`)
  - `12px`: `--space-3` (`p-3`, `gap-3` - compact rows)
  - `16px`: `--space-4` (`p-4`, `gap-4` - standard card padding)
  - `24px`: `--space-6` (`p-6`, `gap-6` - section spacing)
  - `32px`: `--space-8` (`p-8`, `gap-8` - major container gap)
- **Major Structural Spacing:**
  - `40px`: `--space-10` (`p-10`)
  - `48px`: `--space-12` (`p-12`)
  - `64px`: `--space-16` (`p-16` - section landmark)
  - `80px`: `--space-20` (`p-20` - hero padding)
  - `96px`: `--space-24` (`p-24` - page boundary)

> [!IMPORTANT]
> Arbitrary spacing (`p-2.5` = 10px, `p-[13px]`, `p-[17px]`, `gap-[19px]`) is strictly rejected by design governance and CI.

---

## 5. Action-First UX & "Next Action" Primacy

Rather than presenting an unprioritized BI dashboard of metric cards, every experience route is built around **Action-First UX**:

```text
1. Context        → Where am I, and who am I helping?
2. Current State  → Calm, qualitative developmental summary.
3. Meaning        → What does this mean in plain language?
4. NEXT ACTION    → [DOMINANT VISUAL SIGNAL: Start 20-min mission / Assign group activity]
5. Evidence       → Verified demonstrations backing this recommendation.
6. Depth (Opt-in) → Progressive disclosure for detailed historical audit.
```

### Cognitive Job by Persona

| Route | Persona | Cognitive Job | Primary Next Action |
| :--- | :--- | :--- | :--- |
| `/student` | Student (10–16) | *"Orient me and show what to do next."* | **Start Today's Mission** (20-min practice) |
| `/student/assessment` | Student | *"Let me concentrate in peace."* | **Select Answer & Continue** |
| `/student/mentor` | Student | *"Help me think and explore reason."* | **Interactive Socratic Dialogue** |
| `/student/pathways` | Student | *"Help me explore possibilities without labeling."* | **Try Hands-on Mission** |
| `/parent` | Parent / Guardian | *"Reassure me and show how I can help."* | **Try At-Home Mini Challenge** |
| `/teacher` | Teacher | *"Show what needs attention today and offer interventions."* | **Assign Differentiated Small Group** |
| `/counselor` | Counselor | *"Case-manage my caseload with actionable evidence."* | **Schedule Advising Check-in** |
| `/admin` | Administrator | *"Govern institution with auditable density."* | **Review Compliance & System Health** |
| `/author` | Psychometrician | *"Calibrate items with mathematical rigor."* | **Calibrate 3PL Parameters & Bank** |

---

## 6. Role-Aware Presentation Vocabulary

The underlying psychometric and evidence graph models are identical across all routes, but the presentation vocabulary strictly adapts to the cognitive audience:

| Concept | Student View | Parent View | Educator / Counselor | Admin / Item Studio |
| :--- | :--- | :--- | :--- | :--- |
| **Latent Ability $\theta$** | *"Superpower" / "Solid Strength"* | *"Advanced" / "Strong Foundation"* | *"Stage 4 Demonstrations"* | $\theta = +1.42 \pm 0.28$ |
| **Uncertainty / SE** | *"Getting clearer with every mission"* | *"Moderate Confidence (3 verified checks)"* | *"Standard Error $SE = 0.31$"* | $SE(\theta) = 0.31$ |
| **Difficulty $b$** | *"Challenge level"* | *"Age-appropriate complexity"* | *"Item Difficulty"* | $b = +0.85$ |
| **Discrimination $a$** | *[Hidden]* | *[Hidden]* | *"Diagnostic sharpness"* | $a = 1.45$ |
| **Career Alignment** | *"Fields where your strengths shine"* | *"Strong foundational alignment"* | *"Competency match: 4 / 6 met"* | Alignment coefficient |

> [!WARNING]
> **No False Precision:** Never display percentage career readiness (e.g. "74% roboticist fit"). Real humans are developmental, not deterministic lottery tickets.

---

## 7. Motion & Accessibility

- **Durations:**
  - Micro interactions (hover, toggle, focus): `140ms`
  - Standard component transitions (tabs, accordion, drawers): `200ms`
  - Emphasis / full layout transitions: `280ms`
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (Lagom crisp settling).
- **Test-Taking Silence:** Decorative animations, glowing indicators, and pulsing loops are disabled during active assessments.
- **Accessibility:** Mandatory support for `@media (prefers-reduced-motion: reduce)`, WCAG 2.2 AA contrast ratios, and visible 2px focus outlines (`--border-focus`).
