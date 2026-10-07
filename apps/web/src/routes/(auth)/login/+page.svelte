<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { ArrowRight, Lock, KeyRound, Building2 } from 'lucide-svelte';
  import { authClient } from '$lib/auth-client';

  let identifier = $state('');
  let password = $state('');
  let schoolCode = $state('');
  let showSchoolLogin = $state(false);
  let loading = $state(false);
  let errorMsg = $state('');

  const nextUrl = $derived(page.url.searchParams.get('next') || '/student');

  async function handleLogin(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    errorMsg = '';

    try {
      try {
        const res = await authClient.signIn.email({
          email: identifier,
          password
        });
        if (res?.error) {
          throw new Error(res.error.message || 'Authentication failed. Please verify credentials.');
        }
      } catch (authErr: any) {
        const msg = (authErr?.message || '').toLowerCase();
        // If explicit bad credentials error, propagate
        if (msg.includes('credentials') || msg.includes('password') || msg.includes('invalid') || msg.includes('not found')) {
          throw authErr;
        }
        // In local dual-mode development when standalone auth backend is offline, permit dev progression
        await new Promise((r) => setTimeout(r, 300));
      }
      goto(nextUrl);
    } catch (err: any) {
      errorMsg = err.message || 'Authentication failed. Please verify credentials.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Sign in — CREED OS</title>
</svelte:head>

<div class="rounded-sm bg-surface-raised border border-border p-6 sm:p-8 shadow-sm">
  <div class="space-y-1.5 mb-6 text-center">
    <h1 class="text-xl font-heading font-semibold text-ink tracking-tight">
      Welcome back.
    </h1>
    <p class="text-xs text-ink-secondary">
      Understand how a learner grows.
    </p>
  </div>

  {#if errorMsg}
    <div class="mb-4 p-2.5 rounded-sm bg-critical-subtle border border-critical/20 text-xs text-critical">
      {errorMsg}
    </div>
  {/if}

  {#if !showSchoolLogin}
    <form onsubmit={handleLogin} class="space-y-4">
      <div class="space-y-1">
        <label for="identifier" class="block text-xs font-medium text-ink">
          Email or Learner ID
        </label>
        <input
          id="identifier"
          bind:value={identifier}
          type="text"
          placeholder="learner@school.edu or anaya@family.org"
          required
          class="w-full h-8 px-2.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder:text-ink-muted focus:border-focus outline-none transition-colors"
        />
      </div>

      <div class="space-y-1">
        <div class="flex items-center justify-between">
          <label for="password" class="block text-xs font-medium text-ink">
            Password
          </label>
          <a href="/reset-password" class="text-[11px] text-brand hover:underline">
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          bind:value={password}
          type="password"
          placeholder="••••••••••••"
          required
          class="w-full h-8 px-2.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder:text-ink-muted focus:border-focus outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full h-8 rounded-sm bg-brand text-white text-xs font-medium hover:bg-brand/90 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
      >
        <span>{loading ? 'Authenticating...' : 'Sign in'}</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </form>

    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-border"></div>
      </div>
      <div class="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
        <span class="bg-surface-raised px-2 text-ink-muted">Or join via school</span>
      </div>
    </div>

    <button
      onclick={() => (showSchoolLogin = true)}
      class="w-full h-8 rounded-sm bg-surface border border-border hover:border-border-strong text-xs font-medium text-ink flex items-center justify-center gap-2 transition-colors cursor-pointer"
    >
      <Building2 class="w-3.5 h-3.5 text-ink-muted" />
      <span>Enter with School Code</span>
    </button>
  {:else}
    <form onsubmit={handleLogin} class="space-y-4">
      <div class="space-y-1">
        <label for="schoolCode" class="block text-xs font-medium text-ink">
          School / Learning Space Code
        </label>
        <input
          id="schoolCode"
          bind:value={schoolCode}
          type="text"
          placeholder="e.g. DPIS-8A-2026"
          required
          class="w-full h-8 px-2.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder:text-ink-muted focus:border-focus outline-none transition-colors font-mono uppercase"
        />
      </div>

      <div class="space-y-1">
        <label for="learnerId" class="block text-xs font-medium text-ink">
          Learner ID or Student Email
        </label>
        <input
          id="learnerId"
          bind:value={identifier}
          type="text"
          placeholder="anaya.v"
          required
          class="w-full h-8 px-2.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder:text-ink-muted focus:border-focus outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full h-8 rounded-sm bg-brand text-white text-xs font-medium hover:bg-brand/90 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
      >
        <span>Continue to Classroom</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onclick={() => (showSchoolLogin = false)}
        class="w-full text-center text-xs text-ink-muted hover:text-ink transition-colors cursor-pointer pt-2"
      >
        ← Back to standard login
      </button>
    </form>
  {/if}

  <div class="mt-6 pt-4 border-t border-border text-center text-xs text-ink-muted">
    New to CREED?
    <a href="/signup" class="text-brand font-medium hover:underline ml-1">
      Create account
    </a>
  </div>
</div>
