<script lang="ts">
  import { Chart, Svg, Area, Spline, Points, Axis, Grid } from 'layerchart';
  // D3 continuous linear, point scales, and linear curve generator for Bayesian growth ribbon
  import { scaleLinear, scalePoint } from 'd3-scale';
  import { curveLinear } from 'd3-shape';
  import { TrendingUp, ShieldCheck, Activity, Award, Info } from 'lucide-svelte';

  export interface GrowthPoint {
    id: string;
    month: string;
    label: string;
    theta: number; // Latent ability estimate
    se: number;    // Standard error
    domain: string;
    evidenceCode: string;
    level: string; // Qualitative developmental level
    summary: string;
  }

  interface Props {
    data?: GrowthPoint[];
    activePointId?: string;
    onSelectPoint?: (point: GrowthPoint) => void;
  }

  const defaultGrowthData: GrowthPoint[] = [
    {
      id: 'gp-1',
      month: 'Oct 2025',
      label: 'Oct',
      theta: 0.15,
      se: 0.42,
      domain: 'Quantitative & Logic',
      evidenceCode: 'CAT-2025-Q1',
      level: 'Baseline Formed',
      summary: 'Initial CAT baseline diagnostic. High cognitive pace on proportional patterns.'
    },
    {
      id: 'gp-2',
      month: 'Dec 2025',
      label: 'Dec',
      theta: 0.48,
      se: 0.35,
      domain: 'Spatial Reasoning',
      evidenceCode: 'PRJ-KIN-08',
      level: 'Active Mastery',
      summary: 'Dual-axis linkage robotics build. Demonstrated 3D rotational mechanics fluency.'
    },
    {
      id: 'gp-3',
      month: 'Jan 2026',
      label: 'Jan',
      theta: 0.72,
      se: 0.30,
      domain: 'Computational Thinking',
      evidenceCode: 'LAB-ALG-04',
      level: 'Advancing Fluency',
      summary: 'Recursive pathfinding lab. Eliminated redundant states via memoization.'
    },
    {
      id: 'gp-4',
      month: 'Feb 2026',
      label: 'Feb',
      theta: 0.95,
      se: 0.28,
      domain: 'Scientific Inquiry',
      evidenceCode: 'SOC-AI-19',
      level: 'Deep Inquiry',
      summary: 'Socratic dialogue on thermal dissipation and resistance variance.'
    },
    {
      id: 'gp-5',
      month: 'Mar 2026',
      label: 'Mar',
      theta: 1.25,
      se: 0.22,
      domain: 'Holistic Profile',
      evidenceCode: 'CAT-2026-M3',
      level: 'Verified Growth Horizon',
      summary: 'Multi-stage adaptive verification. Minimal SE with high stopping confidence.'
    }
  ];

  let {
    data = defaultGrowthData,
    activePointId,
    onSelectPoint
  }: Props = $props();

  let selectedId = $state<string | null>(null);

  // Active highlighted point
  let currentPoint = $derived.by(() => {
    const targetId = activePointId ?? selectedId;
    if (targetId) {
      const match = data.find((p) => p.id === targetId);
      if (match) return match;
    }
    return data[data.length - 1]; // Default to latest milestone
  });

  // Calculate ribbon values: y0 = theta - 1.96*se, y1 = theta + 1.96*se
  let chartSeries = $derived.by(() => {
    return data.map((d, index) => ({
      ...d,
      index,
      lowerBound: Math.round((d.theta - d.se * 1.96) * 100) / 100,
      upperBound: Math.round((d.theta + d.se * 1.96) * 100) / 100
    }));
  });

  function handleSelect(point: GrowthPoint) {
    selectedId = point.id;
    onSelectPoint?.(point);
  }
</script>

