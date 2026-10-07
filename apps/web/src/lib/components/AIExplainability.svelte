<script lang="ts">
  import { Sparkles, Info, X, Shield } from 'lucide-svelte';

  interface Props {
    label?: string;
    intent?: string;
    reasoning?: string;
    evidenceSources?: string[];
    evidenceUsed?: string | string[];
    limitations?: string;
    class?: string;
  }

  let {
    label = 'AI Guided Dialogue',
    intent,
    reasoning,
    evidenceSources,
    evidenceUsed,
    limitations = 'Purely formative Socratic dialogue; scores derive solely from verified assessment items.',
    class: className = ''
  }: Props = $props();

  let showExplain = $state(false);

  const displayIntent = $derived(
    reasoning || intent || 'Socratic problem decomposition without direct answer dumping.'
  );

  const normalizedEvidence = $derived.by(() => {
    if (evidenceSources && evidenceSources.length > 0) return evidenceSources;
    if (typeof evidenceUsed === 'string') return [evidenceUsed];
    if (Array.isArray(evidenceUsed)) return evidenceUsed;
    return ['Classroom observations', 'Recent adaptive diagnostic'];
  });
</script>

<div class="inline-flex items-center gap-1.5 {className}">
  <!-- Subtle Iris Marker (Semantic, never neon/glowing) -->
  <button
    type="button"
    onclick={() => (showExplain = !showExplain)}
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-ai-subtle text-ai border border-ai/20 text-[10px] font-medium hover:border-ai/40 transition-colors cursor-pointer"
    title="Click to view AI explainability & provenance"
  >
    <Sparkles class="w-3 h-3 text-ai" />
    <span>{label}</span>
    <Info class="w-2.5 h-2.5 opacity-60 ml-0.5" />
  </button>

  {#if showExplain}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      <div class="surface-card rounded-sm border border-border max-w-sm w-full p-5 space-y-3 shadow-xl">
        <div class="flex items-center justify-between border-b border-border pb-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-ink">
            <Sparkles class="w-3.5 h-3.5 text-ai" />
            <span>AI Reasoning & Provenance</span>
          </div>
          <button
            type="button"
            onclick={() => (showExplain = false)}
            class="text-ink-muted hover:text-ink p-1 rounded-sm cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="space-y-2 text-xs">
          <div>
            <strong class="block text-[11px] uppercase text-ink-muted">Reasoning Context</strong>
            <p class="text-ink-secondary leading-relaxed mt-0.5">{displayIntent}</p>
          </div>

          <div>
            <strong class="block text-[11px] uppercase text-ink-muted">Evidence Used</strong>
            <ul class="list-disc list-inside text-ink-secondary space-y-0.5 mt-0.5 text-[11px]">
              {#each normalizedEvidence as src}
                <li>{src}</li>
              {/each}
            </ul>
          </div>

          {#if limitations}
            <div>
              <strong class="block text-[11px] uppercase text-ink-muted">Limitations</strong>
              <p class="text-ink-secondary leading-relaxed mt-0.5 text-[11px]">{limitations}</p>
            </div>
          {/if}

          <div class="pt-2 border-t border-border flex items-center gap-1.5 text-[11px] text-positive">
            <Shield class="w-3 h-3" />
            <span>DPDP Act Child-Safe Constraints Enforced</span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
