# Core_OS Agent Guidelines & Rules

## Project Identity
- **Project Name:** Core_OS
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
