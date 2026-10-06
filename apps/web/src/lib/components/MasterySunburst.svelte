<script lang="ts">
  import { Sparkles, CheckCircle2, Compass, Layers, ShieldCheck } from 'lucide-svelte';

  export interface SunburstDomain {
    id: string;
    name: string;
    stage: 'Exploring' | 'Forming' | 'Deepening' | 'Mastering';
    progress: number; // 0.0 - 1.0
    evidenceCount: number;
    color: string; // CSS custom property name like '--accent-primary'
    skills: {
      name: string;
      level: 'Proficient' | 'Advanced' | 'Emerging';
      evidenceSnippet: string;
    }[];
    developmentalNarrative: string;
    nextMilestone: string;
  }

  interface Props {
    domains?: SunburstDomain[];
    size?: number;
    selectedId?: string;
    onSelect?: (domain: SunburstDomain) => void;
  }

  const defaultDomains: SunburstDomain[] = [
    {
      id: 'computational_thinking',
      name: 'Computational Thinking',
      stage: 'Mastering',
      progress: 0.88,
      evidenceCount: 14,
      color: 'var(--accent-primary)',
      skills: [
        { name: 'Algorithmic Decomposition', level: 'Advanced', evidenceSnippet: 'Solved maze recursion with optimal time complexity' },
        { name: 'State Abstraction', level: 'Proficient', evidenceSnippet: 'Modelled finite automata transitions in robotics sim' },
        { name: 'Pattern Recognition', level: 'Advanced', evidenceSnippet: 'Discovered polynomial invariants in dataset' }
      ],
      developmentalNarrative: 'Aryan demonstrates natural fluency in decomposing complex multi-step problems into modular components and identifying edge cases.',
      nextMilestone: 'Try dynamic programming challenges with spatial graphs.'
    },
    {
      id: 'quantitative_reasoning',
      name: 'Quantitative Reasoning',
      stage: 'Deepening',
      progress: 0.78,
      evidenceCount: 11,
      color: 'var(--accent-indigo)',
      skills: [
        { name: 'Proportional Relationships', level: 'Advanced', evidenceSnippet: 'Directly applied scale factors in geometric proofs' },
        { name: 'Probabilistic Inference', level: 'Proficient', evidenceSnippet: 'Calculated Bayesian posteriors in simulation' },
        { name: 'Non-linear Modeling', level: 'Emerging', evidenceSnippet: 'Exploring logarithmic decay curves' }
      ],
      developmentalNarrative: 'Consistently strong analytical intuition; excels at connecting quantitative representations to real-world phenomena.',
      nextMilestone: 'Investigate exponential growth modeling in ecology simulations.'
    },
    {
      id: 'spatial_reasoning',
      name: 'Spatial Reasoning',
      stage: 'Mastering',
      progress: 0.92,
      evidenceCount: 16,
      color: 'var(--accent-teal)',
      skills: [
        { name: '3D Mental Rotation', level: 'Advanced', evidenceSnippet: 'Flawless 10/10 spatial rotation under timed assessment' },
        { name: 'Kinematic Topology', level: 'Advanced', evidenceSnippet: 'Assembled robotic arm linkages with correct axes' },
        { name: 'Orthographic Projection', level: 'Proficient', evidenceSnippet: 'Constructed 3-view CAD blueprints' }
      ],
      developmentalNarrative: 'Exceptional geometric perception and spatial transformation capability. Places in the upper percentile of experiential builds.',
      nextMilestone: 'Build multi-joint kinematic simulations in three dimensions.'
    },
    {
      id: 'scientific_inquiry',
      name: 'Scientific Inquiry',
      stage: 'Deepening',
      progress: 0.72,
      evidenceCount: 9,
      color: 'var(--accent-success)',
      skills: [
        { name: 'Hypothesis Formulation', level: 'Proficient', evidenceSnippet: 'Formulated testable hypotheses on battery discharge' },
        { name: 'Variable Isolation', level: 'Proficient', evidenceSnippet: 'Controlled ambient temperature during experiments' },
        { name: 'Empirical Verification', level: 'Emerging', evidenceSnippet: 'Recording systematic observational tables' }
      ],
      developmentalNarrative: 'Rigorous curiosity-driven approach. Eager to formulate questions and test alternative explanations through experimentation.',
      nextMilestone: 'Design a self-directed dual-variable laboratory experiment.'
    },
    {
      id: 'metacognition',
      name: 'Metacognition',
      stage: 'Forming',
      progress: 0.65,
      evidenceCount: 7,
      color: 'var(--accent-warning)',
      skills: [
        { name: 'Error Reflection', level: 'Proficient', evidenceSnippet: 'Identified arithmetic slip before final submission' },
        { name: 'Pacing Calibration', level: 'Emerging', evidenceSnippet: 'Learning to allocate time proportionally across tasks' },
        { name: 'Self-Questioning', level: 'Proficient', evidenceSnippet: 'Actively asked Socratic Mentor for clarification' }
      ],
      developmentalNarrative: 'Developing intentional habits of mind. Showing increasing self-awareness when pausing to re-evaluate mistaken assumptions.',
      nextMilestone: 'Practice time-boxed self-audits before completing complex projects.'
    },
    {
      id: 'logical_deduction',
      name: 'Logical Deduction',
      stage: 'Deepening',
      progress: 0.82,
      evidenceCount: 12,
      color: 'var(--accent-cyan)',
      skills: [
        { name: 'Conditional Syllogisms', level: 'Advanced', evidenceSnippet: 'Validated contrapositive arguments without errors' },
        { name: 'Constraint Satisfaction', level: 'Proficient', evidenceSnippet: 'Solved logic grid puzzles with zero hints' },
        { name: 'Fallacy Detection', level: 'Proficient', evidenceSnippet: 'Flagged false-cause relationships in case studies' }
      ],
      developmentalNarrative: 'Strong structured reasoning; identifies logical inconsistencies swiftly and constructs elegant deductive steps.',
      nextMilestone: 'Engage with formal symbolic logic and truth tables.'
    }
  ];

  let {
    domains = defaultDomains,
    size = 360,
    selectedId,
    onSelect
  }: Props = $props();

  let activeIndex = $state<number>(0);

  const activeDomain = $derived(
    selectedId
      ? (domains.find((d) => d.id === selectedId) ?? domains[activeIndex] ?? domains[0])
      : (domains[activeIndex] ?? domains[0])
  );

  const center = $derived(size / 2);
  const innerRadius = $derived(size * 0.22);
  const midRadius = $derived(size * 0.38);
  const maxOuterRadius = $derived(size * 0.48);
  const n = $derived(domains.length);
  const angleStep = $derived((Math.PI * 2) / n);
  const padAngle = 0.04; // angular gap between sectors

  // Convert polar coordinates to Cartesian path command
  function arcPath(startAngle: number, endAngle: number, rIn: number, rOut: number): string {
    const x1 = center + rOut * Math.cos(startAngle);
    const y1 = center + rOut * Math.sin(startAngle);
    const x2 = center + rOut * Math.cos(endAngle);
    const y2 = center + rOut * Math.sin(endAngle);

    const x3 = center + rIn * Math.cos(endAngle);
    const y3 = center + rIn * Math.sin(endAngle);
    const x4 = center + rIn * Math.cos(startAngle);
    const y4 = center + rIn * Math.sin(startAngle);

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  }

  function handleSectorClick(idx: number, domain: SunburstDomain) {
    activeIndex = idx;
    onSelect?.(domain);
  }
