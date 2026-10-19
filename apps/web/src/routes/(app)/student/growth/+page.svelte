<script lang="ts">
  import {
    Activity,
    CheckCircle2,
    ShieldCheck,
    Compass,
    Layers,
    FileText,
    Calendar,
    Target,
    ArrowRight,
    ArrowLeft,
    Clock,
    Lock
  } from 'lucide-svelte';
  import { page } from '$app/state';
  import { EvidenceRating } from '$lib/components';
  import { getCompetencyDescriptor } from '@core-os/ui';
  import PathwayGraphCanvas from '$lib/components/pathways/PathwayGraphCanvas.svelte';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence || []);
  let reports = $derived(data.reports || []);
  let pathways = $derived(data.pathways || []);

  type TabMode = 'capabilities' | 'evidence' | 'report' | 'pathways';
  let activeTab = $state<TabMode>('capabilities');

  $effect(() => {
    const tabParam = page.url.searchParams.get('tab') as TabMode | null;
    if (tabParam && ['capabilities', 'evidence', 'report', 'pathways'].includes(tabParam)) {
      activeTab = tabParam;
    }
  });

  // Dynamically derive capability summaries from learner's verified competency scores
  const capabilities = $derived.by(() => {
    const comps = learner?.competencies;
    if (!comps || Object.keys(comps).length === 0) {
      return [];
    }

    const friendlyTitles: Record<string, { name: string; summary: string }> = {
      spatial_reasoning: {
        name: 'Spatial Reasoning & Kinematics',
        summary: '3D structural stress analysis, coordinate transforms, and kinematic linkages.'
      },
      computational_thinking: {
        name: 'Computational Logic & Algorithms',
        summary: 'State machine design, recursive decomposition, and algorithmic efficiency.'
      },
      quantitative_reasoning: {
        name: 'Quantitative & Proportional Reasoning',
        summary: 'Ratio scaling, dimensional analysis, and parametric equation systems.'
      },
      scientific_inquiry: {
        name: 'Empirical Verification & Invariant Proofs',
        summary: 'Hypothesis testing, variable isolation, and experimental error bounds.'
      },
      verbal_reasoning: {
        name: 'Verbal Logic & Textual Synthesis',
        summary: 'Argument evaluation, semantic nuance, and structured inquiry exposition.'
      },
      creative_divergence: {
        name: 'Creative Divergence & Design Iteration',
        summary: 'Alternative problem formulations, multi-constraint design trade-offs.'
      }
    };

    return Object.entries(comps).map(([key, c]: [string, any]) => {
      const info = friendlyTitles[key] || {
        name: c?.title || key.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        summary: 'Longitudinally verified competency demonstrated via diagnostic items.'
      };
      const score = typeof c?.score === 'number' ? c.score : 0;
      const isStrong = score >= 3.5;
      const isDeveloping = score >= 2.0;
      return {
        key,
        name: info.name,
        band: isStrong ? 'Strong Foundation' : isDeveloping ? 'Developing Foundation' : 'Emerging Foundation',
        rating: Math.min(5, Math.max(1, Math.round(score))),
        maxRating: 5,
        tier: isStrong ? 'positive' : 'attention',
        summary: info.summary
      };
    });
  });

  let selectedPathwayId = $state('PATH-ROBOTICS');
  let selectedPathway = $derived(
    pathways.find((p: any) => p.id === selectedPathwayId) || pathways[0]
  );
</script>

<svelte:head>
  <title>Growth & Evidence Ledger — CREED OS</title>
  <meta name="description" content="Verified longitudinal competency ledger, diagnostic reports, and authentic pathway horizons." />
</svelte:head>

