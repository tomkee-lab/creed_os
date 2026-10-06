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
    BookOpen,
    HelpCircle,
    ChevronDown,
    ChevronUp
  } from 'lucide-svelte';
  import { MasterySunburst, GrowthTrajectoryTimeline, IllustrationFrame } from '$lib/components';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);

  let selectedTab = $state<'overview' | 'alignment' | 'evidence'>('overview');
  let showEvidenceDetails = $state(false);
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <!-- 1. PARENT PORTAL HEADER: Reassurance & Ephemeral Consent Gating -->
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <Shield class="w-6 h-6 text-(--accent-indigo)" />
        <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
          Parent Alignment & Growth Guide
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Calm growth tracking and shared pathway navigation for <strong class="text-(--text-primary)">{learner.fullName}</strong>.
      </p>
    </div>

    <!-- Calm Consent Verification Status -->
    <div class="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-(--accent-success-subtle) text-(--accent-success) text-xs font-medium border border-(--border-subtle)">
      <Lock class="w-3.5 h-3.5" />
      <span>Parental Consent Verified</span>
    </div>
  </header>

  <!-- 2. NAVIGATION TABS (4px Radius) -->
  <nav class="flex items-center gap-2 border-b border-(--border-subtle) pb-2">
    <button
      type="button"
      onclick={() => (selectedTab = 'overview')}
      class="px-4 py-2 rounded-sm text-xs sm:text-sm font-medium transition-colors cursor-pointer {selectedTab === 'overview' ? 'bg-(--surface-sunken) text-(--accent-primary) font-semibold border border-(--border-subtle)' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
    >
      Development Overview
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
      Verified Evidence Trail ({evidence.length})
    </button>
  </nav>

  {#if selectedTab === 'overview'}
    <!-- 3. REASSURANCE BANNER: Answer 5 Questions in Under 20 Seconds -->
    <section class="surface-card rounded-sm p-6 sm:p-8 border-l-4 border-l-(--accent-success) space-y-4 border border-(--border-subtle)">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-success)">
          At a Glance Summary
        </span>
        <span class="text-xs text-(--text-muted)">Updated this week</span>
      </div>
      <h2 class="text-xl sm:text-2xl font-bold text-(--text-primary)">
        Anaya is developing well and building strong technical confidence.
      </h2>
      <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed max-w-3xl">
        She consistently demonstrates advanced spatial visualization and computational logic. Her active learning sprint focuses on foundational proportional equations, which unlocks higher readiness for future robotics engineering pathways.
      </p>
    </section>

    <!-- 4. WHAT WE SEE, WHAT WE'RE DOING, HOW YOU CAN HELP -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- What We're Seeing -->
      <div class="surface-card rounded-sm p-6 space-y-4 border border-(--border-subtle) flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-(--accent-success) font-semibold text-sm">
            <CheckCircle2 class="w-4 h-4" />
            <span>What We're Seeing</span>
          </div>

          <div class="space-y-2.5">
            <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
              <span class="text-[10px] uppercase font-semibold text-(--accent-success) block">Strongest Area</span>
              <p class="font-bold text-xs sm:text-sm text-(--text-primary)">Spatial Visualization & 3D Thinking</p>
              <p class="text-xs text-(--text-secondary)">Exceptional skill with isometric models and physical linkages.</p>
            </div>

            <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
              <span class="text-[10px] uppercase font-semibold text-(--accent-warning) block">Growing Area</span>
              <p class="font-bold text-xs sm:text-sm text-(--text-primary)">Quantitative Balancing & Rates</p>
              <p class="text-xs text-(--text-secondary)">Common algebra step; improving steadily through guided practice.</p>
            </div>
          </div>
        </div>

        <button
          onclick={() => (selectedTab = 'evidence')}
          class="text-xs text-(--accent-primary) font-medium hover:underline pt-2 flex items-center gap-1 cursor-pointer"
        >
          <span>View 4 verified evidence items →</span>
        </button>
      </div>

      <!-- What We're Doing -->
      <div class="surface-card rounded-sm p-6 space-y-4 border border-(--border-subtle) flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-(--accent-indigo) font-semibold text-sm">
            <TrendingUp class="w-4 h-4" />
            <span>What We're Doing</span>
          </div>

          <div class="space-y-2.5">
            <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
              <span class="text-[10px] uppercase font-semibold text-(--accent-indigo) block">Active Support</span>
              <p class="font-bold text-xs sm:text-sm text-(--text-primary)">4-Week Proportional Sprint</p>
              <p class="text-xs text-(--text-secondary)">20-minute low-stress micro-challenges 3 days/week with Socratic guidance.</p>
            </div>

            <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
              <span class="text-[10px] uppercase font-semibold text-(--text-muted) block">Upcoming Milestone</span>
              <p class="font-bold text-xs sm:text-sm text-(--text-primary)">Autonomous Rover Mission</p>
              <p class="text-xs text-(--text-secondary)">Applying proportional gear ratios in a physical robotics simulation.</p>
            </div>
          </div>
        </div>

        <div class="text-[11px] text-(--text-muted) pt-2 border-t border-(--border-subtle)">
          Next progress update: Nov 15
        </div>
      </div>

      <!-- What You Can Do (Actionable Parent Advice) -->
      <div class="surface-card rounded-sm p-6 space-y-4 border border-(--border-subtle) flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-(--accent-primary) font-semibold text-sm">
            <HeartHandshake class="w-4 h-4" />
            <span>What You Can Do at Home</span>
          </div>

          <div class="space-y-2.5">
            <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
              <span class="text-[10px] uppercase font-semibold text-(--accent-primary) block">Home Challenge</span>
              <p class="font-bold text-xs sm:text-sm text-(--text-primary)">Build a Kitchen Scale Balance</p>
              <p class="text-xs text-(--text-secondary)">Explore real-world ratios with lever arms and weights together.</p>
            </div>

            <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
              <span class="text-[10px] uppercase font-semibold text-(--text-muted) block">Parenting Strategy</span>
              <p class="font-bold text-xs sm:text-sm text-(--text-primary)">Praise Problem Decomposition</p>
              <p class="text-xs text-(--text-secondary)">Notice how she breaks down hard problems rather than speed of answering.</p>
            </div>
          </div>
        </div>

        <button
          onclick={() => (selectedTab = 'alignment')}
          class="text-xs text-(--accent-primary) font-medium hover:underline pt-2 flex items-center gap-1 cursor-pointer"
        >
          <span>Explore family pathway alignment →</span>
        </button>
      </div>
    </section>

    <!-- 5. PROGRESSIVE DISCLOSURE: DETAILED CAPABILITY ORBIT MAP -->
    <section class="space-y-4">
      <div class="flex items-baseline justify-between border-b border-(--border-subtle) pb-2">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-(--text-primary)">
            Developmental Capability Map
          </h2>
          <p class="text-xs text-(--text-muted)">
            Holistic snapshot of {learner.fullName}'s cognitive, inquiry, and metacognitive growth.
          </p>
        </div>
        <span class="text-xs font-medium text-(--text-secondary)">
          Verified Longitudinal State
        </span>
      </div>
      <MasterySunburst />
    </section>

  {:else if selectedTab === 'alignment'}
    <!-- Family Pathway Alignment -->
    <div class="surface-card rounded-sm p-6 sm:p-8 space-y-6 border border-(--border-subtle)">
      <!-- Editorial Mixed-Media Fine Art Banner (8px expressive radius) -->
      <IllustrationFrame
        src="/images/illustrations/parent_horizon.jpg"
        alt="Asian father and daughter smiling together reviewing pathway portfolio at sunlit home study desk"
        aspectRatio="16:9"
        badge="Family Consensus Studio"
        caption="Shared Horizons • Harmonizing parent aspirations and student passion through evidence-backed mini-missions."
        credit="CREED OS • Verified Guardian Dialogue"
      />

      <div class="flex items-center gap-2 pt-2">
        <HeartHandshake class="w-5 h-5 text-(--accent-indigo)" />
        <h2 class="text-xl font-bold text-(--text-primary)">Family Pathway Dialogue & Alignment</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-5 rounded-sm surface-card border border-(--border-subtle) space-y-2">
          <span class="text-xs font-semibold uppercase text-(--text-muted)">Parent Career Aspiration</span>
          <h3 class="text-base font-bold text-(--text-primary)">Robotics & Mechatronics Engineering</h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            "We want Anaya to build a strong foundation in high-growth engineering fields with broad future opportunities."
          </p>
        </div>

        <div class="p-5 rounded-sm surface-card border border-(--border-subtle) space-y-2">
          <span class="text-xs font-semibold uppercase text-(--accent-primary)">Student Demonstrated Passion</span>
          <h3 class="text-base font-bold text-(--text-primary)">Interactive 3D Design & Computational Media</h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            "I love designing spatial structures and writing logic loops that simulate real things."
          </p>
        </div>
      </div>

      <!-- Evidence-Backed Consensus -->
      <div class="p-5 rounded-sm border border-(--border-subtle) bg-(--surface-sunken) space-y-3">
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
    <!-- Longitudinal Growth Trajectory Timeline -->
    <GrowthTrajectoryTimeline />

    <!-- Verifiable Evidence Stream (Qualitative Rigor & Audit Trail) -->
    <div class="surface-card rounded-sm p-6 space-y-4 border border-(--border-subtle)">
      <div class="flex items-center justify-between border-b border-(--border-subtle) pb-3">
        <div>
          <h2 class="text-lg font-bold text-(--text-primary)">Verifiable Learner Evidence Records</h2>
          <p class="text-xs text-(--text-muted)">Tamper-evident diagnostic and classroom observations.</p>
        </div>
        <span class="text-xs font-medium text-(--accent-success)">Consent Protected</span>
      </div>

      <div class="space-y-3">
        {#each evidence as item}
          <div class="p-4 rounded-sm surface-card border border-(--border-subtle) space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="font-bold text-(--text-primary)">
                {item.sourceTitle}
              </span>
              <span class="font-semibold text-(--accent-success)">
                Teacher Verified
              </span>
            </div>
            <p class="text-(--text-secondary) leading-relaxed">{item.summary}</p>
            <div class="text-[11px] text-(--text-muted) pt-1 border-t border-(--border-subtle) flex items-center justify-between">
              <span>Domain: {item.competency.replace('_', ' ')}</span>
              <span>Observed: {new Date(item.observedAt).toLocaleDateString()}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
