# CREED OS Agent Guidelines & Rules

## Project Identity
- **Project Name:** CREED OS
- **Domain:** AI-Native Learner Intelligence, Assessment, Learning & Pathway Navigation Platform
- **Audience:** Students (Ages 10–16 / Classes 5–10), Parents, Teachers, Counselors, School/Institute Administrators

## Strict Package Management Rules
- **Package Manager:** `pnpm` is the ONLY allowed package manager.
- **FORBIDDEN:** `npm` and `yarn` are strictly FORBIDDEN across all commands, scripts, workflows, and documentation.
- Any shell execution installing packages or running scripts MUST use `pnpm` (e.g., `pnpm install`, `pnpm run dev`, `pnpm dlx`, `pnpm add`).

## Architecture & Technology Stack
- **Frontend Framework:** Svelte 5 + SvelteKit 2 + TypeScript
- **Styling:** Tailwind CSS 4 + WAY Design System (design tokens in OKLCH, CSS custom properties)
- **UI Primitives:** Bits UI (headless for Svelte 5) + shadcn-svelte (customizable code layer) + Lucide Svelte
- **Data Visualization:** Unovis (primary) + D3 (specialized)
- **Tables & Forms:** TanStack Svelte Table, Superforms + Zod + Formsnap
- **Backend & Database:** Supabase PostgreSQL + Row Level Security (RLS) + pgvector + ltree + FTS
- **Domain Engine:** Effect for complex domain workflows (assessment, evidence, recommendation pipelines)
- **Background Jobs:** Trigger.dev for durable asynchronous tasks, AI batching, report generation
- **AI Gateway & Mentorship:** Google ADK + Gemini API + Gemini Live API (for Socratic voice mentor)
- **AI UI:** Vercel AI SDK 6 (`ai`, `@ai-sdk/svelte`)

## Core Educational Principles
1. **Evidence before inference:** Every claim in the learner profile must map to tangible assessment or project evidence.
2. **Growth before labeling:** Never assign fixed IQ scores, permanent ability classifications, or deterministic career exclusions.
3. **Deterministic scoring:** Scores and psychometric ability estimates are computed by deterministic algorithms (IRT/CAT/BKT), never by raw unconstrained LLMs. AI explains; deterministic systems score; humans decide.
4. **Data privacy & child safety:** Strict DPDP Act alignment, verified parental consent state machine, relationship-scoped RLS policies.

## WAY 2.1 Master Design System & "Quiet Editorial Intelligence" Governance Policy
1. **The Three Information Levels Law:**
   - **Level 1 — Signal:** What the user must notice immediately (Primary action, key status).
   - **Level 2 — Context:** Why it matters (1 concise sentence maximum).
   - **Level 3 — Evidence:** Proof, rubrics, and provenance (Disclosed only upon interaction/click).
2. **The Content Density Rule:**
   - Every section contains: **1 title**, **1 short supporting sentence maximum**, **1 primary action**.
   - Deeper diagnostic details, calculations, and parameters move into progressive disclosures, drawers, or dialogs.
   - Eliminates "card soup" and "information equivalence" (where every metric is boxed and badged).
3. **Architectural Radius System:**
   - **0px (`rounded-none`):** Structural & technical surfaces (data tables, assessment question frame, item studio, console grids, metadata readouts).
   - **4px (`rounded-sm`):** Controls & content surfaces (buttons, inputs, tiles, cards, dialogs, navigation items).
   - **8px (`rounded-md`):** Expressive media & immersive experiences (hero media, mixed-media illustration frames, editorial features).
   - **Forbidden:** 12px+ bubbly consumer curves (`rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, pill buttons).
4. **True Spacing Rhythm:**
   - **Micro (4px):** Micro tags, compact indicators (`p-1`, `gap-1`).
   - **Core (8, 16, 24, 32px):** Content padding, card section separation (`p-2`, `p-4`, `p-6`, `p-8`).
   - **Major (40, 48, 64, 80, 96px):** Layout gutters, landmarks, section boundaries (`p-10`, `p-12`, `p-16`, `p-20`, `p-24`).
   - **Forbidden:** Arbitrary spacings (`p-2.5` = 10px, `p-[13px]`, `p-[17px]`, `gap-[19px]`).
5. **No Arbitrary Colors:** Only use semantic design tokens (`--surface-canvas`, `--surface-content`, `--surface-raised`, `--text-primary`, `--accent-primary`, etc.). Never inject ad-hoc hex values (`#03080E`, `#38bdf8`) into component classes.
6. **Carbon for AI & Semantic Styling:**
   - Clearly identify AI presence with restrained Iris (`--accent-indigo`), contextual explainability (`Why?`, `Evidence`, `Limitations`), and child safety indicators.
   - Strictly forbidden: glowing AI borders, neon purple/cyan gradients, animated holograms, or decorative sparkle effects.
7. **Action-First UX & "Next Action" Primacy:**
   - The primary visual signal on every screen must be **"What should I do next?"** (e.g. Start today's 20-min mission), not a wall of charts or metric boxes.
   - Global page grammar: Signal → Context → Action → Evidence → Disclosure.
   - Standardize on proprietary WAY 2.1 patterns: `WaySection`, `DecisionSurface`, `EditorialFeature`, `EvidenceDisclosure`, and `AIExplainability`.
8. **Calibrated Surface Layering (L0–L4):**
   - L0 Canvas (warm mineral white) → L1 Content well → L2 Raised focus card → L3 Overlay popover → L4 Modal dialog. Avoid pure flat white saturation.
9. **Bifurcated Paradigms & Zero Production Leaks:**
   - **WAY Experience (Student, Parent):** Warm mineral canvas default, comfortable density, human-first developmental growth vocabulary.
   - **WAY Console (Teacher, Counselor, Admin, Item Studio):** High-density IBM Carbon discipline, compact modes, persistent filter bars, data tables.
   - **Strict Leak Prevention:** Raw psychometric symbols ($\theta$, $SE$, 3PL parameters $a/b/c$, Fisher info, evaluator telemetry drawer) and Persona Dock development chrome must NEVER appear in production Student, Parent, Teacher, or Counselor routes.
10. **No False Precision:**
    - Never display percentage career readiness (e.g. "74% fit"). Use qualitative developmental bands (*"Strong foundation"*, *"Developing foundation"*, *"4 / 6 foundational competencies demonstrated"*).
11. **Lagom Motion Contract:**
    - Motion duration must stay strictly between **140ms and 280ms** (`--duration-micro: 140ms;`, `--duration-standard: 200ms;`, `--duration-emphasis: 280ms;`). Decorative animations are silenced during active assessments.
12. **State Coverage:** All interactive components must support full 6-state coverage: default, hover, active, focus-visible, disabled, and loading.
