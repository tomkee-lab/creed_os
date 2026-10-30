---
name: beui
description: >
  beUI Animated Component Registry, Motion Intelligence & Svelte 5 Adaptation Engine for CREED OS.
  Provides access to beUI discovery endpoints, registry schemas, and the standard Svelte 5 runes
  porting workflow adhering strictly to WAY 2.1 Quiet Editorial Intelligence and anti-slop rules.
argument-hint: "[search <query>|fetch <slug>|list [category]]"
license: MIT
---

# beUI Motion Registry & Svelte 5 Adaptation Skill (`/beui`)

> Use existing beUI animated components and motion patterns as reference designs before inventing custom motion widgets.

beUI (https://beui.dev) is an open-source library of animated components, interaction primitives, data-display modules, and AI agent interface blocks.

---

## 1. Core Endpoints & CLI Tools

### Registry Endpoints
| Endpoint | Purpose |
| :--- | :--- |
| `https://beui.dev/llms.txt` | Markdown discovery index |
| `https://beui.dev/registry.json` | Full JSON catalogue of all components |
| `https://beui.dev/r/{slug}.json` | shadcn install metadata with inline file paths and deps |
| `https://beui.dev/r/{slug}/raw` | Copy-ready raw source code (plain text) |
| `https://beui.dev/components/{category}/{slug}.md` | Component documentation and API reference |
| `https://mcp.beui.dev/mcp` | Hosted HTTP MCP server (tools: `list_components`, `search_components`, `get_component`, `get_install_command`) |

### Workspace CLI Commands
Always use the registered `pnpm` scripts:
```bash
# Search beUI registry by keyword
pnpm beui:search <query>

# Fetch component metadata and file tree
pnpm beui:fetch <slug>

# Fetch copy-ready raw source
pnpm beui:fetch <slug> --raw

# List all components or filter by category ('motion' or 'blocks')
pnpm beui:list [category]
```

---

## 2. Strict CREED OS Adaptation Contract

### Architectural Boundaries
1. **Zero React Runtime:** beUI components are authored in React using `motion` (Framer Motion). **CREED OS is strictly Svelte 5 + SvelteKit 2 + Tailwind CSS 4.** Under no circumstances should `react`, `react-dom`, or `motion` be installed in production bundles.
2. **Svelte 5 Runes Standard:**
   - React JSX (`{props.children}`) → Svelte 5 snippets (`{@render children?.()}`)
   - `useState` / `useRef` → `$state(...)` and `bind:this`
   - `useMemo` / computed values → `$derived(...)`
   - `useEffect` / `useLayoutEffect` → `$effect(...)`
   - Event handlers (`onClick`, `onMouseEnter`) → `onclick`, `onmouseenter`
   - `className` → `class`
3. **Motion Engine Replacement:**
   - Replace `motion.div` and `AnimatePresence` with:
     - Native Svelte transitions (`transition:fade`, `transition:slide`, `transition:fly`)
     - Hardware-accelerated CSS keyframe animations (e.g., marquee, shimmer, pulse)
     - Svelte motion springs (`svelte/motion`) or project GSAP (`gsap` is already installed)
   - Adhere strictly to the **Lagom Motion Contract**: 140ms–280ms duration (`--duration-micro: 140ms;`, `--duration-standard: 200ms;`, `--duration-emphasis: 280ms;`). Never exceed 280ms for interactive UI.
4. **WAY 2.1 Design System Alignment:**
   - **Radius System:** Convert any `rounded-xl`, `rounded-2xl`, or pill buttons into:
     - `0px` (`rounded-none`): Structural frames, data tables, evidence inspector panels
     - `4px` (`rounded-sm`): Buttons, inputs, chips, interactive cards
     - `8px` (`rounded-md`): Expressive media, hero console frames
   - **Semantic OKLCH Tokens:** Replace generic Tailwind colors (`bg-zinc-900`, `text-blue-500`) with semantic tokens:
     - Surfaces: `bg-surface`, `bg-surface-raised`, `bg-surface-subtle`, `bg-canvas`
     - Text: `text-ink`, `text-ink-secondary`, `text-ink-muted`
     - Accents: `text-brand`, `bg-brand`, `border-border`
   - **True Spacing Rhythm:** Strictly adhere to base-4 rhythm (`p-1`, `p-2`, `p-4`, `p-6`, `p-8`, etc.). Never use `p-2.5` or non-standard pixel values.

---

## 3. High-Value beUI Patterns for CREED OS

| Pattern | beUI Slug | CREED OS Use Case |
| :--- | :--- | :--- |
| **Marquee** | `marquee` | Infinite logos, partner schools, continuous ticker of rubric skills |
| **Text Scramble** | `text-scramble` | Diagnostic probe calibration, secure artifact hash resolution |
| **Number Ticker** | `number` | Score reveal, time spent, mastery points increment |
| **Agent Activity** | `agent-activity` | Socratic mentor thought trail, live evidence ledger verification stream |
| **Dynamic Tabs** | `tabs` | Sliding indicator tabs, mode selection, role switcher |
| **Tilt Card** | `tilt-card` | 3D tactile feel for learner milestone certificates & project badges |

---

## 4. Adaptation Workflow Recipe

When adapting a beUI component:
1. Run `pnpm beui:search <feature>` to identify the slug.
2. Run `pnpm beui:fetch <slug> --raw` to view the implementation.
3. Identify the core visual mechanics (CSS layout, animation transforms, event listeners).
4. Port to `apps/web/src/lib/components/beui/<Name>.svelte` using Svelte 5 runes.
5. Export from `apps/web/src/lib/components/beui/index.ts`.
6. Run `pnpm run design:audit` and `pnpm --filter web check` to verify compliance.
