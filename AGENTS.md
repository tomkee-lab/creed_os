# CREED OS Agent Guidelines & Rules

## Project Identity
- **Project Name:** CREED OS
- **Domain:** AI-Native Learner Intelligence, Assessment, Learning & Pathway Navigation Platform
- **Audience:** Core Target: Classes 5–10 (Ages 10–16); Modular Curriculum: Classes 3–12 (Ages 8–18); Parents, Teachers, Counselors, Administrators. Statutory Child Protection applies to all minors under 18 years under DPDP Act 2023.

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
4. **Data privacy & child safety:** Strict DPDP Act alignment (all minors < 18 years require verified parental consent before processing or profiling), relationship-scoped RLS policies.

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

## Flowbite-Svelte MCP Server Integration & Architecture Rules
This workspace integrates the Flowbite-Svelte MCP server (`flowbite-svelte`) to provide comprehensive UI component references and pattern inspiration.

### Available MCP Tools:
1. `findComponent`: Discover components by name or category (returns documentation paths).
2. `getComponentList`: Discover available Flowbite-Svelte components across all categories.
3. `getComponentDoc`: Fetch full documentation, props, events, and usage examples for a component path.
4. `searchDocs`: Full-text search across documentation for features, form patterns, and layouts.

### Strict CREED OS Implementation Contract:
- **Reference, not Direct Render:** Flowbite-Svelte serves as structural reference. Rendered components MUST use **Svelte 5 runes (`$state`, `$derived`, `$props`)**, **Bits UI primitives**, and **Tailwind CSS 4**.
- **Enforce WAY 2.1 Radius System:** Never carry over Flowbite's default `rounded-lg`, `rounded-xl`, or `rounded-full` classes. Enforce strictly 0px (`rounded-none`) for structural/technical frames, 4px (`rounded-sm`) for controls/inputs/buttons, and 8px (`rounded-md`) for expressive media. Prohibit 12px+ curves and pill buttons.
- **Enforce Zero-Curves:** All icons, markers, indicators, and charts must use straight angular/polygonal geometry.
- **Enforce OKLCH Tokens:** Replace generic Flowbite color classes (`gray-500`, `primary-700`, `blue-600`) with CREED OS semantic design tokens (`--surface-canvas`, `--surface-content`, `--text-primary`, `--accent-primary`).
- **Domain Alignment:** Substitute generic SaaS copy with authentic educational, psychometric, and DPDP-compliant learner intelligence terminology.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `.agents/plugins/antislop/skills/antislop/SKILL.md` (core) and then the skill for the task:
- UI / visual: `.agents/plugins/antislop/skills/antislop-ui/SKILL.md`
- Copy & text: `.agents/plugins/antislop/skills/antislop-copywriting/SKILL.md`
- People: `.agents/plugins/antislop/skills/antislop-human/SKILL.md`
- Mobile / responsive: `.agents/plugins/antislop/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `.agents/plugins/antislop/skills/antislop-code/SKILL.md`

Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
<!-- antislop:end -->

## Kokonut UI & Interaction Design Standards

This project leverages component patterns and animations from Kokonut UI (https://kokonutui.com).

- **Architecture Boundary:** Kokonut UI is designed for React/Next.js. CREED OS is strictly **Svelte 5 + SvelteKit 2**. We do NOT introduce React or Framer Motion runtime dependencies into the production bundle.
- **Reference Catalog:** Before building custom animated or kinetic UI from scratch, consult Kokonut UI: https://kokonutui.com/llms.txt lists every component with a one-line description. Full docs and source are available at `https://kokonutui.com/docs/<path>.md` and raw registry JSON at `https://kokonutui.com/r/<name>.json`.
- **Installation / Fetching:**
  To pull a component spec and its dependencies into `apps/web`:
  ```bash
  pnpm dlx shadcn@latest add https://kokonutui.com/r/<name>.json -c ./apps/web
  ```
  *(Note: direct URL is used because `apps/web/components.json` adheres to `shadcn-svelte.com/schema.json` which forbids the React shadcn `registries` key).*
