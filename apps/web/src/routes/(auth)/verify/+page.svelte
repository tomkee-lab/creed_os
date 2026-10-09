<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { ArrowRight, KeyRound, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-svelte';
  import { PinInput, PinInputCell } from '$lib/components/ui/pin-input';
  import { Icon } from '$lib/components/icons';
  import { authClient } from '$lib/auth-client';

  let email = $state('');
  let code = $state('');
  let loading = $state(false);
  let resending = $state(false);
  let verified = $state(false);
  let errorMessage = $state('');
  let infoMessage = $state('');

  $effect(() => {
    const paramEmail = page.url.searchParams.get('email');
    if (paramEmail && !email) {
      email = paramEmail.trim();
    }
  });

  async function handleSendOtp() {
    if (!email.trim() || !email.includes('@')) {
      errorMessage = 'Please enter a valid email address first.';
      return;
    }

    resending = true;
    errorMessage = '';
    infoMessage = '';

    try {
      const res = await authClient.emailOtp.sendVerificationOtp({
        email: email.trim(),
        type: 'email-verification'
      });

      if (res.error) {
        errorMessage = res.error.message || 'Failed to dispatch verification code. Please try again.';
      } else {
        infoMessage = `Verification code sent to ${email.trim()}. Please check your inbox.`;
      }
    } catch (err: any) {
      errorMessage = err?.message || 'Network error while dispatching code. Please try again.';
    } finally {
      resending = false;
    }
  }

  async function handleVerifyCode() {
    if (!email.trim() || !email.includes('@')) {
      errorMessage = 'Please provide the valid email address associated with your account.';
      return;
    }

    if (code.length < 6) {
      errorMessage = 'Please enter all 6 digits of your verification code.';
      return;
    }

    loading = true;
    errorMessage = '';
    infoMessage = '';

    try {
      const res = await authClient.emailOtp.verifyEmail({
        email: email.trim(),
        otp: code.trim()
      });

      if (res.error) {
        errorMessage = res.error.message || 'Verification failed. Please check your 6-digit code.';
      } else {
        verified = true;
        setTimeout(() => {
          goto('/login');
        }, 900);
      }
    } catch (err: any) {
      errorMessage = err?.message || 'Network connection error during verification. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Verify Account — CREED OS</title>
</svelte:head>

<div class="rounded-none bg-surface-raised border border-border p-6 sm:p-8 shadow-sm space-y-6">
  <!-- Header -->
  <div class="flex items-start gap-3">
    <div class="w-10 h-10 rounded-none bg-brand-subtle border border-brand/20 flex items-center justify-center shrink-0">
      <Icon icon="carbon:email" class="w-5 h-5 text-brand" />
    </div>
    <div>
      <h1 class="text-base font-heading font-semibold text-ink tracking-tight">
        Confirm Your Account
      </h1>
      <p class="text-xs text-ink-muted">
        Enter the 6-digit confirmation code dispatched to your registered email contact.
      </p>
    </div>
  </div>

  {#if errorMessage}
    <div class="p-3 bg-critical-subtle border border-critical/20 rounded-none text-xs text-critical flex items-center gap-2">
      <AlertCircle class="w-4 h-4 shrink-0" />
      <span>{errorMessage}</span>
    </div>
  {/if}

  {#if infoMessage}
    <div class="p-3 bg-brand-subtle border border-brand/20 rounded-none text-xs text-brand flex items-center gap-2">
      <CheckCircle2 class="w-4 h-4 shrink-0" />
      <span>{infoMessage}</span>
    </div>
  {/if}

  {#if verified}
    <div class="p-4 bg-positive-subtle border border-positive/20 rounded-none text-center space-y-2">
      <div class="w-8 h-8 rounded-none bg-positive text-positive-foreground mx-auto flex items-center justify-center">
        <CheckCircle2 class="w-4 h-4" />
      </div>
      <p class="text-xs font-medium text-positive">Credentials verified successfully. Redirecting to sign in...</p>
    </div>
  {:else}
    <!-- Email Binding Input -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between">
        <label for="verify-email" class="block text-xs font-medium text-ink">
          Account Email Address
        </label>
        <button
          type="button"
          onclick={handleSendOtp}
          disabled={resending || loading || !email.trim()}
          class="text-[11px] text-brand hover:underline font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-40"
        >
          {#if resending}
            <RefreshCw class="w-3 h-3 animate-spin" />
            <span>Sending...</span>
          {:else}
            <span>Send / Resend Code</span>
          {/if}
        </button>
      </div>
      <input
        id="verify-email"
        type="email"
        bind:value={email}
        placeholder="learner@institution.edu"
        disabled={loading || verified}
        required
        class="w-full h-9 px-3 py-1.5 text-xs bg-surface border border-border rounded-none text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand disabled:opacity-50"
      />
    </div>

    <!-- 6-Digit Pin Input -->
    <div class="space-y-3">
      <label for="verify-code" class="block text-xs font-medium text-ink">
        Enter 6-Digit Verification Code
      </label>

      <div data-testid="pin-input-verify" class="flex items-center justify-between gap-2">
        <PinInput
          bind:value={code}
          maxlength={6}
          disabled={loading || verified}
          inputId="verify-code"
          class="flex items-center gap-1.5"
        >
          {#snippet children({ cells })}
            {#each cells as cell}
              <PinInputCell {cell} class="w-9 h-11 text-xs" />
            {/each}
          {/snippet}
        </PinInput>

        <button
          type="button"
          onclick={() => { code = ''; }}
          disabled={!code || loading}
          class="px-2 py-1.5 text-[11px] rounded-none border border-border text-ink-muted hover:text-ink hover:border-border-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-40 cursor-pointer transition-all"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Actions -->
    <div class="space-y-2 pt-2">
      <button
        type="button"
        onclick={handleVerifyCode}
        disabled={loading || code.length < 6 || !email.trim()}
        class="w-full h-8 rounded-none bg-brand text-brand-foreground text-xs font-medium hover:bg-brand/90 active:scale-95 focus-visible:outline-2 focus-visible:outline-focus shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        {#if loading}
          <KeyRound class="w-3.5 h-3.5 animate-spin" />
          <span>Verifying Code...</span>
        {:else}
          <span>Confirm & Activate Account</span>
          <ArrowRight class="w-3.5 h-3.5" />
        {/if}
      </button>
    </div>
  {/if}

  <div class="pt-4 border-t border-border flex items-center justify-between text-xs">
    <span class="text-ink-muted">Prefer password sign-in?</span>
    <a
      href="/login"
      class="text-brand hover:underline font-medium inline-flex items-center gap-1"
    >
      <span>Sign In</span>
      <ArrowRight class="w-3 h-3" />
    </a>
  </div>
</div>
