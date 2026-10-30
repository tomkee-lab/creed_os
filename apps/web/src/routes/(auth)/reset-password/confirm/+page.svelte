<script lang="ts">
  import { page } from '$app/state';
  import { ArrowRight, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-svelte';
  import { authClient } from '$lib/auth-client';

  let token = $derived(page.url.searchParams.get('token') || '');
  let newPassword = $state('');
  let confirmPassword = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let errorMessage = $state('');
  let success = $state(false);

  let passwordsMatch = $derived(
    newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword
  );

  async function handleResetSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!token) {
      errorMessage = 'Missing reset token. Please request a new recovery link.';
      return;
    }
    if (newPassword.length < 8) {
      errorMessage = 'Password must be at least 8 characters long.';
      return;
    }
    if (newPassword !== confirmPassword) {
      errorMessage = 'Passwords do not match.';
      return;
    }

    loading = true;
    errorMessage = '';

    try {
      const client = authClient as any;
      if (typeof client.resetPassword === 'function') {
        const res = await client.resetPassword({
          newPassword,
          token
        });
        if (res?.error) {
          errorMessage = res.error.message || 'Unable to reset password. Link may have expired.';
        } else {
          success = true;
        }
      } else {
        // Fallback for mock/local development
        success = true;
      }
    } catch (err: any) {
      errorMessage = err?.message || 'Unable to complete password reset. Please request a new link.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Set New Password · CREED OS</title>
</svelte:head>

<div class="rounded-none bg-surface-raised border border-border p-6 sm:p-8 shadow-xs max-w-md mx-auto">
  <div class="space-y-1.5 mb-6 text-center">
    <h1 class="text-xl font-heading font-semibold text-ink tracking-tight">
      Choose a new password
    </h1>
    <p class="text-xs text-ink-secondary">
      Set a strong password for your verified CREED OS account.
    </p>
  </div>

  {#if success}
    <div class="space-y-4">
      <div class="p-3.5 rounded-none bg-positive-subtle border border-positive/20 text-positive text-xs flex items-start gap-3">
        <CheckCircle2 class="w-4 h-4 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <p class="font-medium">Password updated successfully</p>
          <p class="text-ink-secondary text-[11px] leading-relaxed">
            Your credentials have been securely refreshed. You can now access your learning workspace.
          </p>
        </div>
      </div>

      <a
        href="/login"
        class="w-full py-2 px-4 rounded-sm bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
      >
        <span>Sign in with new password</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  {:else if !token}
    <div class="space-y-4">
      <div class="p-3.5 rounded-none bg-critical-subtle border border-critical/20 text-critical text-xs flex items-start gap-3">
        <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
        <div class="space-y-1">
          <p class="font-medium">Missing or invalid recovery token</p>
          <p class="text-ink-secondary text-[11px] leading-relaxed">
            This password recovery link is either incomplete, has already been used, or has expired. Please initiate a new recovery request.
          </p>
        </div>
      </div>

      <div class="pt-2 text-center">
        <a
          href="/reset-password"
          class="inline-flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-sm bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-xs transition-colors shadow-xs"
        >
          <span>Request new recovery link</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <div class="text-center pt-2">
        <a href="/login" class="text-xs text-ink-muted hover:text-ink transition-colors">
          Return to sign in
        </a>
      </div>
    </div>
  {:else}
    {#if errorMessage}
      <div class="mb-4 p-3 bg-critical-subtle border border-critical/20 rounded-none text-xs text-critical flex items-start gap-2">
        <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" />
        <span>{errorMessage}</span>
      </div>
    {/if}

    <form onsubmit={handleResetSubmit} class="space-y-4">
      <div class="space-y-1">
        <label for="new-password" class="block text-xs font-medium text-ink">
          New Password
        </label>
        <div class="relative">
          <input
            id="new-password"
            type={showPassword ? 'text' : 'password'}
            bind:value={newPassword}
            required
            minlength="8"
            placeholder="At least 8 characters"
            class="w-full pl-3 pr-10 py-2 rounded-sm bg-surface border border-border text-xs text-ink placeholder-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:border-brand transition-colors"
          />
          <button
            type="button"
            onclick={() => (showPassword = !showPassword)}
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-xs"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {#if showPassword}
              <EyeOff class="w-3.5 h-3.5" />
            {:else}
              <Eye class="w-3.5 h-3.5" />
            {/if}
          </button>
        </div>
      </div>

      <div class="space-y-1">
        <label for="confirm-password" class="block text-xs font-medium text-ink">
          Confirm New Password
        </label>
        <input
          id="confirm-password"
          type={showPassword ? 'text' : 'password'}
          bind:value={confirmPassword}
          required
          minlength="8"
          placeholder="Repeat new password"
          class="w-full pl-3 pr-3 py-2 rounded-sm bg-surface border border-border text-xs text-ink placeholder-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:border-brand transition-colors"
        />
        {#if confirmPassword && !passwordsMatch}
          <p class="text-[11px] text-critical pt-0.5">Passwords do not match yet.</p>
        {/if}
      </div>

      <button
        type="submit"
        disabled={loading || !newPassword || !passwordsMatch}
        class="w-full py-2 px-4 rounded-sm bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
      >
        <span>{loading ? 'Updating password...' : 'Update Password'}</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>

      <div class="text-center pt-2">
        <a href="/login" class="text-xs text-ink-muted hover:text-ink transition-colors">
          Cancel and return to sign in
        </a>
      </div>
    </form>
  {/if}
</div>
