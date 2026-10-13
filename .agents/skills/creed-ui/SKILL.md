---
name: creed-ui
description: >
  Autonomous UI/UX, Design System & Accessibility Governance engine for CREED OS.
  Enforces WAY 2.1 Quiet Editorial Intelligence, 0/4/8 Architectural Radius System,
  semantic OKLCH tokens, anti-AI-slop rules, role-aware psychometric leak protection,
  and DPDP child data safety.
argument-hint: "[audit|check|persona]"
license: MIT
---

# CREED OS — WAY 2.1 UI/UX Governance & Design System Skill (`/creed-ui`)

The governing design philosophy is:
> **Calm Intelligence — complexity is hidden until it becomes useful.**
> **Signal → Context → Action → Evidence → Disclosure**

---

## 1. Architectural Radius System (0 / 4 / 8px)

Radii correspond strictly to surface functionality. Never introduce bubbly consumer curves or floating pills.

| Tier | Radius | Tailwind Class | Semantic Token | Permitted Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| **Structural** | `0px` | `rounded-none` | `--radius-structural: 0px` | Data tables, assessment question frames, item studio grids, console views, technical metadata. |
| **Control** | `4px` | `rounded-sm` | `--radius-control: 4px` | Buttons, inputs, standard cards, dialogs, drawers, popovers, navigation items, chips. |
| **Expressive** | `8px` | `rounded-md` | `--radius-expressive: 8px` | Hero media, mixed-media artwork frames (`IllustrationFrame`), editorial pathway features (`EditorialFeature`). |

### Strictly Forbidden Radii
- `rounded-lg` (12px), `rounded-xl` (16px), `rounded-2xl` (24px), `rounded-3xl` (32px).
- Pill action buttons (`rounded-full` on text buttons or input fields).
- *Exemption:* `rounded-full` is permitted solely for circular avatar chips, progress indicator rings, or mechanical simulation gears.

---

## 2. Spacing Rhythm & Motion Contract

- **Spacing Base Unit (4px):**
  - Micro: `4px` (`p-1`, `gap-1`)
  - Core: `8px`, `16px`, `24px`, `32px` (`p-2`, `p-4`, `p-6`, `p-8`)
  - Major: `40px`, `48px`, `64px`, `80px`, `96px` (`p-10`, `p-12`, `p-16`, `p-20`, `p-24`)
  - *Forbidden:* Arbitrary bracketed pixel spacing (`p-[13px]`, `gap-[19px]`) or non-rhythmic values (`p-2.5`, `p-7.5`).
- **Lagom Motion Contract:**
  - Micro: `140ms` (`--duration-micro`)
  - Standard: `200ms` (`--duration-standard`)
  - Emphasis: `280ms` (`--duration-emphasis`)
  - Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (`--ease-lagom`)
  - *Forbidden:* Animations exceeding 280ms (`duration-500`, `duration-1000`). Decorative animations must be silenced during active CAT assessments.

---

## 3. Color Governance & Semantic Tokens

- **Strict Token-Only Rule:** All colors must reference semantic CSS custom properties in OKLCH:
  - Surface Layering: `--surface-canvas` (L0), `--surface-content` (L1), `--surface-raised` (L2), `--surface-overlay` (L3), `--surface-modal` (L4).
  - Ink Hierarchy: `--text-primary` (graphite white/dark ink), `--text-secondary`, `--text-muted`.
  - Functional Accents: `--accent-primary` (Performance Mint <2% at rest), `--accent-indigo` (Restrained Iris for AI / Copilot), `--accent-warning`, `--accent-danger`.
- *Forbidden:* Ad-hoc hex literals in Tailwind classes (`bg-[#03080E]`, `text-[#38bdf8]`), neon glow loops, cyber borders, animated rainbow gradients.

---

## 4. Anti-AI-Slop Governance & The Card-Soup Test

### The Card-Soup Test
Before adding any card or border container, ask:
1. Does it represent a real conceptual boundary?
2. Does it group information that belongs together?
3. Does it communicate hierarchy?
*If no:* **Remove the container.** Prefer whitespace, clean typography, dividers, and progressive disclosure over nested cards (`Card` → `Card` → `Card`).

### Content Density Rule
Every section contains:
1. **1 title**
2. **≤ 1 supporting sentence**
3. **1 primary action**
*Secondary details belong in drawers, dialogs, or progressive disclosures (`InspectorPanel`, `EvidenceDisclosure`).*

### Slop Anti-Patterns to Reject
- Meaningless decorative badges on every metric.
- Giant raw numbers without context or provenance.
- Multiple competing primary CTAs on a single viewport.
- Unnecessary glassmorphism / heavy backdrop blur.
- AI sparkle icons masquerading as features without tangible function.

---

## 5. Persona-Specific UX & Vocabulary Contracts

| Persona | Tone & Objective | Information Density | Vocabulary Constraints |
| :--- | :--- | :--- | :--- |
| **Student** | Supportive, low-anxiety, exploratory. Orient in ≤ 5s. | Focused, calm, distraction-free. | **Forbidden:** $\theta$, $SE$, 3PL, Fisher Info, percentage career fitness ("74% fit"). Use qualitative developmental tiers (*"Strong foundation"*, *"Superpower"*). |
| **Parent** | Reassurance, evidence, explainability. Grasp in ≤ 10s. | Editorial, clear milestones. | **Forbidden:** $\theta$, standard error, quadrature, raw psychometric algorithms. Use plain language developmental milestones & at-home actions. |
| **Teacher** | High scanability, intervention triage. Triage in ≤ 10s. | High-density data tables, filters. | Scaffolding needs, group intervention clusters, observation logging. |
| **Counselor** | Case management, longitudinal evidence. Review in ≤ 2 clicks. | Structured caseload view. | Pathway mismatch analysis, evidence consistency, exploratory simulations. |
| **Admin** | Operational oversight, statutory DPDP compliance. | High-density tables, audit logs. | Consent state machine, exportable immutable logs. |
| **Studio** | Technical precision, psychometric calibration. | High-density engineering workbench. | Raw $a, b, c$ parameters, ICC curves, QTI 3.0 export permitted. |

---

## 6. Deterministic Assessment & Child Safety Boundary

1. **Deterministic Scoring:** Psychometric ability estimates ($\theta$) are strictly computed by deterministic algorithms (3PL IRT Gauss-Hermite EAP / CAT / BKT) in `@core-os/assessment`. LLMs explain; deterministic algorithms score; humans decide.
2. **DPDP Compliance & Minor Safety:** Verified parental consent state machine (`DRAFT` → `PARENT_INVITED` → `PARENT_CONSENTED` → `ACTIVE`) gates all minor data (Ages 10–16 / Classes 5–10).
3. **Production Security:** Development cookies (`creed_dev_session`, `creed_dev_role`) and dev switchers are strictly loopback/development only (`import.meta.env.DEV`). Never trust client-side role claims in production endpoints.

---

## 7. Quality & Verification Commands

All changes must be validated exclusively with `pnpm`:

```bash
# Type check all packages
pnpm run check

# Execute unit and domain tests
pnpm run test

# Validate WAY 2.1 design system invariants & heuristics
pnpm run design:audit

# Validate CSS stylelint
pnpm run lint:css

# Verify Storybook build
pnpm run build-storybook

# Verify production build
pnpm run build
```
