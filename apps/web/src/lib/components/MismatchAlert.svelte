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

<div class="surface-card p-5 space-y-4 border-l-4 border-l-(--accent-warning)">
  <div class="flex items-start gap-3">
    <div class="p-2 rounded-none bg-(--accent-warning-subtle) text-(--accent-warning) shrink-0 mt-0.5">
      <Compass class="w-5 h-5" />
    </div>
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <h4 class="text-sm font-bold text-(--text-primary)">
          Family Pathway Alignment Dialogue
        </h4>
        <span class="text-[10px] font-medium px-2 py-0.5 rounded-none badge-focus">
          Growth Navigation
        </span>
      </div>
      <p class="text-xs text-(--text-secondary) leading-relaxed">
        {gapDescription}
      </p>
    </div>
  </div>

  <div class="grid sm:grid-cols-2 gap-3 pt-2 border-t border-(--border-subtle) text-xs">
    <div class="bg-(--surface-sunken) rounded-none p-3 border border-(--border-subtle)">
      <span class="text-[11px] text-(--text-muted) block mb-0.5">Student Focus & Passion:</span>
      <span class="font-semibold text-(--text-primary)">{studentAspiration}</span>
    </div>
    <div class="bg-(--surface-sunken) rounded-none p-3 border border-(--border-subtle)">
      <span class="text-[11px] text-(--text-muted) block mb-0.5">Parent Recommendation:</span>
      <span class="font-semibold text-(--text-primary)">{parentAspiration}</span>
    </div>
  </div>

  <div class="p-3.5 rounded-none border border-(--border-subtle) bg-(--surface-sunken) flex items-start gap-2.5">
    <Sparkles class="w-4 h-4 text-(--accent-primary) shrink-0 mt-0.5" />
    <div class="text-xs text-(--text-secondary)">
      <span class="font-semibold text-(--text-primary)">Recommended Consensus Action: </span>
      {growthAction}
    </div>
  </div>

  {#if showCounselorAction}
    <div class="flex justify-end pt-1">
      <button
        type="button"
        onclick={onReferCounselor}
        class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-medium surface-card hover:bg-(--surface-sunken) text-(--text-primary) transition-colors cursor-pointer"
      >
        <HeartHandshake class="w-3.5 h-3.5 text-(--accent-primary)" />
        <span>Request Joint Counselor Dialogue</span>
      </button>
    </div>
  {/if}
</div>
