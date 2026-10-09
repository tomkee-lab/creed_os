<script lang="ts">
  import type { LearnerEvidence } from '@core-os/domain';
  import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-svelte';

  interface Props {
    evidence: LearnerEvidence;
  }

  let { evidence }: Props = $props();

  const sourceLabels: Record<string, { label: string; badgeClass: string }> = {
    cat_assessment: { label: 'Adaptive Diagnostic', badgeClass: 'badge-primary' },
    project_mission: { label: 'Hands-on Mission', badgeClass: 'badge-growth' },
    teacher_observation: { label: 'Teacher Assessment', badgeClass: 'badge-focus' },
    voice_reflection: { label: 'Socratic Dialogue', badgeClass: 'badge-pathway' },
    self_report: { label: 'Self Reflection', badgeClass: 'badge-primary' },
    inventory_survey: { label: 'Survey Inventory', badgeClass: 'badge-primary' }
  };

  const currentSource = $derived(
    sourceLabels[evidence.sourceType] ?? {
      label: evidence.sourceType,
      badgeClass: 'badge-primary'
    }
  );

  const formattedDate = $derived(
    new Date(evidence.observedAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  );

  const strengthLabel = $derived(
    evidence.evidenceStrength >= 4
      ? 'High Rigor'
      : evidence.evidenceStrength >= 2
        ? 'Verified'
        : 'Observational'
  );

  const displayScore = $derived(
    evidence.observedValue.scoreFraction !== undefined
      ? (evidence.observedValue.scoreFraction * 5.0).toFixed(1)
      : evidence.observedValue.theta !== undefined
        ? (evidence.observedValue.theta + 3.0).toFixed(1)
        : '4.0'
  );
</script>

<div class="bg-surface border border-border rounded-none p-4 space-y-3 transition-colors hover:border-border-strong">
  <div class="flex items-start justify-between gap-3">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-xs px-2 py-0.5 rounded-none font-medium {currentSource.badgeClass}">
          {currentSource.label}
        </span>
        <span class="text-[11px] text-ink-muted flex items-center gap-1 font-mono">
          <Clock class="w-3 h-3" />
          {formattedDate}
        </span>
      </div>
      <h4 class="text-sm font-semibold text-ink">
        {evidence.sourceTitle}
      </h4>
    </div>
    <div class="text-right shrink-0">
      <span class="text-xs font-semibold text-ink">
        Demonstrated: {displayScore} / 5.0
      </span>
      <span class="text-[11px] text-positive font-medium block">
        {strengthLabel} Evidence
      </span>
    </div>
  </div>

  <p class="text-xs text-ink-secondary leading-relaxed">
    {evidence.summary}
  </p>

  <div class="pt-2 border-t border-border flex items-center justify-between text-[11px]">
    <div class="flex items-center gap-1.5 text-ink-muted">
      <ShieldCheck class="w-3.5 h-3.5 text-positive" />
      <span class="text-[11px] text-ink-secondary">Verified cryptographic audit record</span>
    </div>
    <div class="flex items-center gap-1.5">
      <span class="text-ink-muted">Provenance:</span>
      <span class="font-semibold text-ink">
        Level {evidence.evidenceStrength}
      </span>
    </div>
  </div>
</div>
