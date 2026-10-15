<script lang="ts">
  import {
    Activity,
    Code2,
    Eye,
    Shield,
    Sparkles,
    Sliders,
    Layers,
    Coffee,
    VolumeX,
    FileText,
    Check
  } from 'lucide-svelte';

  interface Props {
    missionTitle: string;
    missionSlug: string;
    simulatorType: string;
    telemetryData?: Record<string, any>;
    lowStimulation?: boolean;
    onToggleLowStimulation?: () => void;
  }

  let {
    missionTitle,
    missionSlug,
    simulatorType,
    telemetryData = {},
    lowStimulation = $bindable(false),
    onToggleLowStimulation
  }: Props = $props();

  let activeTab = $state<'telemetry' | 'peer_patterns' | 'reflection'>('telemetry');
  let reflectionNotes = $state('');
  let savedReflection = $state(false);

  function handleSaveReflection() {
    savedReflection = true;
    setTimeout(() => {
      savedReflection = false;
    }, 2000);
  }
</script>

<!-- Transitional Lounge (Digital Ecotone per Howson C. 2024 Ch. 13-14) -->
<div
  class="rounded-none border border-border bg-surface transition-all duration-200 {lowStimulation
    ? 'font-mono text-xs bg-surface-subtle'
    : 'text-xs'}"
