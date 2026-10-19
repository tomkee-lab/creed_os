---
name: clarify
description: "Improve unclear UX copy, error messages, microcopy, labels, and instructions to make interfaces easier to understand. Use when the user mentions confusing text, unclear labels, bad error messages, hard-to-follow instructions, or wanting better UX writing."
metadata:
  argument-hint: "[target]"
user-invocable: true
---

<!-- impeccable-pinned-skill -->

# Impeccable: /clarify

> **Command Shortcut:** `/clarify` or `/impeccable clarify`  
> **Source:** [Impeccable Reference](file:///c:/learning/.agents/skills/impeccable/reference/clarify.md)  
> **Governance:** WAY 2.1 Calm Intelligence & 0/4/8 Architectural Radius System

## Description
Improve unclear UX copy, error messages, microcopy, labels, and instructions to make interfaces easier to understand. Use when the user mentions confusing text, unclear labels, bad error messages, hard-to-follow instructions, or wanting better UX writing.

---

## Instructions & Playbook

> **Additional context needed**: audience knowledge and emotional state.

Rewrite unclear interface text so users understand what happened, what matters, and what to do next. Preserve factual meaning, product terminology, and brand voice.

## Audit the language

Read the entire interaction path, not isolated strings. Identify:

- ambiguous nouns, verbs, and actions;
- internal jargon or assumed knowledge;
- vague labels, outcomes, and system states;
- missing consequences, recovery, or timing;
- inconsistent terminology and capitalization;
- redundant headings, intros, helper text, and confirmations;
- text that breaks at realistic widths or in translation;
- tone that ignores stress, risk, success, or urgency.

Infer audience and task from product context and surrounding UI. Ask before changing factual claims, legal meaning, or a term that may be domain-specific.

## Set the message hierarchy

For each state, decide:

1. the one fact the user needs now;
2. the action available next;
3. supporting context that changes the decision;
4. the appropriate tone for this moment.

Say each idea once. If the heading already explains the state, the introduction should add new information or disappear.

## Rewrite by function

### Actions and navigation

Use a specific verb and object when the outcome is not already obvious. Labels should describe what will happen, not the gesture used to trigger it. Keep the same noun and verb for the same concept throughout the product.

For destructive actions, name the object and consequence. Prefer undo over confirmation when recovery is safe. When confirmation is necessary, name the action on both the message and button instead of using `Yes`, `No`, `OK`, or `Submit`.

### Forms

Use persistent labels; placeholders are examples, not labels. Put format and eligibility requirements before submission. Explain why information is requested only when it is not obvious. Required and optional treatment should be consistent.

Validation says what needs attention and how to correct it without blaming the user. Keep related instructions near the field and announce errors accessibly.

### Errors and permissions

An actionable error answers:

1. what failed;
2. why, when known and useful;
3. how to recover or what alternative remains.

Do not expose internal codes as the primary message. Do not promise a cause or resolution the system cannot know. Treat privacy, payment, deletion, access loss, and blocked work seriously; warmth is welcome, jokes are not.

### Loading, empty, and success states

Loading text names the real operation and sets an honest expectation when the wait is meaningful. Show determinate progress when available; never invent progress.

An empty state distinguishes first use, no results, filters, permissions, and failure. Explain the state and provide the next useful action.

Success confirms the completed outcome and mentions the next consequence only when it changes what the user should do. Routine success should be brief.

### Help and instructional text

Helper text answers an implicit question instead of restating the control. Use progressive disclosure for uncommon detail. Link text must make sense out of context; icon-only controls need accessible names.

## Voice, accessibility, and localization

Voice stays consistent; tone adapts to the moment. Use plain language without flattening terminology the audience genuinely knows.

- Write complete translatable messages rather than concatenated fragments.
- Keep variables and numbers structured so translators can reorder them.
- Allow expansion instead of abbreviating prematurely.
- Make alt text convey the image's information; use empty alt for decoration.
- Keep screen-reader names aligned with visible labels and outcomes.
- Do not rely on punctuation, color, or iconography to carry the message alone.

Maintain a short terminology glossary when inconsistency spans the product. Do not vary words for literary effect in an interface.

## Verify

Read the flow in context and test:

- comprehension without hidden product knowledge;
- actionability at errors, empty states, and decision points;
- factual accuracy and consistent terminology;
- scanability at target widths and 200% zoom;
- long names, localization expansion, pluralization, and dynamic values;
- accessible names and announced state changes;
- tone appropriate to consequence and emotional context.

The final copy is as short as it can be without removing meaning or recovery.

When the language reads cleanly, hand off to `$impeccable polish` for the final pass.


---

## CREED OS & WAY 2.1 Mandatory Alignment Contract
When applying `/clarify` within CREED OS, you MUST ALWAYS follow the **WAY 2.1 Master Design System**:
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
