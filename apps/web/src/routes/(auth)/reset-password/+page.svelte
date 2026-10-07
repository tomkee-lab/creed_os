<script lang="ts">
  import { ArrowRight, Mail, CheckCircle2 } from 'lucide-svelte';

  let email = $state('');
  let sent = $state(false);
  let loading = $state(false);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    setTimeout(() => {
      loading = false;
      sent = true;
    }, 400);
  }
</script>

<svelte:head>
  <title>Reset Password — CREED OS</title>
</svelte:head>

<div class="rounded-sm bg-surface-raised border border-border p-6 sm:p-8 shadow-sm">
  <div class="space-y-1.5 mb-6 text-center">
    <h1 class="text-xl font-heading font-semibold text-ink tracking-tight">
      Reset your password
    </h1>
    <p class="text-xs text-ink-secondary">
      We will send a secure recovery link to your registered email.
    </p>
  </div>

  {#if sent}
    <div class="space-y-4">
      <div class="p-3 rounded-sm bg-positive-subtle text-positive text-xs flex items-center gap-2">
        <CheckCircle2 class="w-4 h-4 shrink-0" />
        <span>Recovery link sent to <strong>{email}</strong>. Please check your inbox.</span>
      </div>
      <a
        href="/login"
        class="block text-center text-xs font-medium text-brand hover:underline pt-2"
      >
        Return to sign in
      </a>
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-4">
      <div class="space-y-1">
        <label for="email" class="block text-xs font-medium text-ink">
          Account Email
        </label>
        <div class="relative">
          <input
            id="email"
            type="email"
            bind:value={email}
            required
            placeholder="you@school.org"
            class="w-full pl-3 pr-3 py-2 rounded-sm bg-surface border border-border text-xs text-ink placeholder-ink-muted focus:outline-hidden focus:border-brand"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !email}
        class="w-full py-2.5 px-4 rounded-sm bg-brand hover:bg-brand/90 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
      >
        <span>{loading ? 'Sending link...' : 'Send Recovery Link'}</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>

      <div class="text-center pt-2">
        <a href="/login" class="text-xs text-ink-muted hover:text-ink">
          Remember password? Sign in
        </a>
      </div>
    </form>
  {/if}
</div>
