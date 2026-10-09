<script lang="ts">
  import { Chart, Svg, Spline, Axis, Grid, Tooltip } from 'layerchart';
  // D3 continuous linear scale and linear curve generator for latent IRT parameter domain
  import { scaleLinear } from 'd3-scale';
  import { curveLinear } from 'd3-shape';
  import { Activity, Sliders, Info } from 'lucide-svelte';

  interface Props {
    a?: number; // Discrimination (0.5 to 2.5)
    b?: number; // Difficulty (-3.0 to +3.0)
    c?: number; // Guessing parameter (0.0 to 0.4)
    showControls?: boolean;
    studentTheta?: number;
  }

  let {
    a = $bindable(1.2),
    b = $bindable(0.4),
    c = $bindable(0.2),
    showControls = true,
    studentTheta
  }: Props = $props();

  // Generate 3PL IRT probability curve & Fisher Information data
  let irtPoints = $derived.by(() => {
    const points: Array<{
      theta: number;
      probability: number;
      information: number;
    }> = [];

    for (let theta = -3.0; theta <= 3.01; theta += 0.15) {
      const roundedTheta = Math.round(theta * 100) / 100;
      // 3PL IRT Model: P(θ) = c + (1 - c) / (1 + e^(-a * (θ - b)))
      const exponent = -a * (roundedTheta - b);
      const logistic = 1 / (1 + Math.exp(exponent));
      const probability = c + (1 - c) * logistic;

      // Fisher Information Function: I(θ) = a^2 * [(P(θ) - c)^2 / (1 - c)^2] * [(1 - P(θ)) / P(θ)]
      const pMinusC = Math.max(0.0001, probability - c);
      const oneMinusC = Math.max(0.0001, 1 - c);
      const oneMinusP = Math.max(0.0001, 1 - probability);
      const information = (a * a) * (Math.pow(pMinusC, 2) / Math.pow(oneMinusC, 2)) * (oneMinusP / probability);

      points.push({
        theta: roundedTheta,
        probability: Math.round(probability * 1000) / 1000,
        information: Math.min(2.5, Math.round(information * 1000) / 1000)
      });
    }

    return points;
  });

  // Calculate probability at student theta if provided
  let studentProbability = $derived.by(() => {
    if (studentTheta === undefined) return null;
    const exponent = -a * (studentTheta - b);
    const logistic = 1 / (1 + Math.exp(exponent));
    return Math.round((c + (1 - c) * logistic) * 100);
  });
</script>

<div class="rounded-none border border-border-subtle bg-surface-2 p-4 space-y-4">
  <!-- Chart Header -->
  <div class="flex items-center justify-between pb-2 border-b border-border-subtle">
    <div class="flex items-center gap-2">
      <Activity class="w-4 h-4 text-mint" />
      <span class="text-xs font-semibold text-foreground tracking-tight">
        Item Characteristic Curve (3PL IRT)
      </span>
    </div>

    <div class="flex items-center gap-3 text-[11px] font-mono">
      <div class="flex items-center gap-1.5 text-foreground-secondary">
        <span class="w-2.5 h-0.5 bg-mint rounded-none"></span>
        <span>P(θ) Response</span>
      </div>
      <div class="flex items-center gap-1.5 text-foreground-secondary">
        <span class="w-2.5 h-0.5 bg-violet border-b border-violet rounded-none"></span>
        <span>I(θ) Information</span>
      </div>
    </div>
  </div>

  <!-- LayerChart Visualization Container -->
  <div class="h-56 w-full relative">
    <Chart
      data={irtPoints}
      x="theta"
      xScale={scaleLinear()}
      xDomain={[-3, 3]}
      y="probability"
      yScale={scaleLinear()}
      yDomain={[0, 1]}
      padding={{ top: 12, right: 16, bottom: 28, left: 32 }}
    >
      <Svg>
        <Grid
          x
          y
          classes={{
            line: 'stroke-border-subtle/50! stroke-dasharray-none!'
          }}
        />
        <Axis
          placement="bottom"
          format={(v) => `${v > 0 ? '+' : ''}${v}θ`}
          classes={{
            rule: 'stroke-border-subtle!',
            tick: 'stroke-border-subtle!',
            tickLabel: 'fill-foreground-muted! text-[10px]! font-mono!'
          }}
        />
        <Axis
          placement="left"
          format={(v) => `${Math.round(v * 100)}%`}
          classes={{
            rule: 'stroke-border-subtle!',
            tick: 'stroke-border-subtle!',
            tickLabel: 'fill-foreground-muted! text-[10px]! font-mono!'
          }}
        />

        <!-- Probability Linear Line (Performance Mint) -->
        <Spline
          y="probability"
          curve={curveLinear}
          class="stroke-mint! stroke-2! fill-none!"
        />

        <!-- Fisher Information Linear Line (Digital Violet) -->
        <Spline
          y={(d) => d.information / 2.5}
          curve={curveLinear}
          class="stroke-violet! stroke-[1.5px]! stroke-dashed! fill-none!"
        />
      </Svg>
    </Chart>

    <!-- Student Ability Indicator Marker if provided -->
    {#if studentTheta !== undefined && studentProbability !== null}
      <div class="absolute top-2 right-2 px-2 py-1 rounded-none bg-surface-3 border border-mint/30 text-[10px] font-mono text-foreground flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-none bg-mint animate-pulse"></span>
        <span>Learner θ: {studentTheta > 0 ? '+' : ''}{studentTheta} → {studentProbability}% P(correct)</span>
      </div>
    {/if}
  </div>

  <!-- Interactive Parameter Calibration Sliders -->
  {#if showControls}
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border-subtle/80 text-xs">
      <!-- Discrimination (a) -->
      <div class="space-y-1">
        <div class="flex items-center justify-between font-mono text-[11px]">
          <span class="text-foreground-secondary">Discrimination (a)</span>
          <span class="text-mint font-semibold">{a.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.05"
          bind:value={a}
          class="w-full accent-mint h-1 bg-surface-subtle rounded-none cursor-pointer"
        />
        <span class="text-[10px] text-foreground-muted block">Slope sharpness at inflection</span>
      </div>

      <!-- Difficulty (b) -->
      <div class="space-y-1">
        <div class="flex items-center justify-between font-mono text-[11px]">
          <span class="text-foreground-secondary">Difficulty (b)</span>
          <span class="text-foreground font-semibold">{b > 0 ? '+' : ''}{b.toFixed(2)}θ</span>
        </div>
        <input
          type="range"
          min="-2.5"
          max="2.5"
          step="0.1"
          bind:value={b}
          class="w-full accent-mint h-1 bg-surface-subtle rounded-none cursor-pointer"
        />
        <span class="text-[10px] text-foreground-muted block">θ point of 50% true mastery</span>
      </div>

      <!-- Guessing (c) -->
      <div class="space-y-1">
        <div class="flex items-center justify-between font-mono text-[11px]">
          <span class="text-foreground-secondary">Guessing (c)</span>
          <span class="text-violet font-semibold">{Math.round(c * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="0.4"
          step="0.05"
          bind:value={c}
          class="w-full accent-violet h-1 bg-surface-subtle rounded-none cursor-pointer"
        />
        <span class="text-[10px] text-foreground-muted block">Lower asymptotic baseline</span>
      </div>
    </div>
  {/if}
</div>