</script>

<div class="flex flex-col lg:flex-row items-center gap-8 surface-card p-6 rounded-2xl border border-(--border-subtle)">
  <!-- 1. Interactive Sunburst Orbit SVG -->
  <div class="relative flex items-center justify-center shrink-0" style="width: {size}px; height: {size}px;">
    <svg width={size} height={size} class="overflow-visible select-none" role="img" aria-label="Developmental Mastery Sunburst Chart">
      <defs>
        <!-- Soft background radial gradient -->
        <radialGradient id="sunburstCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="var(--surface-raised)" stop-opacity="0.9" />
          <stop offset="100%" stop-color="var(--surface-canvas)" stop-opacity="0.95" />
        </radialGradient>
      </defs>

      <!-- Background guide rings -->
      <circle cx={center} cy={center} r={innerRadius} class="fill-transparent stroke-(--border-subtle)" stroke-width="1" />
      <circle cx={center} cy={center} r={midRadius} class="fill-transparent stroke-(--border-subtle)" stroke-width="1" stroke-dasharray="3 3" />
      <circle cx={center} cy={center} r={maxOuterRadius} class="fill-transparent stroke-(--border-subtle)" stroke-width="1" stroke-dasharray="2 4" />

      <!-- Interactive Outer Sunburst Petals (Variable progress extent) -->
      {#each domains as domain, i}
        {@const startAngle = i * angleStep - Math.PI / 2 + padAngle / 2}
        {@const endAngle = (i + 1) * angleStep - Math.PI / 2 - padAngle / 2}
        {@const currentOuterRadius = midRadius + (maxOuterRadius - midRadius) * domain.progress}
        {@const isSelected = activeDomain.id === domain.id}

        <!-- Base domain segment (mid ring) -->
        <path
          d={arcPath(startAngle, endAngle, innerRadius + 4, midRadius - 2)}
          fill={domain.color}
          fill-opacity={isSelected ? '0.35' : '0.15'}
          stroke={domain.color}
          stroke-width={isSelected ? '2' : '1'}
          class="cursor-pointer transition-all duration-300 hover:fill-opacity-40"
          onclick={() => handleSectorClick(i, domain)}
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSectorClick(i, domain); }}
          aria-label="{domain.name}: {domain.stage}"
        />

        <!-- Progress petal (outer ring extension) -->
        <path
          d={arcPath(startAngle, endAngle, midRadius, currentOuterRadius)}
          fill={domain.color}
          fill-opacity={isSelected ? '0.85' : '0.50'}
          stroke={domain.color}
          stroke-width={isSelected ? '2' : '1'}
          class="cursor-pointer transition-all duration-300 hover:fill-opacity-90"
          onclick={() => handleSectorClick(i, domain)}
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSectorClick(i, domain); }}
          aria-label="{domain.name} progress: {Math.round(domain.progress * 100)}%"
        />

        <!-- Midpoint indicator icon / dot -->
        {@const midAngle = (startAngle + endAngle) / 2}
        {@const dotX = center + (currentOuterRadius + 10) * Math.cos(midAngle)}
        {@const dotY = center + (currentOuterRadius + 10) * Math.sin(midAngle)}
        <circle
          cx={dotX}
          cy={dotY}
          r={isSelected ? '3.5' : '2'}
          fill={domain.color}
          class="transition-all duration-300"
        />
      {/each}

      <!-- Center Orbit Core Hub -->
      <circle
        cx={center}
        cy={center}
        r={innerRadius - 4}
        fill="url(#sunburstCore)"
        stroke={activeDomain.color}
        stroke-width="2"
        class="transition-all duration-500 shadow-sm"
      />

      <!-- Text inside Center Hub -->
      <text
        x={center}
        y={center - 10}
        text-anchor="middle"
        class="text-[10px] font-semibold tracking-wider uppercase fill-(--text-muted) select-none"
      >
        {activeDomain.stage}
      </text>
      <text
        x={center}
        y={center + 12}
        text-anchor="middle"
        class="text-base font-bold fill-(--text-primary) select-none"
      >
        {Math.round(activeDomain.progress * 100)}%
      </text>
      <text
        x={center}
        y={center + 26}
        text-anchor="middle"
        class="text-[9px] font-medium fill-(--text-secondary) select-none"
      >
        Mastery Arc
      </text>
    </svg>
  </div>

  <!-- 2. Rich Developmental Storytelling Card -->
  <div class="flex-1 space-y-4 w-full">
    <!-- Header with badge & stage -->
    <div class="flex items-start justify-between gap-4 border-b border-(--border-subtle) pb-3">
      <div>
        <div class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-full shrink-0"
            style="background-color: {activeDomain.color};"
          ></span>
          <h3 class="text-lg font-bold text-(--text-primary)">
            {activeDomain.name}
          </h3>
        </div>
        <p class="text-xs text-(--text-secondary) mt-1">
          Developmental Stage: <span class="font-semibold text-(--text-primary)">{activeDomain.stage}</span>
          • <span class="text-(--text-muted)">{activeDomain.evidenceCount} verified artifacts</span>
        </p>
      </div>

      <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full badge-growth text-xs font-semibold shrink-0">
        <Sparkles class="w-3.5 h-3.5 text-(--accent-primary)" />
        <span>Growth Horizon</span>
      </div>
    </div>

    <!-- Human-first developmental narrative -->
    <p class="text-sm leading-relaxed text-(--text-secondary)">
      {activeDomain.developmentalNarrative}
    </p>

    <!-- Specific Demonstrated Competency Items -->
    <div class="space-y-2">
      <div class="text-xs font-semibold text-(--text-primary) flex items-center gap-1.5">
        <Layers class="w-3.5 h-3.5 text-(--accent-primary)" />
        <span>Observed Skill Milestones:</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {#each activeDomain.skills as skill}
          <div class="p-2.5 rounded-lg bg-(--surface-sunken) border border-(--border-subtle) space-y-1 text-xs">
            <div class="flex items-center justify-between font-medium">
              <span class="text-(--text-primary)">{skill.name}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded-md font-semibold {skill.level === 'Advanced' ? 'bg-(--accent-teal-subtle) text-(--accent-teal)' : skill.level === 'Proficient' ? 'bg-(--accent-primary-subtle) text-(--accent-primary)' : 'bg-(--accent-warning-subtle) text-(--accent-warning)'}">
                {skill.level}
              </span>
            </div>
            <p class="text-[11px] text-(--text-muted) line-clamp-2">
              "{skill.evidenceSnippet}"
            </p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Constructive Next Milestone Guidance -->
    <div class="p-3 rounded-xl bg-(--accent-primary-subtle) border border-(--accent-primary)/20 flex items-start gap-2.5 text-xs">
      <Compass class="w-4 h-4 text-(--accent-primary) shrink-0 mt-0.5" />
      <div>
        <span class="font-semibold text-(--text-primary)">Suggested Next Exploration: </span>
        <span class="text-(--text-secondary)">{activeDomain.nextMilestone}</span>
      </div>
    </div>
  </div>
</div>
