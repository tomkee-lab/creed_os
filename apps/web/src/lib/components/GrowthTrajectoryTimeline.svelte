<script lang="ts">
  import { TrendingUp, Award, Calendar, CheckCircle, ExternalLink, Lightbulb } from 'lucide-svelte';

  export interface TrajectoryMilestone {
    id: string;
    date: string;
    title: string;
    domain: string;
    category: 'Assessment' | 'Project' | 'Mentorship' | 'Classroom';
    growthNote: string;
    level: string; // e.g. "Consolidating", "Advancing"
    evidenceCode?: string;
  }

  interface Props {
    milestones?: TrajectoryMilestone[];
    selectedId?: string;
    onSelect?: (milestone: TrajectoryMilestone) => void;
  }

  const defaultMilestones: TrajectoryMilestone[] = [
    {
      id: 'm1',
      date: 'Oct 2025',
      title: 'Baseline Diagnostic CAT',
      domain: 'Quantitative & Logic',
      category: 'Assessment',
      growthNote: 'Established initial baseline with fast response latency on logic puzzles and proportional tables.',
      level: 'Baseline Formed',
      evidenceCode: 'CAT-2025-Q1'
    },
    {
      id: 'm2',
      date: 'Dec 2025',
      title: 'Robotics Kinematic Arm Build',
      domain: 'Spatial Reasoning',
      category: 'Project',
      growthNote: 'Constructed physical dual-axis linkage; demonstrated intuitive grasp of 3D rotational mechanics.',
      level: 'Active Mastery',
      evidenceCode: 'PRJ-KIN-08'
    },
    {
      id: 'm3',
      date: 'Jan 2026',
      title: 'Algorithmic Maze Navigation',
      domain: 'Computational Thinking',
      category: 'Classroom',
      growthNote: 'Authored recursive pathfinding routine; independently identified redundant recursive states.',
      level: 'Advancing Fluency',
      evidenceCode: 'LAB-ALG-04'
    },
    {
      id: 'm4',
      date: 'Feb 2026',
      title: 'Socratic Dialogue: Scientific Deductions',
      domain: 'Scientific Inquiry',
      category: 'Mentorship',
      growthNote: 'Engaged with Socratic voice guide to debate electrical resistance vs thermal dissipation hypotheses.',
      level: 'Deep Inquiry',
      evidenceCode: 'SOC-AI-19'
    },
    {
      id: 'm5',
      date: 'Mar 2026',
      title: 'Multi-Item CAT Verification',
      domain: 'Holistic Profile',
      category: 'Assessment',
      growthNote: 'Demonstrated high standard error precision across adaptive items without performance fatigue.',
      level: 'Verified Growth Horizon',
      evidenceCode: 'CAT-2026-M3'
    }
  ];

  let {
    milestones = defaultMilestones,
    selectedId,
    onSelect
  }: Props = $props();

  let selectedIdx = $state<number | null>(null);

  const activeIdx = $derived(
    selectedIdx !== null
      ? Math.min(selectedIdx, Math.max(0, milestones.length - 1))
      : Math.max(0, milestones.length - 1)
  );

  const activeMilestone = $derived(
    selectedId
      ? (milestones.find((m) => m.id === selectedId) ?? milestones[activeIdx] ?? milestones[0])
      : (milestones[activeIdx] ?? milestones[0])
  );

  function handleMilestoneClick(idx: number, m: TrajectoryMilestone) {
    selectedIdx = idx;
    onSelect?.(m);
  }
</script>

<div class="bg-surface p-6 rounded-sm border border-border space-y-6">
  <!-- Section Title -->
  <div class="flex items-start justify-between gap-4 border-b border-border pb-3">
    <div>
      <div class="flex items-center gap-2">
        <TrendingUp class="w-4 h-4 text-brand" />
        <h3 class="text-lg font-bold text-ink">
          Developmental Trajectory Timeline
        </h3>
      </div>
      <p class="text-xs text-ink-secondary mt-1">
        Chronological growth milestones verified by authentic classroom artifacts, adaptive CAT sessions, and project work.
      </p>
    </div>

    <span class="text-xs font-semibold px-2.5 py-1 rounded-sm badge-growth shrink-0">
      Evidence-Anchored
    </span>
  </div>

  <!-- Interactive Timeline Strip -->
  <div class="relative py-4 px-2">
    <!-- Connecting Horizon Line -->
    <div class="absolute top-8 left-6 right-6 h-0.5 bg-border"></div>
    <div
      class="absolute top-8 left-6 h-0.5 bg-brand transition-all duration-500"
      style="width: {(activeIdx / Math.max(1, milestones.length - 1)) * 92}%;"
    ></div>

    <!-- Timeline Nodes -->
    <div class="relative flex justify-between items-start gap-2">
      {#each milestones as milestone, i}
        {@const isActive = activeMilestone.id === milestone.id}
        {@const isPast = i <= activeIdx}

        <button
          type="button"
          onclick={() => handleMilestoneClick(i, milestone)}
          class="flex flex-col items-center group text-center focus:outline-none cursor-pointer"
        >
          <!-- Node Dot -->
          <div
            class="w-8 h-8 rounded-sm flex items-center justify-center transition-all duration-300 border-2 {isActive ? 'bg-brand border-canvas ring-4 ring-brand/30 text-white shadow-md scale-110' : isPast ? 'bg-surface-raised border-brand text-brand' : 'bg-surface-subtle border-border text-ink-muted'}"
          >
            {#if isPast}
              <CheckCircle class="w-4 h-4" />
            {:else}
              <span class="text-xs font-bold">{i + 1}</span>
            {/if}
          </div>

          <!-- Date Label -->
          <span class="text-[10px] font-semibold mt-2 {isActive ? 'text-brand' : 'text-ink-muted'}">
            {milestone.date}
          </span>

          <!-- Node Title snippet -->
          <span class="text-[11px] font-medium max-w-20 sm:max-w-25 truncate mt-0.5 {isActive ? 'text-ink font-semibold' : 'text-ink-secondary'}">
            {milestone.title}
          </span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Focused Milestone Card -->
  <div class="p-4 rounded-sm bg-surface-subtle border border-border space-y-3">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2 text-xs">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded-sm font-semibold bg-brand-subtle text-brand">
          {activeMilestone.category}
        </span>
        <span class="font-bold text-sm text-ink">
          {activeMilestone.title}
        </span>
      </div>

      <div class="flex items-center gap-3 text-ink-muted font-medium">
        <span class="flex items-center gap-1">
          <Calendar class="w-3.5 h-3.5" />
          {activeMilestone.date}
        </span>
        {#if activeMilestone.evidenceCode}
          <span class="font-mono text-[11px] bg-surface-raised px-1.5 py-0.5 rounded-sm border border-border">
            {activeMilestone.evidenceCode}
          </span>
        {/if}
      </div>
    </div>

    <!-- Growth Note -->
    <p class="text-sm text-ink-secondary leading-relaxed">
      {activeMilestone.growthNote}
    </p>

    <!-- Qualitative Horizon & Domain -->
    <div class="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
      <div class="flex items-center gap-1.5 text-ink-muted">
        <Lightbulb class="w-3.5 h-3.5 text-attention" />
        <span>Demonstrated Level: </span>
        <span class="font-semibold text-ink">{activeMilestone.level}</span>
      </div>

      <span class="text-xs font-medium text-brand">
        {activeMilestone.domain}
      </span>
    </div>
  </div>
</div>
