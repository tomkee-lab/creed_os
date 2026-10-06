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

## WAY Design System & "No AI Slope" Governance Policy
1. **No Arbitrary Colors:** Only use semantic design tokens (`--surface-canvas`, `--surface-raised`, `--text-primary`, `--accent-cyan`, etc.). Never inject ad-hoc hex values (`#03080E`, `#38bdf8`, etc.) into component classes.
2. **No Card Soup:** Only use elevated cards for interactive or primary focal objects. Group content using clean typographic hierarchy and 8pt section spacing. Avoid boxing every single metric in a bordered rectangle.
3. **No Neon / Glowing Borders:** Experience routes (Student, Parent, Teacher, Counselor) must use quiet, tactile surfaces (Nordic Lagom warm mineral whites in light mode, deep slate in dark mode). Never add glowing drop shadows or cyber-neon outlines.
4. **Strict 8pt Spacing Rhythm:** Spacing must adhere to the 8pt rhythm (4, 8, 12, 16, 24, 32, 40, 48, 64px). Arbitrary pixel values (e.g., 13px, 19px, 27px) are strictly forbidden.
5. **Bifurcated Paradigms:**
   - **WAY Experience:** Student, Parent, Teacher, Counselor (Light by default, comfortable/standard density, warm mineral canvas, human-first vocabulary).
   - **WAY Console:** Admin, Item Studio, Psychometrics (High-density Carbon discipline, compact/dense modes, persistent filter bars, data tables).
6. **Role-Aware Vocabulary:** Raw psychometric formulas and parameters (θ, SE, 3PL parameters a/b/c) must NEVER be shown to Students or Parents. Always translate into human-first developmental language.
7. **State Coverage:** All interactive components must support full state coverage: default, hover, active, focus-visible, disabled, and loading.
