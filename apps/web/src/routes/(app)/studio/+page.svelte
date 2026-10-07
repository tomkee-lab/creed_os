<script lang="ts">
  import {
    Search,
    Plus,
    Save,
    Activity,
    Sliders,
    Layers,
    CheckCircle2
  } from 'lucide-svelte';
  import type { AssessmentItem } from '@core-os/domain';

  let { data } = $props();

  let itemBank = $derived<AssessmentItem[]>(data.itemBank || []);

  // Selected or authored item
  let selectedItemId = $state<string>('item-cat-001');

  // Authoring form state
  let promptText = $state(
    'A cylindrical container of radius 4 cm is half-filled with liquid. When 3 identical metal cubes of side 2 cm are submerged, what is the liquid height rise?'
  );
  let selectedCompetency = $state<string>('spatial_reasoning');
  let gradeBand = $state<string>('Middle Stage (Classes 6–8)');

  // 3PL IRT Parameters
  let paramA = $state<number>(1.35); // Discrimination
  let paramB = $state<number>(0.50); // Difficulty
  let paramC = $state<number>(0.20); // Guessing

  // Options
  let options = $state([
    { id: 'opt-a', text: '0.48 cm', misconception: 'Direct linear division without area conversion' },
    { id: 'opt-b', text: '0.95 cm', misconception: '' },
    { id: 'opt-c', text: '1.20 cm', misconception: 'Added surface area instead of displacement volume' },
    { id: 'opt-d', text: '2.00 cm', misconception: 'Assumed cube side equals direct height change' }
  ]);
  let correctOptionIndex = $state<number>(1);

  let searchQuery = $state('');
  let feedbackMessage = $state<string | null>(null);

  // 3PL Fisher Information calculation
  function fisherInfo(theta: number, a: number, b: number, c: number): number {
    const D = 1.7;
    const expTerm = Math.exp(-D * a * (theta - b));
    const P = c + (1 - c) / (1 + expTerm);
    const Q = 1 - P;
    const dP = (D * a * (1 - c) * expTerm) / Math.pow(1 + expTerm, 2);
    return Math.pow(dP, 2) / Math.max(0.001, P * Q);
  }

  // Curve points across theta in [-3.0, +3.0]
  const curvePoints = $derived.by(() => {
    const pts: string[] = [];
    const step = 0.2;
    for (let theta = -3.0; theta <= 3.0; theta += step) {
      const info = fisherInfo(theta, paramA, paramB, paramC);
      const x = ((theta + 3.0) / 6.0) * 260 + 20;
      const y = 140 - Math.min(120, info * 40);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  });

  function handleSaveItem() {
    feedbackMessage = 'Item #ITM-804 calibrated and published to item bank.';
    setTimeout(() => {
      feedbackMessage = null;
    }, 3500);
  }
</script>

<svelte:head>
  <title>Item Studio — CREED OS</title>
</svelte:head>

<div class="h-[calc(100vh-120px)] flex flex-col space-y-3 py-1">
  <!-- Top Tool Header -->
  <header class="flex items-center justify-between pb-2 border-b border-border">
    <div class="flex items-center gap-3">
      <h1 class="text-xl font-mono font-semibold tracking-tight text-ink">
        ITEM_STUDIO // PSYCHOMETRICS
      </h1>
      <span class="text-xs font-mono px-2 py-0.5 rounded-none bg-surface-subtle text-ink-secondary border border-border">
        CAT-IRT Engine v2.1
      </span>
    </div>

    <div class="flex items-center gap-3">
      {#if feedbackMessage}
        <span class="text-xs font-mono text-positive flex items-center gap-1">
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>{feedbackMessage}</span>
        </span>
      {/if}
      <button
        type="button"
        onclick={handleSaveItem}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-brand hover:bg-brand/90 text-white text-xs font-mono font-medium transition-colors cursor-pointer"
      >
        <Save class="w-3.5 h-3.5" />
        <span>PUBLISH ITEM</span>
      </button>
    </div>
  </header>

  <!-- 3-Pane IDE Layout (Section 39) -->
  <div class="flex-1 grid grid-cols-12 gap-3 min-h-0">
    <!-- PANE 1: Item Bank Explorer (Col 3) -->
    <aside class="col-span-3 rounded-none bg-surface border border-border flex flex-col min-h-0">
      <div class="p-3 border-b border-border space-y-2">
        <div class="flex items-center justify-between text-xs font-mono font-semibold text-ink">
          <span>ITEM BANK ({itemBank.length})</span>
          <button type="button" class="text-brand hover:underline text-[11px] font-mono cursor-pointer">
            + NEW
          </button>
        </div>
        <div class="relative">
          <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Filter items..."
            class="w-full pl-7 pr-2 py-1 rounded-none bg-surface-subtle border border-border text-xs font-mono text-ink placeholder-ink-muted focus:outline-hidden"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto divide-y divide-border text-xs font-mono">
        {#each itemBank as item}
          <button
            type="button"
            onclick={() => (selectedItemId = item.id)}
            class="w-full text-left p-3 hover:bg-surface-subtle transition-colors block {selectedItemId === item.id ? 'bg-surface-subtle border-l-2 border-l-brand' : ''}"
          >
            <div class="flex items-center justify-between">
              <span class="font-semibold text-ink truncate">{item.id}</span>
              <span class="text-[10px] text-ink-muted">b={item.irt?.b ?? 0.5}</span>
            </div>
            <p class="text-[11px] text-ink-secondary truncate mt-1">
              {item.prompt}
            </p>
          </button>
        {/each}
      </div>
    </aside>

    <!-- PANE 2: Item Authoring Editor (Col 5) -->
    <main class="col-span-5 rounded-none bg-surface border border-border flex flex-col min-h-0 overflow-y-auto p-4 space-y-4">
      <div class="flex items-center justify-between text-xs font-mono font-semibold text-ink pb-2 border-b border-border">
        <span>AUTHORING SURFACE</span>
        <span class="text-[11px] text-ink-muted">ID: {selectedItemId}</span>
      </div>

      <div class="space-y-1">
        <label for="prompt-input" class="block text-xs font-mono text-ink-secondary">Stimulus / Question Prompt</label>
        <textarea
          id="prompt-input"
          bind:value={promptText}
          rows={4}
          class="w-full p-2.5 rounded-none bg-surface-subtle border border-border text-xs font-sans text-ink leading-relaxed focus:outline-hidden"
        ></textarea>
      </div>

      <div class="grid grid-cols-2 gap-3 text-xs font-mono">
        <div class="space-y-1">
          <label for="comp-select" class="block text-ink-secondary">Competency</label>
          <select
            id="comp-select"
            bind:value={selectedCompetency}
            class="w-full p-1.5 rounded-none bg-surface-subtle border border-border text-xs text-ink"
          >
            <option value="spatial_reasoning">Spatial Reasoning</option>
            <option value="computational_thinking">Computational Thinking</option>
            <option value="quantitative_reasoning">Quantitative Reasoning</option>
          </select>
        </div>

        <div class="space-y-1">
          <label for="grade-select" class="block text-ink-secondary">Grade Band</label>
          <select
            id="grade-select"
            bind:value={gradeBand}
            class="w-full p-1.5 rounded-none bg-surface-subtle border border-border text-xs text-ink"
          >
            <option>Middle Stage (Classes 6–8)</option>
            <option>Secondary Stage (Classes 9–10)</option>
          </select>
        </div>
      </div>

      <!-- Multiple Choice Options & Misconceptions -->
      <div class="space-y-2 pt-2 border-t border-border">
        <span class="text-xs font-mono font-semibold text-ink block">Distractors & Diagnostic Misconceptions</span>
        <div class="space-y-2">
          {#each options as opt, idx}
            <div class="p-2.5 rounded-none bg-surface-subtle border border-border space-y-1.5 text-xs font-mono">
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct-option"
                  checked={correctOptionIndex === idx}
                  onchange={() => (correctOptionIndex = idx)}
                  class="text-brand"
                />
                <span class="font-semibold text-ink">Option {String.fromCharCode(65 + idx)}</span>
                <input
                  type="text"
                  bind:value={opt.text}
                  class="flex-1 px-2 py-0.5 rounded-none bg-surface border border-border text-xs text-ink"
                />
              </div>
              <input
                type="text"
                bind:value={opt.misconception}
                placeholder="Misconception rationale (or leave empty if key)..."
                class="w-full px-2 py-0.5 rounded-none bg-surface border border-border text-[11px] text-ink-secondary placeholder-ink-muted"
              />
            </div>
          {/each}
        </div>
      </div>
    </main>

    <!-- PANE 3: Psychometric Calibration (Col 4) -->
    <aside class="col-span-4 rounded-none bg-surface border border-border flex flex-col min-h-0 overflow-y-auto p-4 space-y-4 font-mono text-xs">
      <div class="flex items-center justify-between font-semibold text-ink pb-2 border-b border-border">
        <span>CALIBRATION // 3PL IRT</span>
        <span class="text-[11px] text-positive">Converged (EAP)</span>
      </div>

      <!-- 3PL Parameter Sliders -->
      <div class="space-y-3">
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-ink-secondary">a (Discrimination):</span>
            <span class="font-semibold text-ink">{paramA.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.05"
            bind:value={paramA}
            class="w-full accent-brand"
          />
        </div>

        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-ink-secondary">b (Difficulty):</span>
            <span class="font-semibold text-ink">{paramB.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-3.0"
            max="3.0"
            step="0.1"
            bind:value={paramB}
            class="w-full accent-brand"
          />
        </div>

        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-ink-secondary">c (Pseudo-guessing):</span>
            <span class="font-semibold text-ink">{paramC.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.4"
            step="0.05"
            bind:value={paramC}
            class="w-full accent-brand"
          />
        </div>
      </div>

      <!-- Fisher Information Curve SVG -->
      <div class="space-y-2 pt-3 border-t border-border">
        <div class="flex justify-between text-[11px]">
          <span class="text-ink-secondary">Fisher Information I(&theta;)</span>
          <span class="text-ink-muted">Max Peak @ &theta;={paramB.toFixed(2)}</span>
        </div>

        <div class="p-2 rounded-none bg-surface-subtle border border-border">
          <svg viewBox="0 0 300 160" class="w-full h-36">
            <!-- Grid lines -->
            <line x1="20" y1="140" x2="280" y2="140" stroke="var(--color-border)" stroke-width="1" />
            <line x1="150" y1="20" x2="150" y2="140" stroke="var(--color-border)" stroke-dasharray="2,2" stroke-width="1" />
            
            <!-- Axis labels -->
            <text x="20" y="155" fill="var(--color-ink-muted)" font-size="9" font-family="monospace">-3.0</text>
            <text x="145" y="155" fill="var(--color-ink-muted)" font-size="9" font-family="monospace">0.0</text>
            <text x="270" y="155" fill="var(--color-ink-muted)" font-size="9" font-family="monospace">+3.0</text>

            <!-- Curve -->
            <polyline
              points={curvePoints}
              fill="none"
              stroke="var(--color-brand)"
              stroke-width="2"
            />
          </svg>
        </div>
      </div>

      <!-- Item Metrics Readout -->
      <div class="p-3 rounded-none bg-surface-subtle border border-border space-y-1.5 text-[11px]">
        <div class="flex justify-between">
          <span class="text-ink-secondary">Expected SE(&theta;=0):</span>
          <span class="font-semibold text-ink">0.28</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-secondary">CAT Stopping Criterion:</span>
          <span class="font-semibold text-ink">SE &le; 0.30</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-secondary">Differential Item Functioning:</span>
          <span class="font-semibold text-positive">Negligible</span>
        </div>
      </div>
    </aside>
  </div>
</div>
