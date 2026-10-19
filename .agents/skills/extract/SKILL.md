---
name: extract
description: "Pull reusable patterns, components, and design tokens into the design system. Identifies repeated patterns and consolidates them. Use when you have drift across the codebase and want to bring things back to a consistent system."
metadata:
  argument-hint: "[target]"
user-invocable: true
---

<!-- impeccable-pinned-skill -->

# Impeccable: /extract

> **Command Shortcut:** `/extract` or `/impeccable extract`  
> **Source:** [Impeccable Reference](file:///c:/learning/.agents/skills/impeccable/reference/extract.md)  
> **Governance:** WAY 2.1 Calm Intelligence & 0/4/8 Architectural Radius System

## Description
Pull reusable patterns, components, and design tokens into the design system. Identifies repeated patterns and consolidates them. Use when you have drift across the codebase and want to bring things back to a consistent system.

---

## Instructions & Playbook

# Extract Flow

Identify reusable patterns, components, and design tokens, then extract and consolidate them into the design system for systematic reuse.

## Step 1: Discover the Design System

Find the design system, component library, or shared UI directory. Understand its structure: component organization, naming conventions, design token structure, import/export conventions.

If no design system exists, do not create one yet. Ask with Codex's structured user-input/question tool when available, or directly in chat if it is not, and wait for the answer before continuing. Understand the preferred location and structure first.

## Step 2: Identify Patterns

Look for extraction opportunities in the target area:

- **Repeated components**: Similar UI patterns used 3+ times (buttons, cards, inputs)
- **Hard-coded values**: Colors, spacing, typography, shadows that should be tokens
- **Inconsistent variations**: Multiple implementations of the same concept
- **Composition patterns**: Layout or interaction patterns that repeat (form rows, toolbar groups, empty states)
- **Type styles**: Repeated font-size + weight + line-height combinations
- **Animation patterns**: Repeated easing, duration, or keyframe combinations

Assess value: only extract things used 3+ times with the same intent. Premature abstraction is worse than duplication.

## Step 3: Plan Extraction

Create a systematic plan:

- **Components to extract**: Which UI elements become reusable components?
- **Tokens to create**: Which hard-coded values become design tokens?
- **Variants to support**: What variations does each component need?
- **Naming conventions**: Component names, token names, prop names that match existing patterns
- **Migration path**: How to refactor existing uses to consume the new shared versions

Design systems grow incrementally. Extract what is clearly reusable now, not everything that might someday be reusable.

## Step 4: Extract & Enrich

Build improved, reusable versions:

- **Components**: Clear props API with sensible defaults, proper variants for different use cases, accessibility built in (ARIA, keyboard navigation, focus management), documentation and usage examples
- **Design tokens**: Clear naming (primitive vs semantic), proper hierarchy and organization, documentation of when to use each token
- **Patterns**: When to use this pattern, code examples, variations and combinations

## Step 5: Migrate

Replace existing uses with the new shared versions:

- **Find all instances**: Search for the patterns you extracted
- **Replace systematically**: Update each use to consume the shared version
- **Test thoroughly**: Ensure visual and functional parity
- **Delete dead code**: Remove the old implementations

## Step 6: Document

Update design system documentation:

- Add new components to the component library
- Document token usage and values
- Add examples and guidelines
- Update any Storybook or component catalog

**Avoid**:
- Extract one-off, context-specific implementations without generalization
- Create components so generic they are useless
- Extract without considering existing design system conventions
- Skip proper TypeScript types or prop documentation
- Create tokens for every single value (tokens should have semantic meaning)
- Extract things that differ in intent (two buttons that look similar but serve different purposes should stay separate)



---

## CREED OS & WAY 2.1 Mandatory Alignment Contract
When applying `/extract` within CREED OS, you MUST ALWAYS follow the **WAY 2.1 Master Design System**:
1. **0/4/8px Architectural Radius System:**
   - **0px (`rounded-none`):** Structural & technical frames (data tables, assessment question frames, item studio panes, console grids, metadata readouts).
   - **4px (`rounded-sm`):** Interactive controls & content surfaces (buttons, inputs, tiles, cards, dialogs, navigation items).
   - **8px (`rounded-md`):** Expressive media & immersive hero frames only.
   - **Forbidden:** 12px+ bubbly curves (`rounded-lg`, `rounded-xl`, `rounded-2xl`) and pill buttons.
2. **True Spacing Rhythm:** `p-1`, `p-2`, `p-4`, `p-6`, `p-8`. No arbitrary bracketed pixel classes (`p-[13px]`).
3. **OKLCH Semantic Design Tokens:** Use semantic tokens (`--surface-canvas`, `--surface-content`, `--surface-raised`, `--text-primary`, `--brand`, `--mint`, `--warning`, `--negative`). Never inject ad-hoc hex values.
4. **Lagom Motion:** Strictly 140ms–280ms durations (`--duration-micro: 140ms`, `--duration-standard: 200ms`, `--duration-emphasis: 280ms`). Silenced during active assessments.
5. **DPDP Child Data Safety:** Strict verifiable parental consent gating for minors under 18; zero psychometric leaks on learner or parent routes.
6. **Package Manager:** `pnpm` exclusively.
