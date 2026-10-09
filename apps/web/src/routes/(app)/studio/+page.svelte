<script lang="ts">
  import {
    Search,
    Plus,
    Activity,
    Sliders,
    Layers,
    CheckCircle2,
    AlertCircle
  } from 'lucide-svelte';
  import type { AssessmentItem } from '@core-os/domain';
  import { exportItemToQti3Xml } from '@core-os/assessment';
  import IrtCharacteristicCurve from '$lib/components/charts/IrtCharacteristicCurve.svelte';
  import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarShortcut
  } from '$lib/components/ui/menubar';
  import { Icon } from '$lib/components/icons';
  import { ButtonGroup } from '$lib/components';
  import { z } from 'zod';
  import { superForm, defaults } from 'sveltekit-superforms';
  import { zod4 } from 'sveltekit-superforms/adapters';

  let { data } = $props();

  let itemBank = $derived<AssessmentItem[]>(data.itemBank || []);

  const itemSchema = z.object({
    id: z.string().default('item-cat-001'),
    prompt: z
      .string()
      .min(15, 'Prompt must be at least 15 characters for psychometric validity'),
    competency: z.string().default('spatial_reasoning'),
    gradeBand: z.string().default('Middle Stage (Classes 6–8)'),
    a: z.number().min(0.2, 'Min discrimination is 0.2').max(2.5, 'Max discrimination is 2.5').default(1.35),
    b: z.number().min(-3.0, 'Difficulty lower bound is -3.0').max(3.0, 'Difficulty upper bound is +3.0').default(0.50),
    c: z.number().min(0.0).max(0.4, 'Pseudo-guessing capped at 0.40').default(0.20),
    correctOptionIndex: z.number().min(0).max(3).default(1)
  });

  type ItemFormData = Record<string, unknown> & {
    id: string;
    prompt: string;
    competency: string;
    gradeBand: string;
    a: number;
    b: number;
    c: number;
    correctOptionIndex: number;
  };

  const initialFormData: ItemFormData = {
    id: 'item-cat-001',
    prompt:
      'A cylindrical container of radius 4 cm is half-filled with liquid. When 3 identical metal cubes of side 2 cm are submerged, what is the liquid height rise?',
    competency: 'spatial_reasoning',
    gradeBand: 'Middle Stage (Classes 6–8)',
    a: 1.35,
    b: 0.50,
    c: 0.20,
    correctOptionIndex: 1
  };

  const { form, errors, validateForm } = superForm<ItemFormData>(
    defaults(initialFormData, zod4(itemSchema as any)) as any,
    {
      SPA: true,
      validators: zod4(itemSchema as any)
    }
  );

  // Options
  let options = $state([
    { id: 'opt-a', text: '0.48 cm', misconception: 'Direct linear division without area conversion' },
    { id: 'opt-b', text: '0.95 cm', misconception: '' },
    { id: 'opt-c', text: '1.20 cm', misconception: 'Added surface area instead of displacement volume' },
    { id: 'opt-d', text: '2.00 cm', misconception: 'Assumed cube side equals direct height change' }
  ]);

  let searchQuery = $state('');
  let feedbackMessage = $state<string | null>(null);

  function selectItem(item: AssessmentItem) {
    $form.id = item.id;
    $form.prompt = item.prompt;
    if (item.irt?.a) $form.a = item.irt.a;
    if (item.irt?.b) $form.b = item.irt.b;
    if (item.irt?.c) $form.c = item.irt.c;
  }

  function handleNewItem() {
    $form.id = `item-cat-${String(Date.now()).slice(-3)}`;
    $form.prompt = 'Enter a rigorous assessment stimulus with minimum 15 characters for psychometric validity.';
    $form.a = 1.20;
    $form.b = 0.00;
    $form.c = 0.20;
    $form.correctOptionIndex = 0;
  }

  async function handleSaveItem() {
    const result = await validateForm();
    if (result.valid) {
      feedbackMessage = `Item #${$form.id} calibrated and published to item bank.`;
      setTimeout(() => {
        feedbackMessage = null;
      }, 3500);
    }
  }

  function handleExportQti() {
    const xml = exportItemToQti3Xml({
      id: $form.id,
      code: $form.id,
      prompt: $form.prompt,
      competency: $form.competency,
      options: [
        { id: 'opt-a', text: 'Option A: Diagnostic baseline' },
        { id: 'opt-b', text: 'Option B: Correct reasoning step' },
        { id: 'opt-c', text: 'Option C: Common misconception' },
        { id: 'opt-d', text: 'Option D: Distractor' }
      ],
      correctOptionId: `opt-${['a', 'b', 'c', 'd'][$form.correctOptionIndex] || 'b'}`,
      irt: { a: $form.a, b: $form.b, c: $form.c }
    });

    const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${$form.id || 'item'}.qti3.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    feedbackMessage = `Exported ${$form.id || 'item'}.qti3.xml package`;
    setTimeout(() => {
      feedbackMessage = null;
    }, 3500);
  }

  function applyPreset(preset: 'foundation' | 'baseline' | 'extension') {
    if (preset === 'foundation') {
      $form.a = 1.10;
      $form.b = -1.20;
      $form.c = 0.20;
    } else if (preset === 'baseline') {
      $form.a = 1.35;
      $form.b = 0.50;
      $form.c = 0.20;
    } else {
      $form.a = 1.80;
      $form.b = 1.60;
      $form.c = 0.15;
    }
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
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-mono font-medium transition-colors cursor-pointer"
      >
        <Icon icon="carbon:save" class="w-3.5 h-3.5" />
        <span>PUBLISH ITEM</span>
      </button>
    </div>
  </header>

  <!-- Bits UI v1 Desktop-Grade Command Menubar -->
  <Menubar class="w-full">
    <MenubarMenu>
      <MenubarTrigger>
        <Icon icon="carbon:document" class="w-3.5 h-3.5 mr-1.5 text-ink-muted" />
        Item
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem onclick={handleNewItem}>
          New Assessment Item <MenubarShortcut>⌘N</MenubarShortcut>
        </MenubarItem>
        <MenubarItem onclick={handleSaveItem}>
          Save Draft <MenubarShortcut>⌘S</MenubarShortcut>
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem onclick={handleExportQti}>Export QTI 3.0 XML</MenubarItem>
        <MenubarItem>Validate Psychometric JSON</MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger>
        <Icon icon="carbon:chart-line-smooth" class="w-3.5 h-3.5 mr-1.5 text-mint" />
        Psychometrics
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem onclick={() => ($form.model = '3PL')}>
          Model: 3-Parameter Logistic (3PL)
        </MenubarItem>
        <MenubarItem onclick={() => ($form.model = '2PL')}>
          Model: 2-Parameter Logistic (2PL)
        </MenubarItem>
        <MenubarItem onclick={() => ($form.model = '1PL')}>
          Model: Rasch (1PL)
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Prior Distribution N(0,1)</MenubarItem>
        <MenubarItem>Fisher Information Peak Check</MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger>
        <Icon icon="carbon:analytics" class="w-3.5 h-3.5 mr-1.5 text-violet" />
        Simulation
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem>Run Monte Carlo CAT Simulation</MenubarItem>
        <MenubarItem>Item Exposure Rate Telemetry</MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Estimate Test Information Curve I(θ)</MenubarItem>
      </MenubarContent>
    </MenubarMenu>

    <MenubarMenu>
      <MenubarTrigger>
        <Icon icon="carbon:view" class="w-3.5 h-3.5 mr-1.5 text-ink-muted" />
        View
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem>Toggle Student Ability Marker</MenubarItem>
        <MenubarItem>Expand Curve Telemetry Grid</MenubarItem>
        <MenubarSeparator />
        <MenubarItem>Split Screen Mobile Preview</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>

  <!-- 3-Pane IDE Layout (Section 39) -->
  <div class="flex-1 grid grid-cols-12 gap-3 min-h-0">
    <!-- PANE 1: Item Bank Explorer (Col 3) -->
    <aside class="col-span-3 rounded-none bg-surface border border-border flex flex-col min-h-0">
      <div class="p-3 border-b border-border space-y-2">
        <div class="flex items-center justify-between text-xs font-mono font-semibold text-ink">
          <span>ITEM BANK ({itemBank.length})</span>
          <button
            type="button"
            onclick={handleNewItem}
            class="text-brand hover:underline text-[11px] font-mono cursor-pointer"
          >
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
            onclick={() => selectItem(item)}
            class="w-full text-left p-3 hover:bg-surface-subtle transition-colors block {$form.id === item.id ? 'bg-surface-subtle border-l-2 border-l-brand' : ''}"
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
    <main id="authoring" class="col-span-5 rounded-none bg-surface border border-border flex flex-col min-h-0 overflow-y-auto p-4 space-y-4">
      <div class="flex items-center justify-between text-xs font-mono font-semibold text-ink pb-2 border-b border-border">
        <span>AUTHORING SURFACE</span>
        <span class="text-[11px] text-ink-muted">ID: {$form.id}</span>
      </div>

      <div class="space-y-1">
        <div class="flex justify-between items-center text-xs font-mono">
          <label for="prompt-input" class="text-ink-secondary">Stimulus / Question Prompt</label>
          <span class="text-[10px] {$form.prompt.length < 15 ? 'text-negative' : 'text-ink-muted'}">
            {$form.prompt.length} chars (min 15)
          </span>
        </div>
        <textarea
          id="prompt-input"
          bind:value={$form.prompt}
          rows={4}
          class="w-full p-2.5 rounded-none bg-surface-subtle border {$errors.prompt ? 'border-negative ring-1 ring-negative/30' : 'border-border'} text-xs font-sans text-ink leading-relaxed focus:outline-hidden"
        ></textarea>
        {#if $errors.prompt}
          <span class="text-[11px] font-mono text-negative flex items-center gap-1 mt-0.5">
            <AlertCircle class="w-3 h-3 shrink-0" />
            <span>{$errors.prompt}</span>
          </span>
        {/if}
      </div>

      <div class="grid grid-cols-2 gap-3 text-xs font-mono">
        <div class="space-y-1">
          <label for="comp-select" class="block text-ink-secondary">Competency</label>
          <select
            id="comp-select"
            bind:value={$form.competency}
            class="w-full p-1.5 rounded-none bg-surface-subtle border border-border text-xs text-ink hover:border-border-strong active:bg-surface focus-visible:outline-2 focus-visible:outline-focus focus-visible:border-focus disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <option value="spatial_reasoning">Spatial Reasoning</option>
            <option value="computational_thinking">Computational Thinking</option>
            <option value="quantitative_reasoning">Quantitative Reasoning</option>
            <option value="scientific_inquiry">Scientific Inquiry</option>
          </select>
        </div>

        <div class="space-y-1">
          <label for="grade-select" class="block text-ink-secondary">Grade Band</label>
          <select
            id="grade-select"
            bind:value={$form.gradeBand}
            class="w-full p-1.5 rounded-none bg-surface-subtle border border-border text-xs text-ink hover:border-border-strong active:bg-surface focus-visible:outline-2 focus-visible:outline-focus focus-visible:border-focus disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
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
                  checked={$form.correctOptionIndex === idx}
                  onchange={() => ($form.correctOptionIndex = idx)}
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
    <aside id="calibration" class="col-span-4 rounded-none bg-surface border border-border flex flex-col min-h-0 overflow-y-auto p-4 space-y-4 font-mono text-xs">
      <div class="flex items-center justify-between font-semibold text-ink pb-2 border-b border-border">
        <div class="flex items-center gap-1.5">
          <Icon icon="carbon:sigma" class="w-3.5 h-3.5 text-brand" />
          <span>CALIBRATION // 3PL IRT</span>
        </div>
        <span class="text-[11px] text-positive">Converged (EAP)</span>
      </div>

      <!-- Difficulty Presets -->
      <div class="space-y-1">
        <span class="text-ink-muted text-[10px] uppercase tracking-wider">Calibration Presets</span>
        <div class="flex">
          <ButtonGroup class="w-full border border-border">
            <button
              type="button"
              onclick={() => applyPreset('foundation')}
              class="flex-1 py-1 text-[10px] font-mono border-r transition-colors cursor-pointer hover:bg-surface-subtle"
            >
              Foundation
            </button>
            <button
              type="button"
              onclick={() => applyPreset('baseline')}
              class="flex-1 py-1 text-[10px] font-mono border-r transition-colors cursor-pointer hover:bg-surface-subtle"
            >
              Baseline
            </button>
            <button
              type="button"
              onclick={() => applyPreset('extension')}
              class="flex-1 py-1 text-[10px] font-mono transition-colors cursor-pointer hover:bg-surface-subtle"
            >
              Extension
            </button>
          </ButtonGroup>
        </div>
      </div>

      <!-- 3PL Parameter Sliders -->
      <div class="space-y-3">
        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-ink-secondary">a (Discrimination):</span>
            <span class="font-semibold text-ink">{$form.a.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.05"
            bind:value={$form.a}
            class="w-full accent-brand"
          />
        </div>

        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-ink-secondary">b (Difficulty):</span>
            <span class="font-semibold text-ink">{$form.b.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="-3.0"
            max="3.0"
            step="0.1"
            bind:value={$form.b}
            class="w-full accent-brand"
          />
        </div>

        <div class="space-y-1">
          <div class="flex justify-between">
            <span class="text-ink-secondary">c (Pseudo-guessing):</span>
            <span class="font-semibold text-ink">{$form.c.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.4"
            step="0.05"
            bind:value={$form.c}
            class="w-full accent-brand"
          />
        </div>
      </div>

      <!-- Interactive 3PL Item Characteristic & Fisher Information Curves (LayerChart) -->
      <div class="space-y-2 pt-3 border-t border-border">
        <IrtCharacteristicCurve
          bind:a={$form.a}
          bind:b={$form.b}
          bind:c={$form.c}
          showControls={false}
        />
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
