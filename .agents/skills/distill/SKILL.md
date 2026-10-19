---
name: distill
description: "Strip designs to their essence by removing unnecessary complexity. Great design is simple, powerful, and clean. Use when the user asks to simplify, declutter, reduce noise, remove elements, or make a UI cleaner and more focused."
metadata:
  argument-hint: "[target]"
user-invocable: true
---

<!-- impeccable-pinned-skill -->

# Impeccable: /distill

> **Command Shortcut:** `/distill` or `/impeccable distill`  
> **Source:** [Impeccable Reference](file:///c:/learning/.agents/skills/impeccable/reference/distill.md)  
> **Governance:** WAY 2.1 Calm Intelligence & 0/4/8 Architectural Radius System

## Description
Strip designs to their essence by removing unnecessary complexity. Great design is simple, powerful, and clean. Use when the user asks to simplify, declutter, reduce noise, remove elements, or make a UI cleaner and more focused.

---

## Instructions & Playbook

Strip a design to its essence. Remove anything that doesn't earn its place: redundant elements, repeated information, decorative noise, cosmetic complexity.


---

## Assess Current State

Analyze what makes the design feel complex or cluttered:

1. **Identify complexity sources**:
   - **Too many elements**: Competing buttons, redundant information, visual clutter
   - **Excessive variation**: Too many colors, fonts, sizes, styles without purpose
   - **Information overload**: Everything visible at once, no progressive disclosure
   - **Visual noise**: Unnecessary borders, shadows, backgrounds, decorations
   - **Confusing hierarchy**: Unclear what matters most
   - **Feature creep**: Too many options, actions, or paths forward

2. **Find the essence**:
   - What's the primary user goal? (There should be ONE)
   - What's actually necessary vs nice-to-have?
   - What can be removed, hidden, or combined?
   - What's the 20% that delivers 80% of value?

If any of these are unclear from the codebase, do not guess. Ask with Codex's structured user-input/question tool when available, or directly in chat if it is not, and wait for the answer before continuing.

Simplicity is not about removing features. It's about removing obstacles between users and their goals. Every element should justify its existence.

## Plan Simplification

Create a ruthless editing strategy:

- **Core purpose**: What's the ONE thing this should accomplish?
- **Essential elements**: What's truly necessary to achieve that purpose?
- **Progressive disclosure**: What can be hidden until needed?
- **Consolidation opportunities**: What can be combined or integrated?

Expect to say no to good ideas to make room for great execution.

## Simplify the Design

Systematically remove complexity across these dimensions:

### Information Architecture
- **Reduce scope**: Remove secondary actions, optional features, redundant information
- **Progressive disclosure**: Hide complexity behind clear entry points (accordions, modals, step-through flows)
- **Combine related actions**: Merge similar buttons, consolidate forms, group related content
- **Clear hierarchy**: ONE primary action, few secondary actions, everything else tertiary or hidden
- **Remove redundancy**: If it's said elsewhere, don't repeat it here

### Visual Simplification
- **Reduce color palette**: Use 1-2 colors plus neutrals, not 5-7 colors
- **Limit typography**: One font family, 3-4 sizes maximum, 2-3 weights
- **Remove decorations**: Eliminate borders, shadows, backgrounds that don't serve hierarchy or function
- **Flatten structure**: Reduce nesting, remove unnecessary containers; never nest cards inside cards
- **Remove unnecessary cards**: Cards aren't needed for basic layout; use spacing and alignment instead
- **Consistent spacing**: Use one spacing scale, remove arbitrary gaps

### Layout Simplification
- **Linear flow**: Replace complex grids with simple vertical flow where possible
- **Remove sidebars**: Move secondary content inline or hide it
- **Full-width**: Use available space generously instead of complex multi-column layouts
- **Consistent alignment**: Pick left or center, stick with it
- **Generous white space**: Let content breathe, don't pack everything tight

### Interaction Simplification
- **Reduce choices**: Fewer buttons, fewer options, clearer path forward (paradox of choice is real)
- **Smart defaults**: Make common choices automatic, only ask when necessary
- **Inline actions**: Replace modal flows with inline editing where possible
- **Remove steps**: Can the flow lose a step?
- **Clear next action**: ONE obvious next action, not five competing ones

### Content Simplification
- **Shorter copy**: Cut every sentence in half, then do it again
- **Active voice**: "Save changes" not "Changes will be saved"
- **Remove jargon**: Plain language always wins
- **Scannable structure**: Short paragraphs, bullet points, clear headings
- **Essential information only**: Remove marketing fluff, legalese, hedging
- **Remove redundant copy**: No headers restating intros, no repeated explanations, say it once

### Code Simplification
- **Remove unused code**: Dead CSS, unused components, orphaned files
- **Flatten component trees**: Reduce nesting depth
- **Consolidate styles**: Merge similar styles, use utilities consistently
- **Reduce variants**: Does that component need 12 variations, or can 3 cover 90% of cases?

**Avoid**:
- Remove necessary functionality (simplicity ≠ feature-less)
- Sacrifice accessibility for simplicity (clear labels and ARIA still required)
- Make things so simple they're unclear (mystery ≠ minimalism)
- Remove information users need to make decisions
- Eliminate hierarchy completely (some things should stand out)
- Oversimplify complex domains (match complexity to actual task complexity)

## Verify Simplification

Ensure simplification improves usability:

- **Faster task completion**: Can users accomplish goals more quickly?
- **Reduced cognitive load**: Is it easier to understand what to do?
- **Still complete**: Are all necessary features still accessible?
- **Clearer hierarchy**: Is it obvious what matters most?
- **Better performance**: Does simpler design load faster?

## Document Removed Complexity

If you removed features or options:
- Document why they were removed
- Consider if they need alternative access points
- Note any user feedback to monitor

When the cuts feel right, hand off to `$impeccable polish` for the final pass. As Antoine de Saint-Exupéry put it: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away."


---

## CREED OS & WAY 2.1 Mandatory Alignment Contract
When applying `/distill` within CREED OS, you MUST ALWAYS follow the **WAY 2.1 Master Design System**:
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