>
  <!-- Ecotone Header: Serene & Zero-Anxiety -->
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border bg-surface-raised">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="p-1 rounded-none bg-surface border border-border text-foreground">
          <Coffee class="size-3.5 text-mint" />
        </span>
        <h3 class="font-bold tracking-tight text-foreground text-sm font-heading">
          Transitional Lounge · Digital Ecotone
        </h3>
        <span class="px-2 py-0.5 rounded-none text-[10px] font-mono uppercase bg-mint/10 text-mint border border-mint/20">
          Un-timed Workspace
        </span>
      </div>
      <p class="text-[11px] text-foreground-secondary leading-relaxed">
        Pressure-free decompression space. Inspect raw telemetry, explore peer architectural ASTs, and calibrate without time limits.
      </p>
    </div>

    <!-- Low-Stimulation Mode Toggle -->
    <button
      type="button"
      onclick={() => {
        lowStimulation = !lowStimulation;
        onToggleLowStimulation?.();
      }}
      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-medium transition-colors cursor-pointer {lowStimulation
        ? 'border-mint bg-mint/10 text-mint font-mono'
        : 'border-border bg-surface text-foreground-secondary hover:text-foreground'}"
    >
      <VolumeX class="size-3.5" />
      <span>{lowStimulation ? 'Low-Stimulation Mode: Active' : 'Enable Low-Stimulation Mode'}</span>
    </button>
  </header>

  <!-- Segmented Control Tabs (0px / 4px WAY 2.1) -->
  <div class="flex border-b border-border bg-surface-subtle px-4 pt-2 gap-2 text-xs">
    <button
      type="button"
      onclick={() => (activeTab = 'telemetry')}
      class="inline-flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer {activeTab === 'telemetry'
        ? 'border-foreground text-foreground font-semibold'
        : 'border-transparent text-foreground-secondary hover:text-foreground'}"
    >
      <Activity class="size-3.5" />
      <span>Raw Telemetry Vectors</span>
    </button>

    <button
      type="button"
      onclick={() => (activeTab = 'peer_patterns')}
      class="inline-flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer {activeTab === 'peer_patterns'
        ? 'border-foreground text-foreground font-semibold'
        : 'border-transparent text-foreground-secondary hover:text-foreground'}"
    >
      <Code2 class="size-3.5" />
      <span>Peer Structural Decompositions</span>
    </button>

    <button
      type="button"
      onclick={() => (activeTab = 'reflection')}
      class="inline-flex items-center gap-1.5 px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer {activeTab === 'reflection'
        ? 'border-foreground text-foreground font-semibold'
        : 'border-transparent text-foreground-secondary hover:text-foreground'}"
    >
      <FileText class="size-3.5" />
      <span>Pre-Submission Hypotheses</span>
    </button>
  </div>

  <!-- Content Panes -->
  <div class="p-4 space-y-4">
    {#if activeTab === 'telemetry'}
      <!-- Raw Telemetry Stream -->
      <div class="space-y-3">
        <div class="flex items-center justify-between text-[11px] text-foreground-secondary">
          <span>Continuous Sensor & Kinematics Stream</span>
          <span class="font-mono text-mint">● Stream Synchronized</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {#each Object.entries(telemetryData) as [key, value]}
            <div class="p-3 rounded-none bg-surface-raised border border-border space-y-1">
              <span class="text-[10px] font-mono text-foreground-secondary uppercase tracking-wider block">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span class="text-sm font-bold font-mono text-foreground block">
                {typeof value === 'number' ? value.toLocaleString() : String(value)}
              </span>
            </div>
          {/each}
          {#if Object.keys(telemetryData).length === 0}
            <div class="col-span-full p-4 rounded-none bg-surface-raised border border-border text-center text-foreground-secondary font-mono text-xs">
              Live simulator telemetry will populate here as you manipulate physics and parameters.
            </div>
          {/if}
        </div>
      </div>

    {:else if activeTab === 'peer_patterns'}
      <!-- Peer Decomposition ASTs (No spoiler solutions, purely architecture) -->
      <div class="space-y-3">
        <div class="space-y-1">
          <h4 class="font-bold text-foreground text-xs">Anonymized Peer Architectural Patterns</h4>
          <p class="text-[11px] text-foreground-secondary">
            Notice how other learners broke down the constraints of <em>{missionTitle}</em> into independent sub-problems:
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div class="p-3 rounded-none bg-surface-raised border border-border space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-foreground">Strategy A: Symmetrical Bays</span>
              <span class="text-[10px] font-mono text-mint">42% adopted</span>
            </div>
            <p class="text-[11px] text-foreground-secondary leading-relaxed">
              Maintained equilateral triangular geometry across all spans to distribute axial tension evenly before reducing thickness.
            </p>
          </div>

          <div class="p-3 rounded-none bg-surface-raised border border-border space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-foreground">Strategy B: Center Deflection Focus</span>
              <span class="text-[10px] font-mono text-mint">35% adopted</span>
            </div>
            <p class="text-[11px] text-foreground-secondary leading-relaxed">
              Reinforced the midpoint node where bending moments peak, trimming perimeter mass while staying under 250 kg.
            </p>
          </div>

          <div class="p-3 rounded-none bg-surface-raised border border-border space-y-2">
            <div class="flex items-center justify-between">
              <span class="font-bold text-foreground">Strategy C: Torque Damping</span>
              <span class="text-[10px] font-mono text-mint">23% adopted</span>
            </div>
            <p class="text-[11px] text-foreground-secondary leading-relaxed">
              Incorporated multi-stage reduction to keep motor RPM within nominal power band during maximum incline test.
            </p>
          </div>
        </div>
      </div>

    {:else if activeTab === 'reflection'}
      <!-- Pre-Submission Scratchpad -->
      <div class="space-y-3">
        <div class="space-y-1">
          <h4 class="font-bold text-foreground text-xs">Formulate Your Engineering Hypothesis</h4>
          <p class="text-[11px] text-foreground-secondary">
            Write down your reasoning before submitting. Articulating the "why" anchors formative evidence in your learner graph.
          </p>
        </div>

        <textarea
          bind:value={reflectionNotes}
          rows="4"
          placeholder="e.g. I chose titanium alloy with 28mm struts because the deflection margin was too narrow with standard aluminum under a 1,200kg test load..."
          class="w-full p-3 rounded-none bg-surface-raised border border-border text-xs text-foreground placeholder:text-foreground-secondary/60 focus:outline-hidden focus:border-foreground transition-colors font-mono"
        ></textarea>

        <div class="flex items-center justify-between pt-1">
          <span class="text-[10px] text-foreground-secondary">
            Optional reflection • Stored with your Level 4 evidence atom
          </span>
          <button
            type="button"
            onclick={handleSaveReflection}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors cursor-pointer"
          >
            {#if savedReflection}
              <Check class="size-3.5 text-mint" />
              <span>Saved</span>
            {:else}
              <span>Save Hypothesis</span>
            {/if}
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>
