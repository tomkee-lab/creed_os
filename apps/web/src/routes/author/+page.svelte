<script lang="ts">
  import {
    Sliders,
    PenTool,
    Database,
    Activity,
    CheckCircle2,
    Sparkles,
    Search,
    Filter,
    Plus,
    Layers,
    BookOpen,
    HelpCircle,
    Info,
    ChevronRight,
    ArrowUpRight
  } from 'lucide-svelte';
  import type { AssessmentItem } from '@core-os/domain';
  import { Button, Badge, Card, Tabs, Input } from '$lib/components';

  let { data } = $props();

  let authoredItems = $state<AssessmentItem[]>([]);
  let itemBank = $derived<AssessmentItem[]>([...authoredItems, ...data.itemBank]);
  let metrics = $derived(data.metrics);

  // Authoring form state
  let promptText = $state(
    'A cylindrical container of radius 4 cm is half-filled with liquid. When 3 identical metal cubes of side 2 cm are submerged, what is the liquid height rise?'
  );
  let selectedCompetency = $state<string>('spatial_reasoning');
  let gradeBand = $state<string>('Middle Stage (Classes 6–8)');

  // 3PL IRT Parameters
  let paramA = $state<number>(1.35); // Discrimination
  let paramB = $state<number>(0.50); // Difficulty
  let paramC = $state<number>(0.20); // Pseudo-guessing

  // Multiple Choice Options
  let options = $state([
    { id: 'opt-a', text: '0.48 cm', misconception: 'Direct linear division without area conversion' },
    { id: 'opt-b', text: '0.95 cm', misconception: '' },
    { id: 'opt-c', text: '1.20 cm', misconception: 'Added surface area instead of displacement volume' },
    { id: 'opt-d', text: '2.00 cm', misconception: 'Assumed cube side equals direct height change' }
  ]);

  let correctOptionIndex = $state<number>(1);
  let feedbackMessage = $state<string | null>(null);
  let bankFilter = $state<string>('ALL');
  let searchQuery = $state<string>('');

  const domainTabs = [
    { id: 'ALL', label: 'All Domains' },
    { id: 'spatial_reasoning', label: 'Spatial' },
    { id: 'computational_thinking', label: 'Computational' },
    { id: 'quantitative_reasoning', label: 'Quantitative' }
  ];

  // 3PL Fisher Information function
  function fisherInfo(theta: number, a: number, b: number, c: number): number {
    const D = 1.7;
    const expTerm = Math.exp(-D * a * (theta - b));
    const P = c + (1 - c) / (1 + expTerm);
    const Q = 1 - P;
    const dP = (D * a * (1 - c) * expTerm) / Math.pow(1 + expTerm, 2);
    return Math.pow(dP, 2) / Math.max(0.001, P * Q);
  }

  // Generate points for SVG path across theta in [-3.0, +3.0]
  const infoCurvePoints = $derived(() => {
    const svgWidth = 360;
    const svgHeight = 140;
    const padding = 20;
    const w = svgWidth - padding * 2;
    const h = svgHeight - padding * 2;

    const thetas: number[] = [];
    const step = 6.0 / 24;
    for (let i = 0; i <= 24; i++) {
      thetas.push(-3.0 + i * step);
    }

    const infoValues = thetas.map((th) => fisherInfo(th, paramA, paramB, paramC));
    const maxInfo = Math.max(1.2, ...infoValues);

    const pts = thetas.map((th, i) => {
      const x = padding + ((th + 3.0) / 6.0) * w;
      const y = svgHeight - padding - (infoValues[i] / maxInfo) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return {
      polyline: pts.join(' '),
      maxInfo: Number(maxInfo.toFixed(2)),
      peakTheta: paramB
    };
  });

  const filteredItems = $derived(
    itemBank.filter((item) => {
      const matchesFilter = bankFilter === 'ALL' || item.competency === bankFilter;
      const matchesSearch =
        item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
  );

  function handlePublishItem() {
    const newItemId = `ITEM-${selectedCompetency.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const formattedOptions = options.map((opt) => ({
      id: opt.id,
      text: opt.text
    }));

    const correctOptionId = options[correctOptionIndex].id;
    const distractors = options
      .filter((_, idx) => idx !== correctOptionIndex)
      .map((opt) => ({
        id: opt.id,
        text: opt.text,
        misconceptionDescription: opt.misconception
      }));

    const newItem: AssessmentItem = {
      id: newItemId,
      code: newItemId,
      prompt: promptText,
      competency: selectedCompetency as any,
      skillId: `SKILL-${selectedCompetency.toUpperCase()}-01`,
      explanation: 'Server-authoritative psychometric solution explanation.',
      options: formattedOptions,
      correctOptionId,
      distractors,
      irt: {
        a: paramA,
        b: paramB,
        c: paramC
      },
      ageBand: [11, 14],
      status: 'calibrated'
    };

    authoredItems = [newItem, ...authoredItems];
    feedbackMessage = `Item ${newItemId} successfully calibrated & added to item bank!`;

    setTimeout(() => {
      feedbackMessage = null;
    }, 4000);
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Feedback Banner -->
  {#if feedbackMessage}
    <div class="p-4 rounded-xl badge-growth text-xs flex items-center justify-between transition-all">
      <div class="flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 shrink-0" />
        <span>{feedbackMessage}</span>
      </div>
      <button
        type="button"
        onclick={() => (feedbackMessage = null)}
        class="font-bold underline cursor-pointer"
      >
        Dismiss
      </button>
    </div>
  {/if}

  <!-- Header & Psychometric Standards (WAY Console) -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-(--border-subtle)">
    <div>
      <div class="flex items-center gap-2.5">
        <div class="p-2 rounded-xl bg-(--surface-sunken) text-(--accent-primary) border border-(--border-subtle)">
          <Sliders class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-(--text-primary)">
              Psychometric Item Bank & Calibration Studio
            </h1>
            <Badge variant="neutral" size="sm">
              Console Mode
            </Badge>
          </div>
          <p class="text-xs text-(--text-muted) mt-0.5">
            Calibrate 3-Parameter Logistic (3PL) Item Response Theory Models • Fisher Information Curves
          </p>
        </div>
      </div>
    </div>

    <!-- Active Metrics -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-xl surface-card text-xs font-mono text-(--text-primary)">
        <Database class="w-4 h-4 text-(--accent-primary)" />
        <span>Bank: {itemBank.length} Items</span>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
    <!-- Left Column (5 cols): Item Bank Dense Table -->
    <Card variant="raised" class="lg:col-span-5 p-6 space-y-4">
      <div class="flex items-center justify-between border-b border-(--border-subtle) pb-3">
        <div>
          <h2 class="text-base font-bold text-(--text-primary)">Calibrated Item Bank</h2>
          <p class="text-xs text-(--text-muted)">IRT parameters & misconception tags.</p>
        </div>
        <span class="text-xs font-mono text-(--accent-primary) font-semibold">
          {filteredItems.length} active
        </span>
      </div>

      <!-- Search & Filter -->
      <div class="space-y-2">
        <Input
          type="search"
          bind:value={searchQuery}
          placeholder="Search items or codes..."
          icon={Search}
        />

        <Tabs
          items={domainTabs}
          bind:activeId={bankFilter}
          variant="pills"
        />
      </div>

      <!-- Items List -->
      <div class="space-y-3 max-h-145 overflow-y-auto pr-1">
        {#each filteredItems as item}
          <Card variant="sunken" padding="sm" class="space-y-2 text-xs" interactive>
            <div class="flex items-center justify-between font-mono text-[11px]">
              <span class="font-bold text-(--accent-primary)">{item.code}</span>
              <span class="text-(--text-muted)">b = {item.irt.b.toFixed(2)}</span>
            </div>
            <p class="text-(--text-secondary) line-clamp-2 leading-relaxed">
              {item.prompt}
            </p>
            <div class="pt-1 border-t border-(--border-subtle) flex items-center justify-between text-[10px] font-mono text-(--text-muted)">
              <span>a = {item.irt.a.toFixed(2)} (disc)</span>
              <span>c = {item.irt.c.toFixed(2)} (guess)</span>
              <span class="text-(--accent-success)">Calibrated</span>
            </div>
          </Card>
        {/each}
      </div>
    </Card>

    <!-- Right Column (7 cols): Authoring & 3PL Calibration Panel -->
    <Card variant="raised" class="lg:col-span-7 p-6 space-y-6">
      <div class="border-b border-(--border-subtle) pb-3">
        <h2 class="text-base font-bold text-(--text-primary)">Item Authoring & Parameter Calibration</h2>
        <p class="text-xs text-(--text-muted)">Configure prompt, distractor misconceptions, and 3PL parameters.</p>
      </div>

      <!-- Prompt Input -->
      <div class="space-y-1.5 text-xs">
        <label for="author-prompt" class="block font-semibold text-(--text-primary)">Item Prompt & Stimulus</label>
        <textarea
          id="author-prompt"
          bind:value={promptText}
          rows={3}
          class="w-full p-3 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary) leading-relaxed"
        ></textarea>
      </div>

      <!-- 3PL Parameter Sliders -->
      <Card variant="sunken" class="p-4 space-y-4 text-xs font-mono">
        <div class="flex items-center justify-between border-b border-(--border-subtle) pb-2 font-sans font-bold text-(--text-primary)">
          <span>3PL IRT Parameters</span>
          <span class="text-[11px] font-mono text-(--accent-primary)">Peak Info θ = {paramB.toFixed(2)}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="space-y-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-(--text-muted)">Discrimination (a)</span>
              <span class="font-bold text-(--text-primary)">{paramA.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.05"
              bind:value={paramA}
              class="w-full accent-(--accent-primary) cursor-pointer"
            />
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-(--text-muted)">Difficulty (b)</span>
              <span class="font-bold text-(--text-primary)">{paramB.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-2.5"
              max="2.5"
              step="0.05"
              bind:value={paramB}
              class="w-full accent-(--accent-primary) cursor-pointer"
            />
          </div>

          <div class="space-y-1">
            <div class="flex justify-between text-[11px]">
              <span class="text-(--text-muted)">Guessing (c)</span>
              <span class="font-bold text-(--text-primary)">{paramC.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.35"
              step="0.05"
              bind:value={paramC}
              class="w-full accent-(--accent-primary) cursor-pointer"
            />
          </div>
        </div>

        <!-- Fisher Information Curve SVG Preview -->
        <div class="pt-2">
          <div class="flex justify-between text-[10px] text-(--text-muted) font-mono pb-1">
            <span>Fisher Information Curve I(θ)</span>
            <span>Max Yield: {infoCurvePoints().maxInfo}</span>
          </div>
          <div class="w-full h-28 bg-(--surface-canvas) rounded-xl border border-(--border-subtle) p-2 flex items-center justify-center">
            <svg viewBox="0 0 360 140" class="w-full h-full overflow-visible">
              <line x1="20" y1="120" x2="340" y2="120" stroke="var(--border-strong)" stroke-width="1" />
              <polyline
                fill="none"
                stroke="var(--accent-primary)"
                stroke-width="2.5"
                points={infoCurvePoints().polyline}
              />
            </svg>
          </div>
        </div>
      </Card>

      <!-- Multiple Choice Options & Distractor Misconceptions -->
      <div class="space-y-3 text-xs">
        <span class="font-semibold text-(--text-primary) block">Options & Misconception Mappings</span>
        {#each options as opt, idx}
          <div class="p-3 rounded-xl border border-(--border-subtle) bg-(--surface-sunken) space-y-2">
            <div class="flex items-center gap-2">
              <input
                type="radio"
                name="correctOption"
                checked={correctOptionIndex === idx}
                onchange={() => (correctOptionIndex = idx)}
                class="accent-(--accent-primary) cursor-pointer"
              />
              <span class="font-bold text-(--text-primary) uppercase font-mono">Option {String.fromCharCode(65 + idx)}:</span>
              <input
                type="text"
                bind:value={opt.text}
                class="flex-1 px-2.5 py-1.5 rounded-none bg-(--surface-raised) border border-(--border-subtle) text-(--text-primary) focus:outline-none"
              />
              {#if correctOptionIndex === idx}
                <Badge variant="growth" size="sm">
                  CORRECT
                </Badge>
              {/if}
            </div>
            {#if correctOptionIndex !== idx}
              <input
                type="text"
                bind:value={opt.misconception}
                placeholder="Diagnosed misconception description..."
                class="w-full px-2.5 py-1.5 rounded-none bg-(--surface-raised) border border-(--border-subtle) text-[11px] text-(--text-secondary) placeholder-(--text-muted) focus:outline-none"
              />
            {/if}
          </div>
        {/each}
      </div>

      <!-- Submit Action -->
      <div class="pt-2 flex justify-end">
        <Button
          type="button"
          variant="primary"
          size="md"
          onclick={handlePublishItem}
        >
          <Plus class="w-4 h-4" />
          <span>Calibrate & Commit Item to Bank</span>
        </Button>
      </div>
    </Card>
  </div>
</div>

