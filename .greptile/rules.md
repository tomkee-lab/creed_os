# CREED OS Code Review Rules & Architectural Invariants

Welcome to the CREED OS codebase review suite. These rules define the core architectural principles, security invariants, educational tenets, and design tokens that every pull request must satisfy.

---

## 1. Package Manager Enforcement (Strict `pnpm`)

- **Rule:** `pnpm` is the **only** permitted package manager in this monorepo.
- **Strictly Forbidden:** `npm`, `npx`, and `yarn` are prohibited across all scripts, documentation, workflows, and configurations.
- **Tool Execution:** Use `pnpm dlx <tool>` instead of `npx <tool>`.
- **Dependency Management:** Use `pnpm add`, `pnpm add -D`, and `pnpm install`.
- **Reviewer Action:** Flag any PR that introduces `package-lock.json`, `yarn.lock`, calls `npm`/`npx` in shell scripts or documentation, or modifies workspace configurations inappropriately.

---

## 2. Deterministic Psychometrics & Scoring Integrity

CREED OS adheres to the cardinal educational tenet: **Deterministic algorithms score; AI explains; humans decide.**

```typescript
// ✅ CORRECT: Deterministic 3PL IRT computation with Gauss-Hermite EAP quadrature
export function calculateAbilityEstimate(
  responses: readonly ItemResponse[],
  quadraturePoints: readonly QuadraturePoint[]
): AbilityEstimate {
  // Deterministic numerical integration
  return computeEAP(responses, quadraturePoints);
}

// ❌ WRONG: Delegating student scoring or ability estimate to an LLM
export async function scoreStudentWithLLM(responses: ItemResponse[]) {
  const result = await gemini.generateText({
    prompt: `Score this student's math proficiency from 0 to 100: ${JSON.stringify(responses)}`
  });
  return parseFloat(result.text); // STRICTLY FORBIDDEN
}
```

- Psychometric ability estimation must rely strictly on Item Response Theory (3PL IRT), Bayesian Knowledge Tracing (BKT), or deterministic rubrics.
- AI (Gemini / Claude / local models) may **only** be used for Socratic inquiry generation, pedagogical explanations, and developmental feedback narrative synthesis.
- Never assign fixed IQ scores, permanent intelligence labels, or irreversible career disqualifications.

---

## 3. Child Safety & DPDP Act Data Governance

Target audience includes minors aged 10–16 (Classes 5–10). Compliance with the Digital Personal Data Protection (DPDP) Act and international child protection regulations is non-negotiable.

### Parental Consent State Machine
- Minor data processing requires verified parental consent transition:
  `DRAFT` → `PARENT_INVITED` → `PARENT_CONSENT_PENDING` → `PARENT_CONSENTED` → `ACTIVE`.
- No profiling, automated ability classification, or recommendation tracking may be persisted without verified consent.

### Database Row Level Security (RLS)
- Every Supabase PostgreSQL table containing student data must have `ENABLE ROW LEVEL SECURITY`.
- RLS policies must be relationship-scoped (e.g., student can only read self; parent can read minor dependent with verified link; teacher can read active classroom cohort).
- Ephemeral AI prompts must strip personally identifiable information (PII). Model retention for training is strictly disabled (`data_sharing = false`).

---

## 4. Frontend Architecture: Svelte 5 Runes & Bits UI

The web application (`apps/web`) is built with SvelteKit 2 and Svelte 5.

```svelte
<!-- ✅ CORRECT: Svelte 5 Runes -->
<script lang="ts">
  interface Props {
    title: string;
    score?: number;
    onSelect?: (id: string) => void;
  }

  let { title, score = 0, onSelect }: Props = $props();
  let isHovered = $state(false);
  let formattedScore = $derived(`${Math.round(score * 100)}%`);
</script>

<!-- ❌ WRONG: Legacy Svelte 4 Syntax -->
<script lang="ts">
  export let title: string; // Forbidden in Svelte 5
  export let score: number = 0;
  let isHovered = false;
  $: formattedScore = `${Math.round(score * 100)}%`; // Forbidden in Svelte 5
</script>
```

- Use headless primitives from Bits UI and custom styled shadcn-svelte components.
- All interactive components must handle all states: default, hover, active, focus-visible, disabled, and loading.

---

## 5. WAY Design System & "No AI Slope" Governance

- **Zero Rounded Corners:** All container boxes, cards, inputs, and buttons use square corners (`rounded-none`). No pill buttons, no bubbly curves.
- **Semantic OKLCH Tokens:** Use only `--surface-canvas`, `--surface-raised`, `--text-primary`, `--accent-cyan`, `--border-subtle`, etc. Ad-hoc hex values (`#03080E`, `#38bdf8`) are forbidden in component classes.
- **No Neon Borders:** Avoid cyber-neon glows and loud colored outlines. Use Nordic Lagom warm mineral surfaces in light mode and deep carbon in dark mode.
- **Strict 8pt Spacing Rhythm:** Spacing must be multiples of 4px/8px (4, 8, 12, 16, 24, 32, 40, 48, 64px). Arbitrary pixel padding (e.g., `p-[13px]`, `gap-[19px]`) is forbidden.
- **No Card Soup:** Do not wrap every single stat in an individual bordered card. Use clean typographic hierarchy and whitespace.

---

## 6. Effect Domain Pipelines & Functional Error Handling

In `packages/domain` and `packages/assessment`, complex business logic, consent state transitions, and validation pipelines must use **Effect**.

```typescript
// ✅ CORRECT: Composable Effect workflow with TaggedError
export class ConsentNotFoundError extends Data.TaggedError("ConsentNotFoundError")<{
  readonly studentId: string;
}> {}

export const verifyParentalConsent = (studentId: string) =>
  Effect.gen(function* () {
    const record = yield* getConsentRecord(studentId);
    if (!record) {
      return yield* Effect.fail(new ConsentNotFoundError({ studentId }));
    }
    return record.status === "PARENT_CONSENTED";
  });
```

- Avoid untyped `try-catch` blocks that throw raw errors or swallow exceptions.
- Model failure modes explicitly with tagged error unions.
