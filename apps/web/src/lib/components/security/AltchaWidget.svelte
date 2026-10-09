<script lang="ts">
  import { ShieldCheck, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-svelte';
  import { solveChallenge } from 'altcha-lib/v1';

  interface Props {
    challengeUrl?: string;
    autoSolve?: boolean;
    name?: string;
    verified?: boolean;
    payload?: string;
    onverified?: (payload: string) => void;
    class?: string;
  }

  let {
    challengeUrl = '/api/v1/altcha',
    autoSolve = false,
    name = 'altcha',
    verified = $bindable(false),
    payload = $bindable(''),
    onverified,
    class: className = ''
  }: Props = $props();

  type Status = 'idle' | 'fetching' | 'solving' | 'verified' | 'error';

  let status = $state<Status>('idle');
  let errorMessage = $state<string | null>(null);
  let durationMs = $state<number | null>(null);
  let abortController = $state<AbortController | null>(null);

  async function startVerification() {
    if (status === 'solving' || status === 'verified') return;

    status = 'fetching';
    errorMessage = null;

    try {
      const res = await fetch(challengeUrl);
      if (!res.ok) {
        throw new Error(`Failed to fetch challenge (${res.status})`);
      }
      const challenge = await res.json();

      status = 'solving';
      const solver = solveChallenge(
        challenge.challenge,
        challenge.salt,
        challenge.algorithm || 'SHA-256',
        challenge.maxnumber || 50000
      );
      abortController = solver.controller;

      const solution = await solver.promise;
      if (!solution) {
        throw new Error('Verification calculation cancelled or unsuccessful');
      }

      durationMs = solution.took;
      const solutionPayload = {
        algorithm: challenge.algorithm,
        challenge: challenge.challenge,
        number: solution.number,
        salt: challenge.salt,
        signature: challenge.signature
      };

      const base64Payload = btoa(JSON.stringify(solutionPayload));
      payload = base64Payload;
      verified = true;
      status = 'verified';

      onverified?.(base64Payload);
    } catch (err: any) {
      status = 'error';
      errorMessage = err?.message || 'Verification failed. Please retry.';
      verified = false;
      payload = '';
    }
  }

  $effect(() => {
    if (autoSolve && status === 'idle') {
      startVerification();
    }
  });
</script>

<div
  class="p-3 rounded-none bg-surface-subtle border border-border flex items-center justify-between gap-3 text-xs font-mono {className}"
  data-testid="altcha-widget"
>
  <div class="flex items-center gap-2.5 min-w-0">
    {#if status === 'verified'}
      <CheckCircle2 class="w-4 h-4 text-positive shrink-0" />
      <div class="flex flex-col min-w-0">
        <span class="font-medium text-ink flex items-center gap-1.5">
          <span>Protected & Verified</span>
          <span class="text-[10px] px-1 py-0.2 rounded-none bg-positive/10 text-positive border border-positive/20">
            PoW SHA-256
          </span>
        </span>
        <span class="text-[11px] text-ink-muted truncate">
          Verified in {durationMs ?? 0}ms · Zero-tracking DPDP Compliant
        </span>
      </div>
    {:else if status === 'solving'}
      <Loader2 class="w-4 h-4 text-brand animate-spin shrink-0" />
      <div class="flex flex-col min-w-0">
        <span class="font-medium text-ink">Computing cryptographic proof...</span>
        <span class="text-[11px] text-ink-muted">Running local Proof-of-Work hash check</span>
      </div>
    {:else if status === 'fetching'}
      <Loader2 class="w-4 h-4 text-ink-muted animate-spin shrink-0" />
      <div class="flex flex-col min-w-0">
        <span class="font-medium text-ink">Issuing challenge token...</span>
        <span class="text-[11px] text-ink-muted">Requesting nonce from authoritative engine</span>
      </div>
    {:else if status === 'error'}
      <AlertCircle class="w-4 h-4 text-negative shrink-0" />
      <div class="flex flex-col min-w-0">
        <span class="font-medium text-negative">Verification error</span>
        <span class="text-[11px] text-ink-muted truncate">{errorMessage}</span>
      </div>
    {:else}
      <ShieldCheck class="w-4 h-4 text-ink-secondary shrink-0" />
      <div class="flex flex-col min-w-0">
        <span class="font-medium text-ink">Anti-Abuse Verification</span>
        <span class="text-[11px] text-ink-muted">Privacy-first Proof-of-Work challenge</span>
      </div>
    {/if}
  </div>

  <div class="shrink-0 flex items-center gap-2">
    {#if status === 'idle'}
      <button
        type="button"
        onclick={startVerification}
        class="px-2.5 py-1 rounded-none bg-surface hover:bg-surface-raised border border-border hover:border-brand text-xs font-mono font-medium text-ink transition-colors cursor-pointer"
      >
        Verify
      </button>
    {:else if status === 'error'}
      <button
        type="button"
        onclick={startVerification}
        class="p-1 rounded-none bg-surface hover:bg-surface-raised border border-border text-ink hover:text-brand transition-colors cursor-pointer"
        title="Retry verification"
        aria-label="Retry verification"
      >
        <RefreshCw class="w-3.5 h-3.5" />
      </button>
    {/if}
  </div>

  <!-- Hidden form input for standard form submission workflows -->
  <input type="hidden" {name} value={payload} />
</div>
