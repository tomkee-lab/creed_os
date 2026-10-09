<script lang="ts">
  import type { CompetencyDomain, CompetencyScore } from '@core-os/domain';

  interface Props {
    competencies: Partial<Record<CompetencyDomain, CompetencyScore>>;
    size?: number;
    showLabels?: boolean;
    fillColor?: string;
    strokeColor?: string;
  }

  let {
    competencies,
    size = 280,
    showLabels = true,
    fillColor = 'fill-brand/20',
    strokeColor = 'stroke-brand'
  }: Props = $props();

  const domainKeys: CompetencyDomain[] = [
    'quantitative_reasoning',
    'spatial_reasoning',
    'computational_thinking',
    'logical_deduction',
    'scientific_inquiry',
    'metacognition'
  ];

  const domainLabels: Record<CompetencyDomain, string> = {
    quantitative_reasoning: 'Quantitative',
    spatial_reasoning: 'Spatial',
    computational_thinking: 'Computational',
    logical_deduction: 'Logical',
    scientific_inquiry: 'Scientific',
    metacognition: 'Metacognition',
    systems_thinking: 'Systems',
    creative_problem_solving: 'Creative'
  };

  const center = $derived(size / 2);
  const radius = $derived((size / 2) - (showLabels ? 36 : 12));
  const angleStep = $derived((Math.PI * 2) / domainKeys.length);

  // Compute normalized score [0, 5] to radial coordinates
  const polygonPoints = $derived(() => {
    return domainKeys
      .map((key, i) => {
        const item = competencies[key];
        const score = item?.score ?? 3.0; // default 3.0
        const r = (Math.max(0.5, Math.min(5.0, score)) / 5.0) * radius;
        const angle = i * angleStep - Math.PI / 2;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  });

  const axisEndpoints = $derived(() => {
    return domainKeys.map((key, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      const labelX = center + (radius + 20) * Math.cos(angle);
      const labelY = center + (radius + 16) * Math.sin(angle);
      return {
        key,
        label: domainLabels[key],
        x,
        y,
        labelX,
        labelY,
        score: competencies[key]?.score ?? 3.0
      };
    });
  });

  // Reference rings at 2.0 (Developing), 3.5 (Proficient), 5.0 (Advanced)
  const rings = [0.4, 0.7, 1.0];

  function ringPolygonPoints(fraction: number): string {
    return domainKeys
      .map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + (radius * fraction) * Math.cos(angle);
        const y = center + (radius * fraction) * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }
</script>

<div class="relative flex flex-col items-center justify-center">
  <svg width={size} height={size} class="overflow-visible">
    <!-- Straight polygonal reference grid rings (Zero Curve Lines) -->
    {#each rings as fraction}
      <polygon
        points={ringPolygonPoints(fraction)}
        class="fill-transparent stroke-border"
        stroke-dasharray={fraction < 1.0 ? '3 3' : 'none'}
        stroke-width="1"
        stroke-linejoin="miter"
      />
    {/each}

    <!-- Axis spokes -->
    {#each axisEndpoints() as axis}
      <line
        x1={center}
        y1={center}
        x2={axis.x}
        y2={axis.y}
        class="stroke-border"
        stroke-width="1"
      />
    {/each}

    <!-- Learner ability polygon -->
    <polygon
      points={polygonPoints()}
      class="{fillColor} {strokeColor} transition-all duration-500"
      stroke-width="2"
      stroke-linejoin="miter"
    />

    <!-- Data vertices with sharp technical square markers -->
    {#each axisEndpoints() as axis}
      {@const item = competencies[axis.key]}
      {@const score = item?.score ?? 3.0}
      {@const r = (Math.max(0.5, Math.min(5.0, score)) / 5.0) * radius}
      {@const angle = domainKeys.indexOf(axis.key) * angleStep - Math.PI / 2}
      {@const dotX = center + r * Math.cos(angle)}
      {@const dotY = center + r * Math.sin(angle)}
      <rect
        x={dotX - 3.5}
        y={dotY - 3.5}
        width="7"
        height="7"
        class="fill-brand stroke-canvas"
        stroke-width="1.5"
      />
    {/each}

    <!-- Outer axis labels -->
    {#if showLabels}
      {#each axisEndpoints() as axis}
        <text
          x={axis.labelX}
          y={axis.labelY}
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-[10px] fill-ink-secondary font-medium select-none"
        >
          {axis.label}
        </text>
      {/each}
    {/if}
  </svg>
</div>
