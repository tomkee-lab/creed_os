---
name: quieter
description: "Tones down visually aggressive or overstimulating designs, reducing intensity while preserving quality. Use when the user mentions too bold, too loud, overwhelming, aggressive, garish, or wants a calmer, more refined aesthetic."
metadata:
  argument-hint: "[target]"
user-invocable: true
---

<!-- impeccable-pinned-skill -->

# Impeccable: /quieter

> **Command Shortcut:** `/quieter` or `/impeccable quieter`  
> **Source:** [Impeccable Reference](file:///c:/learning/.agents/skills/impeccable/reference/quieter.md)  
> **Governance:** WAY 2.1 Calm Intelligence & 0/4/8 Architectural Radius System

## Description
Tones down visually aggressive or overstimulating designs, reducing intensity while preserving quality. Use when the user mentions too bold, too loud, overwhelming, aggressive, garish, or wants a calmer, more refined aesthetic.

---

## Instructions & Playbook

Quiet design is harder than bold design. Subtlety needs precision. Reduce visual intensity in designs that are too loud, aggressive, or overstimulating without losing personality or making the result generic.

---

## Visitor mode

Persuade + Experience: "quieter" means more restrained palette, more whitespace, more typographic air. Drama is reduced, not eliminated; the POV stays intact.

Operate + Read: "quieter" means reducing visual noise. Fewer background accents, flatter cards, less color, less motion. The tool should disappear more completely into the task.

---

## Assess Current State

Analyze what makes the design feel too intense:

1. **Identify intensity sources**:
   - **Color saturation**: Overly bright or saturated colors
   - **Contrast extremes**: Too much high-contrast juxtaposition
   - **Visual weight**: Too many bold, heavy elements competing
   - **Animation excess**: Too much motion or overly dramatic effects
   - **Complexity**: Too many visual elements, patterns, or decorations
   - **Scale**: Everything is large and loud with no hierarchy

2. **Understand the context**:
   - What's the purpose? (Marketing vs tool vs reading experience)
   - Who's the audience? (Some contexts need energy)
   - What's working? (Don't throw away good ideas)
   - What's the core message? (Preserve what matters)

If any of these are unclear from the codebase, do not guess. Ask with Codex's structured user-input/question tool when available, or directly in chat if it is not, and wait for the answer before continuing.

"Quieter" means refined and easier on the eyes, not generic. Generic quiet looks like gray text on white, one sans at a uniform weight, and a grid of identical cards; restraint still needs a point of view.

## Plan Refinement

Create a strategy to reduce intensity while maintaining impact:

- **Color approach**: Desaturate or shift to more restrained tones?
- **Hierarchy approach**: Which elements should stay bold (very few), which should recede?
- **Simplification approach**: What can be removed entirely?
- **Sophistication approach**: How can we signal quality through restraint?

Subtlety requires precision. Quiet without intent collapses to generic.

## Refine the Design

Systematically reduce intensity across these dimensions:

### Color Refinement
- **Reduce saturation**: Shift from fully saturated to 70-85% saturation
- **Soften palette**: Replace bright colors with muted tones
- **Reduce color variety**: Use fewer colors more thoughtfully
- **Neutral dominance**: Let neutrals do more work, use color as accent (10% rule)
- **Gentler contrasts**: High contrast only where it matters most
- **Tinted grays**: Use warm or cool tinted grays instead of pure gray. Adds depth without loudness
- **Never gray on color**: If you have gray text on a colored background, use a darker shade of that color or transparency instead

### Visual Weight Reduction
- **Typography**: Reduce font weights (900 → 600, 700 → 500), decrease sizes where appropriate
- **Hierarchy through subtlety**: Use weight, size, and space instead of color and boldness
- **White space**: Increase breathing room, reduce density
- **Borders & lines**: Reduce thickness, decrease opacity, or remove entirely

### Simplification
- **Remove decorative elements**: Gradients, shadows, patterns, textures that don't serve purpose
- **Simplify shapes**: Reduce border radius extremes, simplify custom shapes
- **Reduce layering**: Flatten visual hierarchy where possible
- **Clean up effects**: Reduce or remove blur effects, glows, multiple shadows

### Motion Reduction
- **Reduce animation intensity**: Shorter distances (10-20px instead of 40px), gentler easing
- **Remove decorative animations**: Keep functional motion, remove flourishes
- **Subtle micro-interactions**: Replace dramatic effects with gentle feedback
- **Refined easing**: Use ease-out-quart for smooth, understated motion. Never bounce or elastic
- **Remove animations entirely** if they're not serving a clear purpose

### Composition Refinement
- **Reduce scale jumps**: Smaller contrast between sizes creates calmer feeling
- **Align to grid**: Bring rogue elements back into systematic alignment
- **Even out spacing**: Replace extreme spacing variations with consistent rhythm

**Avoid**:
- Make everything the same size/weight (hierarchy still matters)
- Remove all color (quiet ≠ grayscale)
- Eliminate all personality (maintain character through refinement)
- Sacrifice usability for aesthetics (functional elements still need clear affordances)
- Make everything small and light (some anchors needed)

## Verify Quality

Ensure refinement maintains quality:

- **Still functional**: Can users still accomplish tasks easily?
- **Still distinctive**: Does it have character, or is it generic now?
- **Better reading**: Is text easier to read for extended periods?
- **Restrained, not absent**: Does the POV survive the cuts?

When the result feels right, hand off to `$impeccable polish` for the final pass.


---

## CREED OS & WAY 2.1 Mandatory Alignment Contract
When applying `/quieter` within CREED OS, you MUST ALWAYS follow the **WAY 2.1 Master Design System**:
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
