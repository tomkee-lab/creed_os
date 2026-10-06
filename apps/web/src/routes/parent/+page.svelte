<script lang="ts">
  import {
    Shield,
    CheckCircle2,
    Lock,
    Sparkles,
    ChevronDown,
    ChevronUp,
    HeartHandshake,
    ArrowRight,
    TrendingUp,
    FileText,
    Printer
  } from 'lucide-svelte';
  import {
    MasterySunburst,
    GrowthTrajectoryTimeline,
    IllustrationFrame,
    WaySection,
    EvidenceDisclosure
  } from '$lib/components';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);

  let selectedTab = $state<'overview' | 'alignment' | 'evidence'>('overview');
  let showOrbitMap = $state(false);
</script>

<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- 1. HEADER: How is Anaya doing? -->
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-success)">
          Learner Growth Guide
        </span>
        <span class="text-xs text-(--text-muted)">•</span>
        <span class="text-xs text-(--text-secondary)">{learner.schoolName}</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
        How is {learner.fullName.split(' ')[0]} doing?
      </h1>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        {learner.fullName.split(' ')[0]} is developing well, on track, and building strong technical confidence.
      </p>
    </div>

    <!-- Verified Consent Protection -->
    <div class="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-(--surface-sunken) text-(--text-secondary) text-xs font-medium border border-(--border-subtle) self-start sm:self-auto">
      <Lock class="w-3.5 h-3.5 text-(--accent-success)" />
      <span>Parental Consent Active</span>
    </div>
  </header>

  <!-- 2. NAVIGATION TABS (4px radius, clean active indicator) -->
  <nav class="flex items-center gap-2 border-b border-(--border-subtle) pb-2">
    <button
      type="button"
      onclick={() => (selectedTab = 'overview')}
      class="px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-colors cursor-pointer {selectedTab === 'overview' ? 'bg-(--surface-sunken) text-(--accent-primary) font-semibold border border-(--border-subtle)' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
    >
      Overview
    </button>
    <button
      type="button"
      onclick={() => (selectedTab = 'alignment')}
      class="px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-colors cursor-pointer {selectedTab === 'alignment' ? 'bg-(--surface-sunken) text-(--accent-primary) font-semibold border border-(--border-subtle)' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
    >
      Family Pathway Alignment
    </button>
    <button
      type="button"
      onclick={() => (selectedTab = 'evidence')}
      class="px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-colors cursor-pointer {selectedTab === 'evidence' ? 'bg-(--surface-sunken) text-(--accent-primary) font-semibold border border-(--border-subtle)' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
    >
      Evidence Trail ({evidence.length})
    </button>
  </nav>

  {#if selectedTab === 'overview'}
    <!-- 3. REASSURANCE SUMMARY (Understand in <= 10 seconds) -->
    <div class="surface-card rounded-sm p-6 sm:p-7 border-l-4 border-l-(--accent-success) space-y-2 border border-(--border-subtle)">
      <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-success) block">
        Current Status
      </span>
      <h2 class="text-lg sm:text-xl font-bold text-(--text-primary)">
        Strong foundational progress in spatial and computational thinking.
      </h2>
      <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
        She consistently excels in 3D visualization and kinematic modeling. Her current focus sprint is proportional equations, which unlocks advanced robotics pathways.
      </p>
    </div>

    <!-- 4. FOUR PILLARS: Strengths, Growing, What We're Doing, How You Can Help -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-2">
        <span class="text-[10px] uppercase font-semibold text-(--accent-success) block">Strengths</span>
        <h3 class="font-bold text-sm text-(--text-primary)">Spatial Reasoning</h3>
        <p class="text-xs text-(--text-secondary) leading-relaxed">
          Advanced 3D modeling and mechanical linkage visualization.
        </p>
      </div>

      <div class="p-5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-2">
        <span class="text-[10px] uppercase font-semibold text-(--accent-warning) block">Growing</span>
        <h3 class="font-bold text-sm text-(--text-primary)">Proportional Rates</h3>
        <p class="text-xs text-(--text-secondary) leading-relaxed">
          Normal developmental algebra step; improving steadily with practice.
        </p>
      </div>

      <div class="p-5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-2">
        <span class="text-[10px] uppercase font-semibold text-(--accent-indigo) block">What We're Doing</span>
        <h3 class="font-bold text-sm text-(--text-primary)">20-min Sprints</h3>
        <p class="text-xs text-(--text-secondary) leading-relaxed">
          Low-stress micro-challenges 3 days/week with Socratic guidance.
        </p>
      </div>

      <div class="p-5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-2">
        <span class="text-[10px] uppercase font-semibold text-(--accent-primary) block">How You Can Help</span>
        <h3 class="font-bold text-sm text-(--text-primary)">Real-World Balance</h3>
        <p class="text-xs text-(--text-secondary) leading-relaxed">
          Explore gear ratios and kitchen scales together at home.
        </p>
      </div>
    </div>

    <!-- 5. PROGRESSIVE DISCLOSURE: Developmental Map -->
    <div class="pt-2">
      <div class="flex items-center justify-between pb-3 border-b border-(--border-subtle)">
        <h3 class="text-sm font-bold text-(--text-primary)">
          Holistic Developmental Capability Map
        </h3>
        <button
          type="button"
          onclick={() => (showOrbitMap = !showOrbitMap)}
          class="text-xs font-medium text-(--accent-primary) hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{showOrbitMap ? 'Hide map' : 'Inspect developmental map'}</span>
          {#if showOrbitMap}
            <ChevronUp class="w-3.5 h-3.5" />
          {:else}
            <ChevronDown class="w-3.5 h-3.5" />
          {/if}
        </button>
      </div>

      {#if showOrbitMap}
        <div class="pt-4 animate-in fade-in duration-200">
          <MasterySunburst />
        </div>
      {/if}
    </div>

  {:else if selectedTab === 'alignment'}
    <!-- 6. FLAGSHIP EXPERIENCE: FAMILY PATHWAY ALIGNMENT (Conversational & Human) -->
    <div class="space-y-6">
      <IllustrationFrame
        src="/images/illustrations/parent_horizon.jpg"
        alt="Asian parent and daughter smiling together reviewing pathway portfolio at sunlit home study desk"
        aspectRatio="16:9"
        badge="Family Dialogue"
        caption="Shared Horizons • Harmonizing parent aspirations and student passion through shared experiments."
        credit="Verified Guardian Dialogue Record"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="p-5 rounded-sm surface-card border border-(--border-subtle) space-y-1">
          <span class="text-[10px] font-semibold uppercase text-(--text-muted) block">You're Hoping For</span>
          <h3 class="text-base font-bold text-(--text-primary)">Robotics & Automation</h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            Broad opportunities and rigorous engineering foundation.
          </p>
        </div>

        <div class="p-5 rounded-sm surface-card border border-(--border-subtle) space-y-1">
          <span class="text-[10px] font-semibold uppercase text-(--accent-primary) block">Your Child Is Excited By</span>
          <h3 class="text-base font-bold text-(--text-primary)">3D Design & Simulation</h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            Creating mechanical structures and physical simulations.
          </p>
        </div>
      </div>

      <div class="p-5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-3">
        <div class="flex items-center gap-2 text-xs font-semibold text-(--accent-indigo)">
          <Sparkles class="w-3.5 h-3.5" />
          <span>What They Have In Common</span>
        </div>
        <p class="text-xs sm:text-sm text-(--text-primary) font-medium">
          Both pathways rely heavily on Spatial Thinking and Computational Reasoning.
        </p>

        <div class="pt-2 border-t border-(--border-subtle) flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="text-xs text-(--text-secondary)">
            <strong class="text-(--text-primary)">Next Experiment:</strong> Build a small autonomous rover linkage together.
          </div>
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onclick={() => window.print()}
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm surface-card hover:bg-(--surface-raised) text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors border border-(--border-subtle) cursor-pointer"
              title="Print or save as PDF for offline family discussion"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>Export Family Dialogue Card</span>
            </button>
            <a
              href="/student/pathways"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs transition-all shadow-sm cursor-pointer"
            >
              <span>Explore Mission Together</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>

  {:else if selectedTab === 'evidence'}
    <!-- 7. EVIDENCE DISCLOSURE -->
    <div class="space-y-6">
      <GrowthTrajectoryTimeline />

      <EvidenceDisclosure
        title="Verified Demonstration Records"
        evidenceStrength="Consent Verified & Tamper-Evident"
        records={evidence}
      />
    </div>
  {/if}
</div>
