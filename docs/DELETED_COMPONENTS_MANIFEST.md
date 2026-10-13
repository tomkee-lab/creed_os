# CREED OS — Candidate Dead Code & Dependency Retirement Manifest

**Status:** Executing (Phase 3 of Engineering Excellence Mission)  
**Governance Authority:** CREED OS Principal Engineering & Architecture Review  
**Date:** October 2026  

---

## 1. Executive Summary

This manifest documents the systematic audit and retirement of unused components and redundant dependencies in accordance with **WAY 2.1 Quiet Editorial Intelligence** and the **Compaction/Audit Review Directives**.

Every component and dependency underwent rigorous multi-vector verification across:
1. Active SvelteKit routes (`apps/web/src/routes/**`)
2. Component composition trees & subpath imports
3. Dynamic component registries & loaders
4. Storybook stories (`apps/web/src/lib/components/stories/**`)
5. Vitest & Playwright E2E test suites (`packages/**/tests/**`, `apps/web/e2e/**`)

---

## 2. Dependency Analysis & Disposition

| Dependency | Location | Status | Evidence & Decision Rationale |
| :--- | :--- | :--- | :--- |
| **`cn`** (`^0.4.0`) | `apps/web/package.json` | **RETIRED (Batch 1)** | Zero imports across the entire monorepo. CREED OS implements its own type-safe `cn(...inputs)` utility in `$lib/utils.ts` backed by `clsx` and `tailwind-merge`. |
| **`dotenv`** (`^18.0.6`) | `apps/web/package.json` | **RETIRED (Batch 1)** | Zero imports in `apps/web`. Vite and SvelteKit natively load `.env` files via `import.meta.env` and `$env`. `dotenv` is redundant overhead. |
| **`@lucide/svelte`** (`^1.52.0`) | `apps/web/package.json` | **RETAINED** | **Preserved:** Deep grep inspection proved `@lucide/svelte/icons/*` is actively imported in `sonner.svelte`, `sheet-content.svelte`, `dropdown-menu-*.svelte`, and other active UI primitives. Removing it would break toast notifications and sheets. |

---

## 3. Legacy Prototype Components in `$lib/components/` (Batch 2)

These components were early mock implementations that have been superseded by WAY 2.1 calibrated design system primitives, specialized charts, or headless Bits UI integrations. None have Storybook stories or active route consumers.

| Component | Path | Superseded By / Status |
| :--- | :--- | :--- |
| `CompetencyRadar.svelte` | `apps/web/src/lib/components/` | Superseded by `MasterySunburst.svelte` and Unovis visualizations. Zero route imports. |
| `CompetencyRowList.svelte` | `apps/web/src/lib/components/` | Superseded by `InspectorPanel.svelte` and WAY 2.1 table grids. Zero route imports. |
| `AdaptiveProgress.svelte` | `apps/web/src/lib/components/` | Superseded by `Stepper.svelte` and `LongitudinalGrowthBand.svelte`. Zero route imports. |
| `EvidenceCard.svelte` | `apps/web/src/lib/components/` | Superseded by `EvidenceRating.svelte` and WAY 2.1 L1/L2 well containers. Zero route imports. |
| `PathwayCard.svelte` | `apps/web/src/lib/components/` | Superseded by `PathwayGraphCanvas.svelte` and `ConstructiveMismatchCalculator.svelte`. Zero route imports. |
| `MismatchAlert.svelte` | `apps/web/src/lib/components/` | Superseded by contextual `AIExplainability.svelte` and inline mismatch indicators. Zero route imports. |
| `Card.svelte` | `apps/web/src/lib/components/` | Superseded by WAY 2.1 `WaySection.svelte`, `DecisionSurface.svelte`, and L1 content wells. Zero route imports. |
| `Input.svelte` | `apps/web/src/lib/components/` | Superseded by `ui/input` and `ui/field` (Bits UI headless inputs). Zero route imports. |
| `Tabs.svelte` | `apps/web/src/lib/components/` | Superseded by `ButtonGroup.svelte` and accessible tab navigation. Zero route imports. |
| `Modal.svelte` | `apps/web/src/lib/components/` | Superseded by `InspectorPanel.svelte` and `OpenSourceComplianceModal.svelte`. Zero route imports. |
| `IllustrationFrame.svelte` | `apps/web/src/lib/components/` | Early experiment; zero usages across all routes and stories. |

---

## 4. Retained Architectural Components (Zero-Deletion Protection)

The following components were flagged as candidates in preliminary scans but are **strictly protected and preserved**:

1. **WAY 2.1 Canonical Patterns:**
   - `WaySection.svelte` (with Storybook story & active route consumers)
   - `DecisionSurface.svelte` (with Storybook story `DecisionSurface.stories.svelte`)
   - `EditorialFeature.svelte` (with Storybook story `EditorialFeature.stories.svelte`)
   - `EvidenceDisclosure.svelte` (with Storybook story `EvidenceDisclosure.stories.svelte`)
   - `AIExplainability.svelte` (with Storybook story `AIExplainability.stories.svelte`)
2. **Way 2.1 Interactive Controls & Primitives:**
   - `Button.svelte`, `Badge.svelte`, `ButtonGroup.svelte`, `Stepper.svelte`, `DropdownCheckbox.svelte`, `Breadcrumb.svelte`, `Kbd.svelte`, `EvidenceRating.svelte`, `GlyphMatrix.svelte`
   - Active across Student, Parent, Teacher, Counselor, and Marketing routes.

---

## 5. Unused Shadcn Component Trees in `ui/` (Batch 3)

The following 14 shadcn component scaffolding directories in `apps/web/src/lib/components/ui/` have zero internal or route-level consumers and are safely retired:
- `avatar/`
- `card/`
- `checkbox/`
- `collapsible/`
- `dialog/`
- `popover/`
- `progress/`
- `radio-group/`
- `scroll-area/`
- `select/`
- `skeleton/`
- `switch/`
- `tabs/`
- `textarea/`

---

## 6. Execution Verification Protocol

Each retirement batch requires synchronous execution of:
1. `pnpm run check` (TypeScript type safety & Svelte diagnostics)
2. `pnpm test` (All 27 domain, AI, and psychometric tests)
3. `pnpm run design:audit` (WAY 2.1 100% design system compliance)
