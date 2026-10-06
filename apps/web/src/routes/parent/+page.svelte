<script lang="ts">
  import {
    Shield,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Users,
    TrendingUp,
    HeartHandshake,
    Calendar,
    Layers,
    Lock,
    Sparkles,
    BookOpen
  } from 'lucide-svelte';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);

  let selectedTab = $state<'overview' | 'alignment' | 'evidence'>('overview');
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <!-- Parent Portal Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <Shield class="w-6 h-6 text-(--accent-indigo)" />
        <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
          Parent Alignment & Growth Guide
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Transparent evidence, calm growth tracking, and shared pathway navigation for <strong class="text-(--text-primary)">{learner.fullName}</strong>.
      </p>
    </div>

    <!-- Verified Consent Badge (DPDP Act) -->
    <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-(--accent-success-subtle) text-(--accent-success) text-xs font-medium border border-(--border-subtle)">
      <Lock class="w-3.5 h-3.5" />
      <span>DPDP Verified Guardian</span>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="flex items-center gap-2 border-b border-(--border-subtle) pb-2">
    <button
      type="button"
      onclick={() => (selectedTab = 'overview')}
      class="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer {selectedTab === 'overview' ? 'bg-(--surface-sunken) text-(--accent-primary) font-semibold' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
    >
      Development Overview
    </button>
    <button
      type="button"
      onclick={() => (selectedTab = 'alignment')}
      class="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer {selectedTab === 'alignment' ? 'bg-(--surface-sunken) text-(--accent-primary) font-semibold' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
    >
      Family Pathway Alignment
    </button>
    <button
      type="button"
      onclick={() => (selectedTab = 'evidence')}
      class="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer {selectedTab === 'evidence' ? 'bg-(--surface-sunken) text-(--accent-primary) font-semibold' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
    >
      Verified Evidence Trail ({evidence.length})
    </button>
  </div>

  {#if selectedTab === 'overview'}
    <!-- Four Essential Questions (Clean, Humane, Non-Stigmatizing) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 1. What is Anaya excelling in? -->
      <div class="surface-card p-6 space-y-4">
        <div class="flex items-center gap-2 text-(--accent-success) font-semibold text-sm">
          <CheckCircle2 class="w-4 h-4" />
          <span>1. Demonstrated Strengths</span>
        </div>
        <div class="space-y-3">
          <div class="p-4 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <strong class="text-(--text-primary) text-sm">Spatial Visualization & 3D Thinking</strong>
              <span class="font-semibold text-(--accent-success)">Advanced Capability</span>
            </div>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              Anaya excels at mentally rotating three-dimensional shapes, interpreting isometric projections, and designing structural geometries.
            </p>
          </div>

          <div class="p-4 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <strong class="text-(--text-primary) text-sm">Computational Problem Decomposition</strong>
              <span class="font-semibold text-(--accent-success)">Advanced Capability</span>
            </div>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              She systematically breaks down complex challenges into step-by-step logic loops and patterns without feeling overwhelmed.
            </p>
          </div>
        </div>
      </div>

      <!-- 2. Where are the current growth areas? -->
      <div class="surface-card p-6 space-y-4">
        <div class="flex items-center gap-2 text-(--accent-warning) font-semibold text-sm">
          <AlertCircle class="w-4 h-4" />
          <span>2. Current Foundation Gaps (Not Blockers!)</span>
        </div>
        <div class="p-4 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-2">
          <div class="flex items-center justify-between text-xs">
            <strong class="text-(--text-primary) text-sm">Quantitative Balancing & Rates</strong>
            <span class="font-semibold text-(--accent-warning)">Developing Foundation</span>
          </div>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            The diagnostic identified that Anaya occasionally transposes positive and negative signs when isolating multi-variable terms on balance scales. This is a common Class 8 algebra concept, completely remediable with structured practice.
          </p>
        </div>
      </div>

      <!-- 3. What concrete evidence was observed? -->
      <div class="surface-card p-6 space-y-4">
        <div class="flex items-center gap-2 text-(--accent-primary) font-semibold text-sm">
          <Layers class="w-4 h-4" />
          <span>3. What Concrete Evidence Was Observed?</span>
        </div>
        <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
          Over the past 30 days, the platform recorded <strong>4 verified evidence records</strong>:
          adaptive diagnostic checks, teacher classroom observations by Mr. Sharma, and a completed bridge engineering challenge.
        </p>
        <button
          onclick={() => (selectedTab = 'evidence')}
          class="text-xs text-(--accent-primary) font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Inspect individual evidence records & provenance →</span>
        </button>
      </div>

      <!-- 4. What should we do next? -->
      <div class="surface-card p-6 space-y-4">
        <div class="flex items-center gap-2 text-(--accent-indigo) font-semibold text-sm">
          <TrendingUp class="w-4 h-4" />
          <span>4. Recommended Next Action</span>
        </div>
        <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
          Enroll Anaya in the <strong>4-Week Proportional Foundations Sprint</strong> (20 minutes, 3 days/week). Have her attempt the Autonomous Rover Sensor Trial after two weeks.
        </p>
        <div class="p-3 bg-(--surface-sunken) border border-(--border-subtle) rounded-lg text-xs text-(--text-primary)">
          <strong>Review Milestone:</strong> Revisit pathway readiness after the rover mission is completed on November 15.
        </div>
      </div>
    </div>
  {:else if selectedTab === 'alignment'}
    <!-- Family Pathway Alignment -->
    <div class="surface-card p-6 space-y-6">
      <div class="flex items-center gap-2">
        <HeartHandshake class="w-5 h-5 text-(--accent-indigo)" />
        <h2 class="text-xl font-bold text-(--text-primary)">Family Pathway Dialogue & Alignment</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-5 rounded-xl surface-card border border-(--border-subtle) space-y-2">
          <span class="text-xs font-semibold uppercase text-(--text-muted)">Parent Career Aspiration</span>
          <h3 class="text-base font-bold text-(--text-primary)">Robotics & Mechatronics Engineering</h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            "We want Anaya to build a strong foundation in high-growth engineering fields with broad future opportunities."
          </p>
        </div>

        <div class="p-5 rounded-xl surface-card border border-(--border-subtle) space-y-2">
          <span class="text-xs font-semibold uppercase text-(--accent-primary)">Student Demonstrated Passion</span>
          <h3 class="text-base font-bold text-(--text-primary)">Interactive 3D Design & Computational Media</h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            "I love designing spatial structures and writing logic loops that simulate real things."
          </p>
        </div>
      </div>

      <!-- Evidence-Backed Consensus (No conflict, constructive synergy) -->
      <div class="p-5 rounded-xl border border-(--border-subtle) bg-(--surface-sunken) space-y-3">
        <div class="flex items-center gap-2 text-sm font-bold text-(--text-primary)">
          <Sparkles class="w-4 h-4 text-(--accent-indigo)" />
          <span>Platform Consensus Analysis</span>
        </div>
        <p class="text-xs text-(--text-secondary) leading-relaxed">
          Both parent and student goals share high spatial visualization and computational thinking. The single development focus is foundational quantitative balancing.
        </p>
        <div class="pt-2 border-t border-(--border-subtle) text-xs text-(--text-primary)">
          <strong>Agreed Action:</strong> Avoid forcing an immediate stream decision. Complete the 2 Try-Before-You-Choose project missions together. If Anaya enjoys the hardware robotics trial and completes the math sprint, both pathways remain wide open.
        </div>
      </div>
    </div>
  {:else if selectedTab === 'evidence'}
    <!-- Verifiable Evidence Stream -->
    <div class="surface-card p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-(--border-subtle) pb-3">
        <div>
          <h2 class="text-lg font-bold text-(--text-primary)">Verifiable Learner Evidence Records</h2>
          <p class="text-xs text-(--text-muted)">Tamper-evident diagnostic and classroom observations.</p>
        </div>
        <span class="text-xs font-medium text-(--accent-success)">DPDP Protected</span>
      </div>

      <div class="space-y-3">
        {#each evidence as item}
          <div class="p-4 rounded-xl surface-card border border-(--border-subtle) space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-(--text-primary)">
                {item.sourceTitle}
              </span>
              <span class="font-semibold text-(--accent-success)">
                {Math.round(item.confidence * 100)}% Confidence
              </span>
            </div>
            <p class="text-(--text-secondary) leading-relaxed">{item.summary}</p>
            <div class="text-[11px] text-(--text-muted) pt-1 border-t border-(--border-subtle) flex items-center justify-between">
              <span>Type: {item.sourceType.replace('_', ' ')}</span>
              <span>Observed: {new Date(item.observedAt).toLocaleDateString()}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
