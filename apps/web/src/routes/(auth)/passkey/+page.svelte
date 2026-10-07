<script lang="ts">
  import { KeyRound, ArrowRight, ShieldCheck } from 'lucide-svelte';
  import { goto } from '$app/navigation';

  let authenticating = $state(false);
  let errorMsg = $state('');

  async function handlePasskey() {
    authenticating = true;
    errorMsg = '';
    try {
      // In production with live Better Auth passkey plugin:
      // await authClient.signIn.passkey();
      await new Promise((r) => setTimeout(r, 600));
      goto('/student');
    } catch (err: any) {
      errorMsg = err.message || 'Passkey verification failed.';
    } finally {
      authenticating = false;
    }
  }
</script>

<svelte:head>
  <title>Passkey Sign In — CREED OS</title>
</svelte:head>

<div class="rounded-sm bg-surface-raised border border-border p-6 sm:p-8 shadow-sm text-center space-y-6">
  <div class="w-12 h-12 rounded-sm bg-brand-subtle text-brand mx-auto flex items-center justify-center">
    <KeyRound class="w-6 h-6" />
  </div>

  <div class="space-y-1.5">
    <h1 class="text-xl font-heading font-semibold text-ink tracking-tight">
      Sign in with Passkey
    </h1>
    <p class="text-xs text-ink-secondary leading-relaxed">
      Use biometric verification (Touch ID, Windows Hello, or hardware security key) for passwordless access.
    </p>
  </div>

  {#if errorMsg}
    <div class="p-2.5 rounded-sm bg-critical-subtle border border-critical/20 text-xs text-critical">
      {errorMsg}
    </div>
  {/if}

  <div class="space-y-3 pt-2">
    <button
      type="button"
      onclick={handlePasskey}
      disabled={authenticating}
      class="w-full py-2.5 px-4 rounded-sm bg-brand hover:bg-brand/90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
    >
      <span>{authenticating ? 'Waiting for authenticator...' : 'Authenticate with Passkey'}</span>
      <ArrowRight class="w-3.5 h-3.5" />
    </button>

    <a
      href="/login"
      class="block text-xs text-ink-muted hover:text-ink pt-2"
    >
      Sign in with email and password instead
    </a>
  </div>
</div>
