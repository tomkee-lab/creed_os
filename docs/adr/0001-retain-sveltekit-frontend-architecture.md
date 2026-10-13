# ADR 0001: Retain SvelteKit 2 + Svelte 5 Frontend Architecture Baseline

## Status
Accepted (Authoritative Architecture Baseline)

## Date
2026-10-12

## Context
CREED OS is an AI-Native Learner Intelligence, Assessment, Learning & Pathway Navigation Platform built for students (Classes 5–10 / Ages 10–16), parents, teachers, counselors, administrators, and psychometricians.

The existing production frontend baseline is:
- **Framework:** Svelte 5 (with native fine-grained reactivity using runes: `$state`, `$derived`, `$props`, `$effect`) + SvelteKit 2 (SSR/PWA, filesystem routing, server actions, and type-safe data loading)
- **Language:** TypeScript 5.7+
- **Styling:** Tailwind CSS 4 + WAY 2.1 Design System (OKLCH semantic design tokens, zero arbitrary hex classes)
- **Headless UI Primitives:** Bits UI (designed natively for Svelte 5) + custom shadcn-svelte layer + Lucide Svelte
- **Domain Engine:** Effect (type-safe functional domain workflows, deterministic scoring pipelines, error tagging)
- **Data Persistence & Security:** Supabase PostgreSQL with relationship-scoped Row Level Security (RLS) + pgvector + ltree
- **Assessment Engine:** Server-authoritative deterministic 3PL IRT / CAT / BKT
- **Background Jobs:** Trigger.dev
- **AI Integrations:** Google ADK + Gemini API + Vercel AI SDK 6 (`ai`, `@ai-sdk/svelte`)

Questions periodically arise regarding whether the frontend should be migrated to React / Next.js or Vue / Nuxt, often citing ecosystem size, library familiarity, or developer hiring pools.

## Decision
We explicitly decide to **retain Svelte 5 + SvelteKit 2 as the authoritative production frontend baseline**. This decision is stable and binds current development, but remains reviewable if material, measurable architectural evidence warrants reopening.

### Reopening Criteria
This architectural decision may be formally reopened only if a documented, reproducible evaluation demonstrates:
1. **Unresolvable Performance Limitation:** SvelteKit/Svelte 5 measurably fails required educational latency or frame budgets on target classroom hardware despite optimization.
2. **Critical Deployment or Runtime Incompatibility:** An essential deployment target or infrastructure requirement is fundamentally unsupported.
3. **Severe Maintainability or Compiler Defect:** A fatal maintainability blocker is demonstrably caused by the framework compiler itself and cannot be mitigated.

Non-admissible grounds:
- General ecosystem popularity or search volume
- Developer familiarity or personal preference
- "Next.js is more popular"
- Automated generic AI recommendations

## Rationale
1. **Zero-Overhead Reactivity (Runes):** Svelte 5's compiler-driven runes (`$state`, `$derived`, `$props`) provide surgical, fine-grained reactivity without virtual DOM overhead, hook dependency arrays (`useEffect` stale closures), or unnecessary component re-renders. This is critical for 60fps interactive simulations (kinematic gear simulation, Blockly AST sync, Pyodide execution, and real-time CAT telemetry).
2. **Minimal Bundle Footprint for Low-Bandwidth Classrooms:** Svelte compiles down to tiny, framework-less imperative JavaScript. Given CREED OS's mandate to serve diverse school hardware (budget Chromebooks, tablets, low-spec lab PCs), SvelteKit's hydration footprint and TTI (Time to Interactive) are measurably superior to heavy React client runtimes.
3. **Coherent Architectural Separation:** SvelteKit's clear boundary between `+page.server.ts` / `+layout.server.ts` and `+page.svelte` enforces server-authoritative security (DPDP parental consent checks, session verification, IRT token security) and prevents psychometric parameter leaks to the browser client.
4. **First-Class TypeScript & Svelte Check:** Turborepo parallel checking (`svelte-check`) verifies end-to-end type safety from server loaders to client templates with zero runtime penalty.
5. **Stability of the Current Baseline:** The current codebase already passes type checking, unit tests across `@core-os/*`, CSS linting, Storybook compilation, and full production bundling (`pnpm run build` succeeds cleanly in < 4m). A framework rewrite would introduce massive regression risks, destabilize existing assessment logic, and destroy velocity with zero product benefit.

## Consequences
- All current and future frontend features must be authored using Svelte 5 runes and Bits UI headless primitives.
- Code reviews must reject any attempt to introduce React/Next.js dependencies or rewrite existing SvelteKit routes into alternate frameworks.
- Documentation, CI pipelines, and developer onboarding will remain standardized around Svelte 5 + SvelteKit 2 and `pnpm`.
