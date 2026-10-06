# WAY 2.1 — Quiet Editorial Intelligence
## CREED OS Master Design System Specification

### 1. Vision & Identity
**WAY 2.1** is the proprietary design system of **CREED OS**. It expresses **Quiet Editorial Intelligence**:
a software instrument that feels like a calm, authored publication and an extraordinarily precise scientific tool—not a generic SaaS dashboard, gamified quiz app, or cyber-neon AI wrapper.

### 2. Design Influences (Synthesized into One System)
WAY is the **only** production design system in code. It draws from six complementary design traditions:
1. **Nordic Lagom:** Calm, warm mineral surfaces, intentional whitespace, restrained color palette, low visual noise, tactile simplicity.
2. **IBM Carbon / Carbon Next:** Clear structural hierarchy, progressive disclosure, density modes, structured grids, operational utility, complexity revealed only when useful.
3. **Apple Human Interface Guidelines (HIG):** Clarity, hierarchy, intentional motion, semantic materials, responsive contextual behaviors.
4. **Untitled UI Principles:** Composable form controls, predictable layout grids, practical SaaS information hierarchy.
5. **Japandi & Editorial Layout:** Intentional asymmetry (60/40, 70/30), strong scale relationships, human warmth, editorial typography.
6. **Carbon for AI:** Transparent AI identity, contextual explainability without neon/glow decorations, accessible evidence provenance.

---

### 3. The Core UX Law: Three Information Levels

To eliminate "information equivalence" and "card soup," every screen adheres strictly to:

```
Level 1 — SIGNAL:    What the user must notice immediately (Primary action, key status).
Level 2 — CONTEXT:   Why it matters (1 short sentence max).
Level 3 — EVIDENCE:  Proof and provenance (Disclosed upon interaction / click).
```

**Content Density Rule:**
Every standard section gets:
- **1 Title**
- **1 Short supporting sentence maximum**
- **1 Primary action**
- All supporting evidence, histories, and parameters belong in **Progressive Disclosures**, **Drawers**, or **Dedicated Detail Views**.

---

### 4. Architectural Radius Matrix
* **0px (`rounded-none`):** Structural and technical surfaces (data tables, question frames, Item Studio grids, console toolbars).
* **4px (`rounded-sm`):** Controls and content surfaces (buttons, inputs, standard panels, dialogs, tiles, badges).
* **8px (`rounded-md`):** Expressive hero media and mixed-media fine art frames.
* **FORBIDDEN:** 12px+ bubbly consumer curves (`rounded-lg`, `rounded-xl`, `rounded-2xl`, pill buttons).

---

### 5. True 8pt Grid & Spacing Scale
* **Micro Spacing:** `4px` (`p-1`, `gap-1`, micro tags, inline icons).
* **Core Spacing:** `8px`, `16px`, `24px`, `32px` (`p-2`, `p-4`, `p-6`, `p-8`).
* **Major Spacing:** `40px`, `48px`, `64px`, `80px`, `96px` (`p-10`, `p-12`, `p-16`, `p-20`, `p-24`).
* **FORBIDDEN:** Arbitrary values (`p-2.5` = 10px, `p-[13px]`, `gap-[19px]`).

---

### 6. Calibrated Surface Layering (L0–L5)
* **L0 — Canvas:** Warm mineral white (`oklch(0.978 0.006 240)`). Never flat 100% white saturation.
* **L1 — Content Well / Surface:** Soft neutral mineral ivory (`oklch(0.990 0.003 240)`).
* **L2 — Raised Surface:** Crisp neutral white card (`oklch(1.000 0.000 0)`), subtle border.
* **L3 — Overlay Popover:** Floating menu or tooltip.
* **L4 — Modal Dialog:** High-focus overlay.
* **L5 — Transient Toast:** Floating notification layer.

---

### 7. Semantic Color System
* **Canvas:** Warm mineral
* **Ink (Primary Text):** Deep blue-charcoal (`oklch(0.200 0.025 250)`)
* **Secondary Text:** Slate (`oklch(0.460 0.020 250)`)
* **Brand Accent:** Restrained deep teal (`oklch(0.550 0.110 195)`)
* **AI & Exploration Accent:** Muted iris/violet (`oklch(0.560 0.120 280)`). Used strictly when AI/exploration is active, never as decorative neon/glow.
* **Growth:** Sage (`oklch(0.580 0.110 145)`)
* **Attention:** Ochre (`oklch(0.680 0.130 75)`)
* **Critical / Alert:** Controlled vermilion (`oklch(0.580 0.190 28)`)

---

### 8. Proprietary WAY 2.1 UX Primitives
Instead of treating `Card` as the default UI container:
1. `DecisionSurface`: The fundamental action unit (`Signal` $\rightarrow$ `Context` $\rightarrow$ `Action` $\rightarrow$ `Evidence` $\rightarrow$ `Disclosure`).
2. `WaySection`: Structural content landmark (`eyebrow` + `title` + `supporting sentence` + `action`).
3. `EditorialFeature`: Premium mixed-media visual combined with contextual narrative and direct project mission trigger.
4. `EvidenceDisclosure`: High-level qualitative summary with 1-click access to immutable cryptographic verification atoms.
5. `AIExplainability`: Accessible, transparent explanation of AI reasoning and evidence sources without visual gimmicks.
