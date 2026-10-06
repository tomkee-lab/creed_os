# Web Application & WAY Design System Review Rules

## 1. Svelte 5 Component Authoring
- Components must use `<script lang="ts">` with typed props:
  ```svelte
  <script lang="ts">
    interface Props {
      title: string;
      value?: string;
      children?: import('svelte').Snippet;
    }

    let { title, value, children }: Props = $props();
  </script>
  ```
- Use `$derived(...)` for computations derived from state or props.
- Use `$effect(...)` only for DOM side effects (measuring, canvas, timers). Never use `$effect` for state synchronizations that can be expressed as `$derived`.

## 2. WAY Design System Rules
- **No Curves:** Default border radius is 0. Containers use `border border-[var(--border-subtle)]` and `rounded-none`.
- **Palette Discipline:**
  - Backgrounds: `bg-[var(--surface-canvas)]`, `bg-[var(--surface-raised)]`, `bg-[var(--surface-overlay)]`
  - Text: `text-[var(--text-primary)]`, `text-[var(--text-secondary)]`, `text-[var(--text-muted)]`
  - Accents: `text-[var(--accent-cyan)]`, `border-[var(--accent-cyan)]`
- **8pt Grid:** Use spacing steps: `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px), `gap-4` (16px). Avoid arbitrary pixel utility classes like `p-[17px]`.

## 3. Human-First Vocabulary
- In Student and Parent journeys, translate latent ability ($\theta$) into developmental progression levels (e.g. "Emerging", "Practicing", "Mastering", "Leading").
- Never show raw mathematical symbols $\theta \pm 1.96 \cdot SE$ to families.