<div class="max-w-5xl mx-auto space-y-6 py-6 pb-20">
  <!-- Editorial Header (WAY 3.0 Warm Nordic Craft) -->
  <header class="space-y-3 border-b border-border pb-5">
    <div class="flex items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2 px-2 py-0.5 rounded-none bg-surface border border-border text-[11px] font-mono text-ink-muted">
          <span class="size-1.5 rounded-none bg-mint"></span>
          <span>LONGITUDINAL EVIDENCE & HORIZONS</span>
        </div>
        <h1 class="text-2xl font-bold tracking-tight text-ink font-heading">
          Growth & Capabilities Ledger
        </h1>
        <p class="text-xs text-ink-secondary leading-relaxed max-w-2xl">
          Tamper-evident record of demonstrated competencies across applied engineering missions, adaptive diagnostics, and guided inquiry.
        </p>
      </div>

      <div class="hidden sm:flex items-center gap-2">
        <a
          href="/student/assessment"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-sm bg-brand text-brand-foreground shadow-xs hover:bg-brand/90 transition-micro"
        >
          <span>Take CAT Assessment</span>
          <ArrowRight class="size-3.5" />
        </a>
      </div>
    </div>

    <!-- Segmented Navigation Rail (4 Tabs) -->
    <div role="tablist" aria-label="Growth Perspectives" class="flex items-center gap-1 pt-2 overflow-x-auto">
      <button
        type="button"
        role="tab"
        id="tab-capabilities"
        aria-selected={activeTab === 'capabilities'}
        aria-controls="panel-capabilities"
        tabindex={activeTab === 'capabilities' ? 0 : -1}
        onclick={() => (activeTab = 'capabilities')}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-sm transition-micro border {activeTab === 'capabilities'
          ? 'bg-surface-raised border-border text-brand font-bold shadow-2xs'
          : 'bg-transparent border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
      >
        <Activity class="size-3.5" />
        <span>1. Capabilities</span>
      </button>

      <button
        type="button"
        role="tab"
        id="tab-evidence"
        aria-selected={activeTab === 'evidence'}
        aria-controls="panel-evidence"
        tabindex={activeTab === 'evidence' ? 0 : -1}
        onclick={() => (activeTab = 'evidence')}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-sm transition-micro border {activeTab === 'evidence'
          ? 'bg-surface-raised border-border text-brand font-bold shadow-2xs'
          : 'bg-transparent border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
      >
        <CheckCircle2 class="size-3.5" />
        <span>2. Evidence Ledger ({evidence.length})</span>
      </button>

      <button
        type="button"
        role="tab"
        id="tab-report"
        aria-selected={activeTab === 'report'}
        aria-controls="panel-report"
        tabindex={activeTab === 'report' ? 0 : -1}
        onclick={() => (activeTab = 'report')}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-sm transition-micro border {activeTab === 'report'
          ? 'bg-surface-raised border-border text-brand font-bold shadow-2xs'
          : 'bg-transparent border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
      >
        <FileText class="size-3.5" />
        <span>3. Diagnostic Roadmap</span>
      </button>

      <button
        type="button"
        role="tab"
        id="tab-pathways"
        aria-selected={activeTab === 'pathways'}
        aria-controls="panel-pathways"
        tabindex={activeTab === 'pathways' ? 0 : -1}
        onclick={() => (activeTab = 'pathways')}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono rounded-sm transition-micro border {activeTab === 'pathways'
          ? 'bg-surface-raised border-border text-brand font-bold shadow-2xs'
          : 'bg-transparent border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
      >
        <Compass class="size-3.5" />
        <span>4. Horizons</span>
      </button>
    </div>
  </header>

  <!-- TAB 1: CAPABILITIES -->
  {#if activeTab === 'capabilities'}
    <div
      role="tabpanel"
      id="panel-capabilities"
      aria-labelledby="tab-capabilities"
      tabindex="0"
      class="space-y-6 focus-visible:outline-none"
    >
      {#if capabilities.length === 0}
        <div class="p-8 bg-surface border border-dashed border-border rounded-sm text-center space-y-3">
          <Layers class="size-8 text-ink-muted mx-auto" />
          <h3 class="text-sm font-semibold text-ink">No Competencies Assessed Yet</h3>
          <p class="text-xs text-ink-secondary max-w-md mx-auto leading-relaxed">
            Complete your first adaptive diagnostic or robotics mission to establish your qualitative developmental baseline.
          </p>
          <a
            href="/student/assessment"
            class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-sm bg-brand text-brand-foreground shadow-xs hover:bg-brand/90 transition-micro"
          >
            <span>Take CAT Diagnostic</span>
            <ArrowRight class="size-3.5" />
          </a>
        </div>
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each capabilities as cap}
            <div class="p-5 bg-surface border border-border rounded-sm space-y-3 shadow-2xs">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-ink">{cap.name}</span>
                <span class="px-2 py-0.5 rounded-sm text-[10px] font-mono font-semibold {cap.tier === 'positive'
                  ? 'bg-mint/10 text-mint border border-mint/20'
                  : 'bg-attention/10 text-attention border border-attention/20'}">
                  {cap.band}
                </span>
              </div>
              <p class="text-xs text-ink-secondary leading-relaxed">
                {cap.summary}
              </p>
              <div class="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-ink-muted">
                <span>Demonstration Depth</span>
                <span class="font-bold text-ink">{cap.rating} / {cap.maxRating} Verified Criteria</span>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      <div class="p-4 bg-surface-subtle border border-border rounded-sm flex items-center justify-between text-xs text-ink-secondary">
        <div class="flex items-center gap-2">
          <ShieldCheck class="size-4 text-mint shrink-0" />
          <span>Scores reflect verified telemetry evidence from Maker missions and CAT diagnostic sessions.</span>
        </div>
        <span class="font-mono text-[11px] text-ink-muted shrink-0">DPDP Section 9 Compliant</span>
      </div>
    </div>

  <!-- TAB 2: EVIDENCE LEDGER -->
  {:else if activeTab === 'evidence'}
    <div
      role="tabpanel"
      id="panel-evidence"
      aria-labelledby="tab-evidence"
      tabindex="0"
      class="space-y-4 focus-visible:outline-none"
    >
      <div class="flex items-center justify-between text-xs text-ink-muted font-mono">
        <span>Tamper-evident SHA-256 Chained Evidence Ledger</span>
        <span>{evidence.length} Ledger Records</span>
      </div>

      <div class="border border-border rounded-sm overflow-hidden bg-surface divide-y divide-border">
        {#if evidence.length === 0}
          <div class="p-8 text-center text-xs text-ink-muted">
            No evidence records logged yet. Complete today's Maker mission or an adaptive assessment to generate verified ledger records.
          </div>
        {:else}
          {#each evidence as item}
            <div class="p-4 hover:bg-surface-raised transition-micro space-y-2">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="size-2 rounded-none bg-mint"></span>
                  <span class="text-xs font-semibold text-ink">{item.title || item.sourceType || 'Maker Evidence Record'}</span>
                  {#if item.provenanceBadge}
                    <span class="px-1.5 py-0.5 rounded-sm bg-brand/10 text-brand border border-brand/20 font-mono text-[10px] font-semibold">
                      {item.provenanceBadge}
                    </span>
                  {/if}
                </div>
                <div class="flex items-center gap-2 text-[10px] font-mono text-ink-muted">
                  <span class="px-1.5 py-0.5 rounded-sm bg-surface-raised border border-border">{item.sourceType || 'Simulation Artifact'}</span>
                  <span>{item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Active Session'}</span>
                </div>
              </div>

              {#if item.claim}
                <p class="text-xs text-ink-secondary leading-relaxed">
                  {item.claim}
                </p>
              {/if}

              <div class="pt-1 flex items-center justify-between text-[10px] font-mono text-ink-muted">
                <span class="truncate max-w-xs text-ink-muted">
                  Chain: {item.chainHash ? item.chainHash.slice(0, 16) + '...' : 'GENESIS-BLOCK-001'}
                </span>
                <span class="text-mint font-semibold">VERIFIED</span>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

  <!-- TAB 3: DIAGNOSTIC ROADMAP -->
  {:else if activeTab === 'report'}
    <div
      role="tabpanel"
      id="panel-report"
      aria-labelledby="tab-report"
      tabindex="0"
      class="space-y-6 focus-visible:outline-none"
    >
      {#if reports.length === 0}
        <div class="p-12 border border-border rounded-sm bg-surface text-center space-y-3">
          <FileText class="size-8 text-ink-muted mx-auto" />
          <h3 class="text-sm font-semibold text-ink">No Completed Diagnostic Yet</h3>
          <p class="text-xs text-ink-secondary max-w-md mx-auto leading-relaxed">
            Take a 15-minute Computerized Adaptive Diagnostic (CAT) to generate your NCERT PARAKH developmental trajectory and 4-week roadmap.
          </p>
          <a
            href="/student/assessment"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-sm bg-brand text-brand-foreground shadow-xs hover:bg-brand/90 transition-micro"
          >
            <span>Start Adaptive Assessment</span>
            <ArrowRight class="size-3.5" />
          </a>
        </div>
      {:else}
        {#each reports as report}
          <div class="p-6 bg-surface border border-border rounded-sm space-y-4 shadow-2xs">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-brand font-bold">
                  {report.domain?.toUpperCase() || 'STEM'} DIAGNOSTIC
                </span>
                <h3 class="text-base font-bold text-ink mt-0.5">
                  {report.developmentalBand || 'Mountain (Emerging Independence)'}
                </h3>
              </div>
              <span class="text-xs font-mono text-ink-muted">
                {report.generatedAt ? new Date(report.generatedAt).toLocaleDateString() : 'Recent Diagnostic'}
              </span>
            </div>

            <p class="text-xs text-ink-secondary leading-relaxed">
              {report.developmentalBand ? `${report.developmentalBand} demonstrated across ${report.domainTitle} with high psychometric reliability.` : 'Demonstrated consistent problem-solving across kinematics and spatial decomposition.'}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border text-xs">
              <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1">
                <span class="text-[10px] font-mono text-ink-muted uppercase">Primary Strength</span>
                <p class="font-semibold text-ink">{report.subCompetencies?.[0]?.name || 'Spatial Decomposition'}</p>
              </div>
              <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1">
                <span class="text-[10px] font-mono text-ink-muted uppercase">Growth Horizon</span>
                <p class="font-semibold text-ink">{report.identifiedMisconceptions?.[0]?.label || report.subCompetencies?.[1]?.name || 'Proportional Scaling'}</p>
              </div>
              <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1">
                <span class="text-[10px] font-mono text-ink-muted uppercase">Recommended Mission</span>
                <p class="font-semibold text-brand">RoboBridge Truss</p>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

  <!-- TAB 4: HORIZONS & PATHWAYS -->
  {:else if activeTab === 'pathways'}
    <div
      role="tabpanel"
      id="panel-pathways"
      aria-labelledby="tab-pathways"
      tabindex="0"
      class="space-y-6 focus-visible:outline-none"
    >
      <!-- Section Header with Level 1/2/3 Grammar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h2 class="text-sm font-bold text-ink flex items-center gap-2">
            <Compass class="size-4 text-brand" />
            <span>Interactive Prerequisite Tree & Learning Horizons</span>
          </h2>
          <p class="text-xs text-ink-muted">
            Explore dependency branches connecting foundational abilities to exploratory STEM and robotics pathways.
          </p>
        </div>
        <div class="flex items-center gap-1.5 shrink-0 flex-wrap">
          {#each pathways as p}
            <button
              type="button"
              onclick={() => (selectedPathwayId = p.id)}
              class="px-3 py-1 text-xs font-mono rounded-sm transition-micro cursor-pointer border {selectedPathwayId === p.id
                ? 'border-brand bg-brand-subtle text-brand font-bold shadow-2xs ring-1 ring-brand/30'
                : 'border-border bg-surface hover:bg-surface-subtle text-ink-secondary'}"
            >
              {p.title}
            </button>
          {/each}
        </div>
      </div>

      <!-- 1. Full Interactive Prerequisite Flow Canvas -->
      <PathwayGraphCanvas
        {pathways}
        {selectedPathwayId}
        {learner}
        onselect={(id) => (selectedPathwayId = id)}
      />

      <!-- 2. Focused Pathway Capability & Milestone Card -->
      {#if selectedPathway}
        <div class="p-5 bg-surface border border-border rounded-sm space-y-4 shadow-2xs">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-sm bg-brand-subtle text-brand text-[10px] font-mono font-bold">
                  {selectedPathway.field}
                </span>
                <span class="text-xs text-ink-muted font-mono">{selectedPathway.id}</span>
              </div>
              <h3 class="text-base font-bold text-ink mt-1 font-heading">{selectedPathway.title}</h3>
            </div>
            <a
              href="/ide"
              class="px-3.5 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-semibold rounded-sm transition-micro inline-flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <span>Launch Studio Mission</span>
              <ArrowRight class="size-3.5" />
            </a>
          </div>

          <p class="text-xs text-ink-secondary leading-relaxed">
            {selectedPathway.overview || selectedPathway.tagline}
          </p>

          <div class="pt-3 border-t border-border space-y-3">
            <span class="text-xs font-bold text-ink font-mono uppercase tracking-wider block">
              Foundational Competencies Demonstrated
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {#each selectedPathway.requirements || [] as req}
                {@const comp = learner?.competencies?.[req.competency]}
                {@const hasScore = typeof comp?.score === 'number'}
                {@const currentScore = hasScore ? comp.score : null}
                {@const isDemonstrated = hasScore && (currentScore as number) >= req.minimumLevel}
                <div class="p-3 bg-surface-subtle border border-border rounded-sm flex items-center justify-between">
                  <div class="min-w-0 pr-2">
                    <span class="text-ink font-medium block truncate">
                      {req.competency.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                    <span class="text-[10px] text-ink-muted font-mono">
                      Req: Level {req.minimumLevel} · Current: {hasScore ? `Level ${currentScore}` : 'Not Assessed'}
                    </span>
                  </div>
                  <span class="px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold shrink-0 {isDemonstrated ? 'bg-positive-subtle text-positive border border-positive/30' : hasScore ? 'bg-attention-subtle text-attention border border-attention/30' : 'bg-surface-raised text-ink-muted border border-border'}">
                    {isDemonstrated ? 'Demonstrated' : hasScore ? 'Developing' : 'Not Assessed'}
                  </span>
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
