<script lang="ts">
  import { Compass, HeartHandshake, ArrowRight, Sparkles } from 'lucide-svelte';

  interface Props {
    studentAspiration?: string;
    parentAspiration?: string;
    gapDescription: string;
    growthAction: string;
    showCounselorAction?: boolean;
    onReferCounselor?: () => void;
  }

  let {
    studentAspiration = 'AI Systems & Robotics Engineering',
    parentAspiration = 'Clinical Medicine & Surgery',
    gapDescription,
    growthAction,
    showCounselorAction = true,
    onReferCounselor
  }: Props = $props();
</script>

<div class="bg-surface border border-border p-5 space-y-4 border-l-4 border-l-attention rounded-none">
  <div class="flex items-start gap-3">
    <div class="p-2 rounded-none bg-attention-subtle text-attention shrink-0 mt-0.5">
      <Compass class="w-5 h-5" />
    </div>
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <h4 class="text-sm font-bold text-ink">
          Family Pathway Alignment Dialogue
        </h4>
        <span class="text-[10px] font-medium px-2 py-0.5 rounded-none badge-focus">
          Growth Navigation
        </span>
      </div>
      <p class="text-xs text-ink-secondary leading-relaxed">
        {gapDescription}
      </p>
    </div>
  </div>

  <div class="grid sm:grid-cols-2 gap-3 pt-2 border-t border-border text-xs">
    <div class="bg-surface-subtle rounded-none p-3 border border-border">
      <span class="text-[11px] text-ink-muted block mb-0.5">Student Focus & Passion:</span>
      <span class="font-semibold text-ink">{studentAspiration}</span>
    </div>
    <div class="bg-surface-subtle rounded-none p-3 border border-border">
      <span class="text-[11px] text-ink-muted block mb-0.5">Parent Recommendation:</span>
      <span class="font-semibold text-ink">{parentAspiration}</span>
    </div>
  </div>

  <div class="p-3.5 rounded-none border border-border bg-surface-subtle flex items-start gap-2.5">
    <Sparkles class="w-4 h-4 text-brand shrink-0 mt-0.5" />
    <div class="text-xs text-ink-secondary">
      <span class="font-semibold text-ink">Recommended Consensus Action: </span>
      {growthAction}
    </div>
  </div>

  {#if showCounselorAction}
    <div class="flex justify-end pt-1">
      <button
        type="button"
        onclick={onReferCounselor}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-medium bg-surface hover:bg-surface-subtle border border-border text-ink transition-colors cursor-pointer"
      >
        <HeartHandshake class="w-3.5 h-3.5 text-brand" />
        <span>Request Joint Counselor Dialogue</span>
      </button>
    </div>
  {/if}
</div>