<div class="rounded-none border border-border-subtle bg-surface-2 p-5 space-y-5">
  <!-- Header: Signal & Level Context -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <TrendingUp class="w-4 h-4 text-mint" />
        <h3 class="text-sm font-semibold text-foreground tracking-tight">
          Longitudinal Developmental Trajectory
        </h3>
        <span class="text-[10px] font-mono px-1.5 py-0.5 rounded-none bg-surface-3 text-mint border border-mint/20">
          Bayesian EAP
        </span>
      </div>
      <p class="text-xs text-foreground-secondary">
        Adaptive latent ability progression with Standard Error confidence ribbon (&plusmn;1.96 SE).
      </p>
    </div>

    <!-- Qualitative Horizon Legend -->
    <div class="flex items-center gap-4 text-[11px] font-mono">
      <div class="flex items-center gap-1.5 text-foreground-secondary">
        <span class="w-3 h-0.5 bg-mint rounded-none"></span>
        <span>Mean Trajectory (&theta;)</span>
      </div>
      <div class="flex items-center gap-1.5 text-foreground-secondary">
        <span class="w-3 h-2 bg-mint/20 border border-mint/40 rounded-none"></span>
        <span>95% Confidence Band</span>
      </div>
    </div>
  </div>

  <!-- LayerChart Visual Area -->
  <div class="h-64 w-full relative">
    <Chart
      data={chartSeries}
      x="index"
      xScale={scaleLinear()}
      xDomain={[0, chartSeries.length - 1]}
      y="theta"
      yScale={scaleLinear()}
      yDomain={[-0.5, 2.0]}
      padding={{ top: 16, right: 24, bottom: 32, left: 48 }}
    >
      <Svg>
        <Grid
          x
          y
          classes={{
            line: '!stroke-border-subtle/40 !stroke-dasharray-none'
          }}
        />

        <!-- Quantitative X-Axis (Timeline months) -->
        <Axis
          placement="bottom"
          ticks={chartSeries.map((d) => d.index)}
          format={(idx: number) => chartSeries[Number(idx)]?.month ?? ''}
          classes={{
            rule: 'stroke-border-subtle!',
            tick: 'stroke-border-subtle!',
            tickLabel: 'fill-foreground-muted! text-[10px]! font-mono!'
          }}
        />

        <!-- Latent Theta Y-Axis -->
        <Axis
          placement="left"
          format={(v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}θ`}
          classes={{
            rule: 'stroke-border-subtle!',
            tick: 'stroke-border-subtle!',
            tickLabel: 'fill-foreground-muted! text-[10px]! font-mono!'
          }}
        />

        <!-- Qualitative Threshold reference lines -->
        <line
          x1="0%"
          x2="100%"
          y1="33%"
          y2="33%"
          class="stroke-border-subtle/60 stroke-dashed"
        />

        <!-- Confidence Ribbon: 95% SE Interval (Straight Linear Segments) -->
        <Area
          y0="lowerBound"
          y1="upperBound"
          curve={curveLinear}
          class="fill-mint/15!"
        />

        <!-- Lower & Upper Boundary Guide Splines (Linear Segments) -->
        <Spline
          y="lowerBound"
          curve={curveLinear}
          class="stroke-mint/30! stroke-1! stroke-dashed! fill-none!"
        />
        <Spline
          y="upperBound"
          curve={curveLinear}
          class="stroke-mint/30! stroke-1! stroke-dashed! fill-none!"
        />

        <!-- Trajectory Mean Linear Line -->
        <Spline
          y="theta"
          curve={curveLinear}
          class="stroke-mint! stroke-2! fill-none!"
        />

        <!-- Assessment Milestone Points -->
        <Points
          class="fill-surface-2! stroke-mint! stroke-2! hover:scale-125! transition-transform cursor-pointer"
          r={5}
        />
      </Svg>
    </Chart>
  </div>

  <!-- Interactive Milestone Strip -->
  <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-border-subtle">
    {#each chartSeries as pt}
      {@const isSelected = currentPoint?.id === pt.id}
      <button
        type="button"
        onclick={() => handleSelect(pt)}
        class="text-left p-2.5 rounded-none border transition-all cursor-pointer {isSelected ? 'bg-surface-3 border-mint ring-1 ring-mint/30' : 'bg-surface-subtle border-border-subtle hover:bg-surface-3'}"
      >
        <div class="flex items-center justify-between text-[10px] font-mono">
          <span class="{isSelected ? 'text-mint font-semibold' : 'text-foreground-muted'}">{pt.month}</span>
          <span class="text-foreground-muted">SE {pt.se.toFixed(2)}</span>
        </div>
        <div class="font-semibold text-xs text-foreground truncate mt-1">
          {pt.level}
        </div>
        <div class="text-[11px] font-mono text-foreground-secondary mt-0.5">
          {pt.theta > 0 ? '+' : ''}{pt.theta.toFixed(2)}&theta;
        </div>
      </button>
    {/each}
  </div>

  <!-- Detailed Diagnostic Telemetry Card for Selected Point -->
  {#if currentPoint}
    <div class="p-4 rounded-none bg-surface-subtle border border-border-subtle space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border-subtle text-xs">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-none font-mono text-[10px] bg-mint/15 text-mint border border-mint/30 font-medium">
            {currentPoint.evidenceCode}
          </span>
          <span class="font-semibold text-foreground text-sm">
            {currentPoint.level}
          </span>
        </div>

        <div class="flex items-center gap-3 text-[11px] font-mono text-foreground-secondary">
          <span>Observed: {currentPoint.month}</span>
          <span>Domain: <strong class="text-foreground">{currentPoint.domain}</strong></span>
        </div>
      </div>

      <p class="text-xs text-foreground-secondary leading-relaxed">
        {currentPoint.summary}
      </p>

      <!-- Psychometric Precision Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
        <div class="p-2 rounded-none bg-surface-2 border border-border-subtle flex justify-between">
          <span class="text-foreground-muted">Latent Proficiency (&theta;):</span>
          <span class="font-semibold text-mint">{currentPoint.theta > 0 ? '+' : ''}{currentPoint.theta.toFixed(2)}</span>
        </div>
        <div class="p-2 rounded-none bg-surface-2 border border-border-subtle flex justify-between">
          <span class="text-foreground-muted">Measurement Error (SE):</span>
          <span class="font-semibold text-foreground">&plusmn;{currentPoint.se.toFixed(2)}</span>
        </div>
        <div class="p-2 rounded-none bg-surface-2 border border-border-subtle flex justify-between">
          <span class="text-foreground-muted">95% Interval:</span>
          <span class="font-semibold text-foreground">
            [{(currentPoint.theta - currentPoint.se * 1.96).toFixed(2)}, {(currentPoint.theta + currentPoint.se * 1.96).toFixed(2)}]
          </span>
        </div>
      </div>
    </div>
  {/if}
</div>
