<script lang="ts">
  import WorkspaceHeader from '$lib/components/shell/WorkspaceHeader.svelte';
  import WaySection from '$lib/components/WaySection.svelte';
  import Button from '$lib/components/Button.svelte';
  import { Compass, BookOpen, BrainCircuit, Shield, HelpCircle, ArrowRight, ExternalLink } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Help & Documentation — CREED OS</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-8">
  <WorkspaceHeader
    title="Documentation & Guidance"
    description="Foundational principles, psychometric methodologies, and platform operating manuals."
  >
    {#snippet actions()}
      <Button variant="outline" size="sm" href="/student/mentor">
        <BrainCircuit class="w-3.5 h-3.5 mr-1 text-ai" />
        Ask Socratic Guide
      </Button>
    {/snippet}
  </WorkspaceHeader>

  <!-- Section 1: The WAY 3.0 Quiet Editorial Philosophy -->
  <WaySection
    eyebrow="DESIGN PHILOSOPHY"
    title="Quiet Editorial Intelligence"
    subtitle="The foundational ergonomic grammar governing every surface in CREED OS."
  >
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 bg-surface-raised border border-border rounded-sm space-y-2">
        <div class="text-xs font-semibold text-brand">Level 1: Signal</div>
        <h3 class="text-sm font-semibold text-ink">What You Must Notice First</h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Primary action primacy on every screen. No metric walls or card soup competing for cognitive bandwidth.
        </p>
      </div>

      <div class="p-5 bg-surface-raised border border-border rounded-sm space-y-2">
        <div class="text-xs font-semibold text-ai">Level 2: Context</div>
        <h3 class="text-sm font-semibold text-ink">Why It Matters</h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          One concise sentence maximum explaining relevance and pedagogical significance to the learner.
        </p>
      </div>

      <div class="p-5 bg-surface-raised border border-border rounded-sm space-y-2">
        <div class="text-xs font-semibold text-positive">Level 3: Evidence</div>
        <h3 class="text-sm font-semibold text-ink">Tangible Provenance</h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Deep diagnostic details, rubrics, and calibration telemetry disclosed progressively on request.
        </p>
      </div>
    </div>
  </WaySection>

  <!-- Section 2: Core Educational Principles -->
  <WaySection
    eyebrow="METHODOLOGY"
    title="Psychometric & Pedagogical Foundations"
    subtitle="Deterministic algorithms, growth mindset, and developmental trajectories."
  >
    <div class="p-6 bg-surface-raised border border-border rounded-sm space-y-4 text-xs text-ink-secondary">
      <div class="space-y-1">
        <h4 class="font-semibold text-ink text-sm">Deterministic Scoring Isolation</h4>
        <p class="leading-relaxed">
          Scores and latent ability estimates are computed exclusively via mathematical item response theory (3PL CAT IRT) and Bayesian Knowledge Tracing (BKT). Unconstrained generative LLMs are never permitted to score learners or assign ability classifications.
        </p>
      </div>

      <div class="pt-3 border-t border-border space-y-1">
        <h4 class="font-semibold text-ink text-sm">Growth Before Labeling</h4>
        <p class="leading-relaxed">
          CREED OS never outputs fixed IQ scores, deterministic career exclusions, or false precision percentages (e.g. "74% fit"). All capabilities are framed as developmental horizons and observable competencies.
        </p>
      </div>

      <div class="pt-3 border-t border-border space-y-1">
        <h4 class="font-semibold text-ink text-sm">Evidence Before Inference</h4>
        <p class="leading-relaxed">
          Every assertion in a learner's profile maps to validated assessment artifacts, interactive simulation telemetry, or verified project evidence.
        </p>
      </div>
    </div>
  </WaySection>

  <!-- Section 3: Keyboard Shortcuts & Quick Navigation -->
  <WaySection
    eyebrow="POWER FEATURES"
    title="Workspace Keyboard Shortcuts"
    subtitle="Navigate fluently without leaving the keyboard."
  >
    <div class="p-6 bg-surface-raised border border-border rounded-sm">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div class="flex items-center justify-between p-2 rounded-sm bg-surface-subtle border border-border">
          <span class="text-ink">Open Command Palette</span>
          <kbd class="px-2 py-0.5 rounded-sm bg-surface border border-border font-mono text-[11px] text-ink font-semibold">⌘K / Ctrl+K</kbd>
        </div>
        <div class="flex items-center justify-between p-2 rounded-sm bg-surface-subtle border border-border">
          <span class="text-ink">Dismiss Modal / Inspector</span>
          <kbd class="px-2 py-0.5 rounded-sm bg-surface border border-border font-mono text-[11px] text-ink font-semibold">Escape</kbd>
        </div>
        <div class="flex items-center justify-between p-2 rounded-sm bg-surface-subtle border border-border">
          <span class="text-ink">Next Interactive Question</span>
          <kbd class="px-2 py-0.5 rounded-sm bg-surface border border-border font-mono text-[11px] text-ink font-semibold">Enter</kbd>
        </div>
        <div class="flex items-center justify-between p-2 rounded-sm bg-surface-subtle border border-border">
          <span class="text-ink">Toggle Left Sidebar</span>
          <kbd class="px-2 py-0.5 rounded-sm bg-surface border border-border font-mono text-[11px] text-ink font-semibold">⌘B / Ctrl+B</kbd>
        </div>
      </div>
    </div>
  </WaySection>
</div>
