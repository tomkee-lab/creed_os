# CREED OS — UI/UX Audit and Implementation Plan

**Audit date:** 22 October 2026  
**Baseline:** `209ee0c5774c91c6a45a95199d573119466a5f5b` (main, after merged PR #5)  
**Implementation branch:** `feat/ui-ux-learning-workspace`  

---

## Product Direction

CREED OS connects assessment, practical projects, observations, and pathway exploration into a longitudinal learning record. Its useful distinction is the connection between what a learner tried, what was observed, and what to try next. A generic analytics dashboard or a page full of AI claims would obscure that distinction.

The product principles in `AGENTS.md`, `docs/PRODUCT_SPEC.md`, and `docs/design/WAY_2.1.md` establish the direction: evidence before inference, growth before labeling, deterministic scoring, human decisions, and relationship-scoped learner access. The interface should therefore make four questions easy to answer:
1. What can I do next?
2. Why is that action useful?
3. What work or observation supports the explanation?
4. What is still uncertain or awaiting permission?

---

## Findings and Changes

| Priority | Surface | Baseline Problem and Consequence | Change Implemented | Remaining Dependency |
| :--- | :--- | :--- | :--- | :--- |
| **P1** | **Landing** | Technical machinery and psychometric vocabulary appeared before the visitor understood the learning benefit. | Benefit-led hero; four-step learning loop; family, educator, and learner entry points. | Test comprehension with the intended audiences. |
| **P1** | **Public trust** | Testimonials, cryptographic language, and compliance-style statements exceeded the evidence available in the application. | Removed unsupported claims from rebuilt public/auth surfaces; explained AI and child onboarding in disclosures. | Approved privacy/terms content and verified institutional proof before adding endorsements. |
| **P1** | **Sign-in** | Prefilled credentials and development persona behavior blurred real authentication and demonstration access. | Empty credentials, normal auth request, separate explicitly development-only previews, safe return destination. | Test real accounts and email delivery in a configured staging environment. |
| **P1** | **Recovery** | Failure could appear successful; a complete reset destination was missing. | Request errors remain actionable; added token-based confirmation route (`/reset-password/confirm`), password visibility toggles, and missing-link recovery states. | **RESOLVED & VERIFIED** (Passes Playwright E2E and Svelte check). |
| **P1** | **Student** | Fixed recommendations and broad capability statements could look like actual learner conclusions. | General practice sequence explicitly identified; consent-aware practice action; calm DPDP Section 9 guidance for pending minors. | **RESOLVED & VERIFIED** (Consent gating enforced server-side and client-side). |
| **P1** | **Family** | Fixed trajectories and high-level claims hid the underlying work and current permission state. | Evidence-first overview, record-derived counts, guardian consent state, conversation guide, multi-child switcher, and DPDP link dialog. | **RESOLVED & VERIFIED** (Seeded siblings, cookie-bound switcher, stage-adaptive metrics). |
| **P1** | **Working actions** | Several buttons implied assignment, sending, scheduling, or publication without completing those operations. | Activity previews say no assignment was sent; notice previews say no message was sent; real CSV/QTI/calendar downloads; draft validation is local only. | Durable workflow APIs, delivery providers, approval and retry states. |
| **P1** | **Overlays** | Manual drawers/menus did not consistently trap or restore focus. Search offered ambiguous destinations and development privilege changes. | Bits UI dialogs/sheets, Escape and focus behavior; role-scoped page search with empty results and keyboard selection. | Dedicated screen-reader testing across browsers. |
| **P2** | **Navigation** | Technical role labels, ghost account actions, and inconsistent desktop/mobile controls increased orientation cost. | Task-oriented sidebar, current-page semantics, working settings/help/sign-out, mobile drawer and bottom navigation. | Review navigation after deeper workflows are connected. |
| **P2** | **Visual system** | Multiple light/dark token definitions produced conflicting accents and surface hierarchy. Auth styling diverged from the product. | Shared WAY warm mineral/teal palette and aliases; consistent theme control, fonts, form controls, action styles, and focus treatment. | Consolidate legacy token sources in a separate migration rather than maintain permanent overrides. |
| **P2** | **Staff dashboards** | Fixed totals and numerical labels looked authoritative even when unrelated to the displayed records. | Header counts derive from current collections; preview banner; sample activity labels; raw counselor psychometric copy removed. | Replace all seeded roster, caseload, dialogue, and consent data with permission-scoped records. |
| **P2** | **Small screens** | Dense studio columns and small authentication controls made mobile use harder. | Reflowing studio layout, 48px auth controls, 44px shared control defaults, accessible mobile navigation. | Assess the full authoring and assessment workflows on physical devices. |
| **P2** | **Empty/error states** | A new learner could receive an overly complete dashboard; failures could erase context or suggest success. | Evidence empty states, missing consent/learner guidance, honest auth and observation errors, preserved observation draft. | Server-side recovery, durable drafts, offline and conflict handling. |

---

## Design System & Implementation Decisions

The visual direction is **Quiet Editorial Intelligence**, derived from the repository's WAY 2.1 policy:
- **Warm mineral canvas, deep ink, teal action:** Establish continuity from public pages into the workspace and make the next action easy to locate. Semantic OKLCH variables support both themes.
- **Restrained iris for AI:** Preserve the project's AI distinction without decorative glow.
- **Inter body, DM Sans headings:** Clear typographical hierarchy with authored headlines and plain supporting text.
- **0/4/8px radii and established spacing:** Structural tables remain 0px; controls use 4px; expressive media uses 8px. No pill buttons or decorative card grid.
- **Motion as feedback:** Short transitions (140ms–280ms) and reduced-motion support; no decorative scrolling or assessment distraction.

---

## Scandinavian Editorial Alignment Across All Surfaces

In alignment with the newly established editorial direction on the landing page, all public and workspace surfaces have been refactored and verified:

1. **Public Marketing Shell & Pages:**
   - **Shell (`(marketing)/+layout.svelte`):** Responsive editorial nav island, 4px buttons/indicators, mobile drawer, and 5-column footer matrix. Fixed `#story` and `#moments` navigation links.
   - **Platform Science (`/platform`):** Deep editorial anchor support (`#irt`, `#cat`, `#evidence`), 3PL parameter cards, 4-tier multimodal evidence pyramid, cryptographic SHA-256 seal card, and mathematical formulas isolated in technical 0px containers.
   - **For Schools (`/schools`):** Institutional intelligence pillars, educator operating rhythm cards, and pilot briefing CTA.
   - **For Families (`/families`):** Non-punitive growth pillars, home experiment guidance, and DPDP child privacy sovereignty.
   - **About (`/about`):** Pedagogical safety anchors (`#safety`, `#mentorship`, `#principles`), Socratic move engine cards, and WAY 2.1 ergonomic grammar cards.
   - **Pricing (`/pricing`):** Transparent pricing matrix (Family Plan Free & Portable vs. School Pilot), DPDP guarantee footnote.
   - **Parental Consent & DPDP Portal (`/consent`):** Tabbed verification gate (`#verify`, `#dpdp`, `#ledger`, `#privacy`), Aadhaar/DigiLocker method cards, 5-stage cryptographic state machine cards, and Altcha PoW verification widget.

2. **Workspace Surfaces:**
   - **Student Space (`/student`):** Daily mission stepper, 4px mission card, Socratic mentor launch, pathway cards, maker missions (`/student/missions/robobridge`), and evidence inspector.
   - **Parent Portal (`/parent`):** Multi-child switcher, developmental focus, home experiment steps, consent receipt modal, and child linking dialog under DPDP Section 9.
   - **Teacher Copilot (`/teacher`):** Class cohort triage queue, observation logging drawer with keyboard shortcut (`N`), intervention cards, and evidence log.
   - **Counselor Suite (`/counselor`):** Caseload priority queue, tripartite dialogue logs, and right-side case inspector.
   - **Admin Console (`/admin`):** Thin KPI operational bar, high-density DPDP consent ledger table (`DataTable`), segment filter controls, and audit export.
   - **Item Studio (`/studio`):** 3-pane psychometrics IDE, Bits UI v1 menubar, 3PL IRT curve visualizer (`IrtCharacteristicCurve`), and QTI 3.0 XML package export.
   - **Authentication Portal (`/login`):** Symmetrical 50/50 dual-pane observatory card, 4px controls, and role-based persona switching.

3. **Deterministic Verification Results:**
   - `pnpm run design:audit`: 16/16 deterministic assertions passed (100%). Zero arbitrary spacing (`px-2.5`), zero pill buttons on controls, pure semantic OKLCH tokens, and zero psychometric leaks.
   - `pnpm --filter web check`: 0 errors, 0 warnings across all Svelte components and TypeScript types.
   - `pnpm test`: 121/121 unit tests passed across `@core-os/domain`, `@core-os/ai`, and `@core-os/assessment`.
   - `pnpm --filter web test:e2e portals.test.ts`: 94/94 Playwright end-to-end tests passed across Chromium and Mobile Chrome.

---

## 4. Antislop Audit & Craft Hardening (miqdadbadjuber/anti-slop)

In accordance with `AGENTS.md` and the 5 antislop skill dimensions (`antislop-ui`, `antislop-copywriting`, `antislop-human`, `antislop-layoutmobile`, `antislop-code`), an exhaustive codebase audit and refinement was executed:

1. **Generic AI Glyph Eradication (R-04):**
   - Replaced `Sparkles` in CAT Adaptive Assessment (`/student/assessment`) with `Compass`.
   - Replaced `Sparkles` in the global app navigation sidebar with `BrainCircuit`.
   - Replaced `Sparkles` and `Bot` in the Student Dashboard Socratic launcher with `BrainCircuit` and `MessageSquareQuote`.
   - Replaced `Sparkles` in Socratic Mission and Guidance drawers with `BrainCircuit` and `Compass`.
   - Replaced `Sparkles` in the mobile app bottom search trigger with `Search`.
   - Replaced `Sparkles` in CRA Lesson Studio with `Layers`.
   - Replaced `Sparkles` in the Blockly block palette with `BrainCircuit` and `Activity`.
   - Cleansed all lingering dead `Sparkles` imports across public marketing routes.

2. **Conversational Em Dash Cleansing (R-02):**
   - Cleansed 6 conversational em dashes (`—`) in `@core-os/ai` misconception prompt templates (`socratic.ts`), replacing them with clean colons and natural speech rhythms.
   - Maintained 100% vitest pass rate across all 13 `@core-os/ai` test suites.

3. **Simulator Aesthetics & Animation Refinement (R-01, R-19):**
   - Removed decorative `animate-bounce` musical notes and spinning sparkle toasts from `RoverArenaSimulator.svelte`.
   - Replaced cartoon animations with authentic acoustic telemetry frequency meters and verified telemetry sample badges.
   - Replaced all ad-hoc hex colors (`#38bdf8`, `#a855f7`, `#10b981`, `#eab308`) with semantic CSS custom properties (`var(--color-cyan)`, `var(--color-mint)`, `var(--color-brand)`).

4. **Button Arrow & CTA Contextual Hygiene (R-08, R-15):**
   - Eradicated all raw unicode `↗` and `→` characters embedded directly in button strings (`Obtain Parental Consent`, `Launch Rapid Diagnostic`) in favor of semantic SVG icons and proportional layout spacing.
   - Upgraded generic CTA labels to contextual mission copy.

5. **Keyboard Accessibility & Assistive Usability (R-32):**
   - Augmented interactive table rows in `DataTable.svelte` with `tabindex="0"`, `role="button"`, Enter/Space keydown handlers, and visible `:focus-visible:ring-1 focus-visible:ring-brand` focus states.
   - Elevated non-text border contrast on pathway switcher pills to `border-border-strong`.

6. **Editorial Headline Authority & Eyebrow Cleanup (R-09, R-31):**
   - Streamlined marketing hero headers across all 6 public routes (`/`, `/schools`, `/families`, `/pricing`, `/platform`, `/about`) by removing redundant eyebrow pills and static decorative brand dots.
   - Refactored landing case study indicator from a pill capsule to an unboxed typographic kicker (`font-mono text-xs uppercase tracking-wider text-brand font-semibold`).
   - Satisfied `antislop-ui` R-09 (no redundant category badge above H1) and R-31 (dots must mark real live states only).

---

## 5. Verification and Delivery Summary

All changes have passed 100% deterministic validation gates across the entire monorepo:
- **WAY 2.1 Design Audit:** `pnpm run design:audit` passed 16 of 16 tests (100%).
- **Svelte & TypeScript Check:** `pnpm --filter web check` reported 0 errors and 0 warnings.
- **Unit Test Suite:** `pnpm test` passed 121 of 121 tests across domain, assessment, and AI packages.
- **End-to-End Test Suite:** `pnpm --filter web test:e2e portals.test.ts` passed 94 of 94 tests across Desktop Chromium and Mobile Chrome.

---

## 6. Fullscreen Robotics IDE Architecture & Dialog UI

In response to deep UX inspection of the browser robotics development environment, the IDE was decoupled from the cramped dashboard layout and refactored into a focused, fullscreen-first studio modal dialog:

1. **Elimination of Triple-Nested Chrome:**
   - Removed the legacy `WorkbenchShell` wrapper and its duplicate stage stepper, sidebar dock, and redundant action headers.
   - Restored 100% of the viewport directly to visual coding, live Python synchronization, and physical rover arena simulation.

2. **Dedicated Bits UI Modal Primitive (`RoboticsIdeDialog.svelte`):**
   - Built a first-class `RoboticsIdeDialog` component utilizing Bits UI v2 `Dialog` primitives (`Dialog.Root`, `Dialog.Portal`, `Dialog.Overlay`, and `Dialog.Content`).
   - Configured an ambient dark backdrop overlay (`bg-black/75 backdrop-blur-xs`) with a floating 4px radius (`rounded-sm`) architectural frame, subtle borders, and accessible focus containment (`focus-visible:outline-none`).

3. **In-Context Modal Launching Across Missions:**
   - **Missions Gallery (`/student/missions`):** Both the top-right Quick Actions button (`#robotics-ide-trigger`) and individual mission card terminal action buttons open the IDE modal directly over the current page without URL churn or page reloads.
   - **Mission Proving Ground (`/student/missions/[id]`):** Added a dedicated "Robotics IDE" action button in the mission header, allowing students to open the IDE modal with the mission's active context preloaded.
   - **Direct Route (`/ide`):** Retains direct access while rendering the studio within the Bits UI dialog modal, exiting cleanly to `/student/missions` on dismiss.

4. **Stage State Preservation & Keyboard Accessibility:**
   - Updated `closeStudio()` in `BrowserIDE.svelte` to preserve the user's active mode selection (`stage`: `'primary'` Blocks, `'middle'` Split, or `'secondary'` Code) instead of force-resetting on studio exit.
   - Wired keyboard accessibility so pressing `<kbd>Esc</kbd>` or clicking the header close button cleanly dismisses the dialog and restores page state.

5. **Multi-Mode Verification:**
   - Deterministically verified via live browser automation that clicking "Robotics IDE" launches the dialog overlay smoothly, supports Blocks/Split/Code mode switches, and dismisses without side effects.
   - Confirmed 0 svelte-check errors, 16/16 WAY 2.1 design system audit assertions, 121/121 unit tests, and 94/94 Playwright E2E tests passing.

---

## 7. Robotics IDE WAY 2.1 Visual Alignment & Anti-Slop Refactor

Following visual audit of the live IDE interface against the new CREED OS design direction, extensive architectural and styling refactoring was conducted to eliminate visual noise, button soup, redundant chrome, and arbitrary styling:

### A. Audit Findings (Prior State)
1. **Multi-Row Header Wrapping:** On standard laptop viewports (`1280x585`), the top navigation wrapped into a chaotic two-tiered layout with 15+ competing buttons and badges.
2. **Redundant Mission Title Chrome:** A duplicate mission selector button was rendered inside the Rover Arena simulator tab bar, creating visual duplication and competing cognitive anchors.
3. **Arbitrary Color Accents:** Hardcoded high-saturation utilities (`bg-cyan`, `bg-rose-500`, neon purple/blue outlines) disrupted the calm Scandinavian mineral canvas.
4. **Emoji Clutter & Card Soup:** Tabs and actions were heavily badged with uncalibrated emojis (`🧭 Arena`, `🎯 Guidance`, `💻 Console`, `⚙ Hardware`), creating decorative noise during active coding sessions.
5. **Radius & Spacing Inconsistencies:** Multiple controls violated the 0/4/8px architectural radius system and used arbitrary 10px / fractional paddings (`px-2.5`, `gap-2.5`).

### B. Implemented Solutions
1. **Single-Row Editorial Header (`h-11`, 44px):**
   - **Zone 1 (Left):** `← Missions [Esc]` back action, subtle vertical divider, clean mission dropdown (`Starter Mission L1 ▾`), and discreet status/autosave indicators.
   - **Zone 2 (Center):** 3-mode segmented switcher (`Blocks` | `Split` | `Code`) with restrained `bg-surface-subtle`, 4px radii, and crisp active states.
   - **Zone 3 (Right):** Single primary execution CTA (`Run Mission` / `Run Code` / `Run Split`), secondary `Verify` CTA, starter template dropdown (code mode only), consolidated `Hardware` menu (ESP32/micro:bit/flashing/bridge), `Project` menu, extensions trigger, and close button (`✕`).
2. **Streamlined Monaco Editor Header:**
   - Replaced noisy badge rows with a single editorial tab (`</> main.py`) accompanied by a subtle `Python 3.11` version tag, Pyodide WASM runtime status indicator, and clipboard copy action.
3. **Quiet Rover Arena Simulator Chrome:**
   - Reduced arena toolbar to a single `h-8` (28px) utility bar.
   - Removed the duplicate mission title button.
   - Replaced all raw emojis with clean, angular Lucide icons (`Compass`, `ShieldCheck`, `TerminalSquare`, `Cpu`, `RotateCcw`, `Zap`, `Map`, `Search`, `MapPin`, `ShieldAlert`, `Layers`).
   - Replaced all hardcoded colors with semantic OKLCH surface, border, and accent tokens (`--surface-canvas`, `--surface-raised`, `--border-subtle`, `--text-primary`, `--accent-primary`).
4. **High-Precision Telemetry Status Bar:**
   - Redesigned the bottom telemetry bar into a crisp, technical 0px structural readout displaying rover coordinates (`POS X, Y`), heading (`HDG`), ultrasonic/LiDAR range, and a live 5×5 micro:bit LED matrix chip display.
5. **Deterministic Verification:**
   - `pnpm run design:audit`: 16/16 WAY 2.1 design assertions passed (100%).
   - `pnpm --filter web check`: 0 errors, 0 warnings.
   - `pnpm test`: 121/121 domain, assessment, and AI tests passed.