- **Svelte 5 Runes Adaptation Standard:**
  All components in `apps/web/src/lib/components/kokonutui/` MUST be pure Svelte 5:
  - React JSX → Svelte 5 template syntax (`{@render ...}`)
  - `useState` / `useRef` → `$state(...)` and `bind:this`
  - `useEffect` / `useLayoutEffect` → `$effect(...)`
  - Framer Motion (`motion.div`, `AnimatePresence`) → Native Svelte transitions (`transition:`, `animate:`), CSS keyframes, or project GSAP (`gsap` is already installed).
  - Canvas mechanics (particles, trails, fluid simulations) → Clean native Canvas 2D / WebGL RAF loops with DPR scaling and unmount cleanup.
- **WAY 2.1 Governance:** Enforce the 0/4/8px radius system (`rounded-sm` 4px for interactive controls, `rounded-none` for structural frames) and semantic OKLCH tokens (`--surface-canvas`, `--accent-primary`). Avoid bubbly consumer radii and arbitrary hexes.
- **Reference Implementation:** See [ParticleButton.svelte](file:///c:/learning/apps/web/src/lib/components/kokonutui/ParticleButton.svelte) as the gold standard for porting Kokonut UI components to Svelte 5.

## beUI Motion Registry & Interaction Design Standards

This project integrates patterns, motion primitives, and AI interface blocks from beUI (https://beui.dev).

- **Architecture Boundary:** beUI components are authored in React using `motion` (Framer Motion). CREED OS is strictly **Svelte 5 + SvelteKit 2 + Tailwind CSS 4**. We do NOT introduce React or Framer Motion runtime dependencies into the production web bundle.
- **MCP Server & Discovery:**
  - Hosted MCP Server: `https://mcp.beui.dev/mcp` (connected via stdio proxy `beui-mcp.js` and registered in `mcp_config.json`).
  - Available MCP Tools: `list_components`, `search_components`, `get_component`, `get_install_command`, `list_native_components`, `get_native_component`.
  - Discovery Index: `https://beui.dev/llms.txt` and registry catalogue `https://beui.dev/registry.json`.
- **Registry & CLI Discovery:**
  - Search components: `pnpm beui:search <query>`
  - Fetch metadata & files: `pnpm beui:fetch <slug>`
  - Fetch raw plain-text source: `pnpm beui:fetch <slug> --raw`
  - List all components: `pnpm beui:list [category]`
  - Direct registry URL: `https://beui.dev/r/<slug>.json`
- **Svelte 5 Runes Adaptation Standard:**
  All components in `apps/web/src/lib/components/beui/` MUST be pure Svelte 5:
  - React JSX → Svelte 5 template syntax (`{@render children?.()}`)
  - `useState` / `useRef` → `$state(...)` and `bind:this`
  - `useEffect` / `useLayoutEffect` → `$effect(...)`
  - Motion / Framer Motion → Hardware-accelerated CSS keyframes, native Svelte transitions, or project GSAP.
  - Spring configs → Lagom Motion Contract (140ms–280ms duration strictly).
- **WAY 2.1 Governance:** Enforce the 0/4/8px architectural radius system (`rounded-none` structural, `rounded-sm` controls, `rounded-md` media) and semantic OKLCH tokens (`--surface-canvas`, `--surface-raised`, `--brand`, `--ink`).
- **Reference Implementations:** See [Marquee.svelte](file:///c:/learning/apps/web/src/lib/components/beui/Marquee.svelte), [TextScramble.svelte](file:///c:/learning/apps/web/src/lib/components/beui/TextScramble.svelte), and [AgentActivity.svelte](file:///c:/learning/apps/web/src/lib/components/beui/AgentActivity.svelte).




