<script lang="ts">
  import { goto } from '$app/navigation';
  import { Shield, CheckCircle2, Lock, ArrowRight, AlertCircle, Phone, UserCheck, KeyRound } from 'lucide-svelte';

  let channel = $state<'digilocker' | 'sms'>('sms');
  let parentName = $state('');
  let parentContact = $state('');
  let relationship = $state('');
  let otp = $state('');
  let otpRequested = $state(false);
  let devOtpHint = $state(''); // Only populated in DEV environments via server response
  let verified = $state(false);
  let loading = $state(false);
  let errorMessage = $state('');

  async function handleRequestOtp() {
    if (!parentName.trim() || !parentContact.trim()) {
      errorMessage = 'Please provide guardian legal name and contact identifier.';
      return;
    }
    errorMessage = '';
    loading = true;
    devOtpHint = '';

    try {
      const res = await fetch('/api/v1/consent/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          parentName,
          parentContact,
          channel: channel === 'sms' ? 'SMS_OTP' : 'DIGILOCKER'
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        errorMessage = data.error || 'Failed to send OTP. Please try again.';
        loading = false;
        return;
      }

      otpRequested = true;
      // devOtp is only included in development server responses — never in production
      devOtpHint = data.devOtp ?? '';
    } catch (err: any) {
      errorMessage = err?.message || 'Connection failure while requesting OTP.';
    } finally {
      loading = false;
    }
  }

  async function handleConsentSubmit() {
    if (!otp.trim()) {
      errorMessage = 'Please enter the 6-digit OTP verification code.';
      return;
    }

    loading = true;
    errorMessage = '';

    try {
      const res = await fetch('/api/v1/consent/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          channel: channel === 'sms' ? 'SMS_OTP' : 'DIGILOCKER',
          parentName,
          parentContact,
          otp
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        errorMessage = data.error || 'Guardian consent verification failed. Please check the OTP code.';
        loading = false;
        return;
      }

      verified = true;
      loading = false;
      setTimeout(() => {
        goto('/parent');
      }, 700);
    } catch (err: any) {
      errorMessage = err?.message || 'Connection failure while verifying consent ledger.';
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Parental Consent Gate — CREED OS</title>
</svelte:head>

<div class="rounded-sm bg-surface-raised border border-border p-6 sm:p-8 shadow-sm space-y-6">
  <!-- Header -->
  <div class="flex items-start gap-3">
    <div class="w-9 h-9 rounded-sm bg-brand-subtle border border-brand/20 flex items-center justify-center shrink-0">
      <Shield class="w-5 h-5 text-brand" />
    </div>
    <div>
      <h1 class="text-base font-heading font-semibold text-ink tracking-tight">
        Verified Parental Consent Notice
      </h1>
      <p class="text-xs text-ink-muted">
        Mandatory statutory verification under India DPDP Act 2023 & Child Safety Standards
      </p>
    </div>
  </div>

  <!-- Student Scope Summary -->
  <div class="p-3 rounded-sm bg-surface border border-border space-y-2">
    <div class="flex items-center justify-between text-xs">
      <span class="text-ink-muted">Minor Learner:</span>
      <span class="font-medium text-ink">Anaya Verma (Age 13 · Class 8)</span>
    </div>
    <div class="flex items-center justify-between text-xs">
      <span class="text-ink-muted">Affiliated Institution:</span>
      <span class="font-medium text-ink">Delhi Public International School</span>
    </div>
    <div class="flex items-center justify-between text-xs">
      <span class="text-ink-muted">Statutory Purpose:</span>
      <span class="font-medium text-ink">Formative Adaptive Assessment & Learning Pathways</span>
    </div>
  </div>

  {#if errorMessage}
    <div class="p-3 bg-critical-subtle border border-critical/20 rounded-sm text-xs text-critical flex items-center gap-2">
      <AlertCircle class="w-4 h-4 shrink-0" />
      <span>{errorMessage}</span>
    </div>
  {/if}

  <!-- Guardian Identity Form -->
  <div class="space-y-3">
    <div>
      <label for="guardian-name" class="block text-xs font-medium text-ink mb-1">Guardian Legal Name</label>
      <input
        id="guardian-name"
        type="text"
        bind:value={parentName}
        placeholder="Full name matching government ID"
        disabled={verified || otpRequested}
        class="w-full px-3 py-1.5 text-xs rounded-sm bg-surface-subtle border border-border text-ink focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-60"
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label for="guardian-contact" class="block text-xs font-medium text-ink mb-1">Registered Contact / Mobile</label>
        <input
          id="guardian-contact"
          type="text"
          bind:value={parentContact}
          placeholder="+91 98765 43210"
          disabled={verified || otpRequested}
          class="w-full px-3 py-1.5 text-xs rounded-sm bg-surface-subtle border border-border text-ink focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-60"
        />
      </div>

      <div>
        <label for="guardian-relationship" class="block text-xs font-medium text-ink mb-1">Legal Relationship</label>
        <input
          id="guardian-relationship"
          type="text"
          bind:value={relationship}
          placeholder="Mother / Father / Guardian"
          disabled={verified || otpRequested}
          class="w-full px-3 py-1.5 text-xs rounded-sm bg-surface-subtle border border-border text-ink focus:outline-none focus:ring-1 focus:ring-brand disabled:opacity-60"
        />
      </div>
    </div>
  </div>

  <!-- Verification Channel Selection -->
  <div class="space-y-2">
    <span class="block text-xs font-medium text-ink">Verification Method:</span>
    <div class="grid grid-cols-2 gap-2 text-xs">
      <button
        type="button"
        onclick={() => (channel = 'sms')}
        disabled={verified || otpRequested}
        class="p-2.5 rounded-sm border text-left transition-colors cursor-pointer hover:border-border-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 {channel === 'sms'
          ? 'border-brand bg-brand-subtle/30 font-medium'
          : 'border-border bg-surface'}"
      >
        <span class="font-medium text-ink">Aadhaar / Mobile OTP</span>
        <span class="block text-[10px] text-ink-muted mt-0.5">Instant 6-digit SMS OTP</span>
      </button>

      <button
        type="button"
        onclick={() => (channel = 'digilocker')}
        disabled={verified || otpRequested}
        class="p-2.5 rounded-sm border text-left transition-colors cursor-pointer hover:border-border-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 {channel === 'digilocker'
          ? 'border-brand bg-brand-subtle/30 font-medium'
          : 'border-border bg-surface'}"
      >
        <span class="font-medium text-ink">DigiLocker Auth</span>
        <span class="block text-[10px] text-ink-muted mt-0.5">Government credential handshake</span>
      </button>
    </div>
  </div>

  <!-- OTP Verification Step -->
  {#if !otpRequested}
    <button
      type="button"
      onclick={handleRequestOtp}
      class="w-full h-8 rounded-sm bg-surface border border-border text-ink text-xs font-medium hover:bg-surface-subtle hover:border-border-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-focus shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
    >
      <Phone class="w-3.5 h-3.5 text-brand" />
      <span>Send Verification OTP</span>
    </button>
  {:else}
    <div class="space-y-2 pt-2 border-t border-border">
      <div class="flex items-center justify-between">
        <label for="otp-code" class="block text-xs font-medium text-ink">Enter 6-Digit OTP</label>
        {#if devOtpHint}
          <span class="text-[10px] font-mono text-attention bg-attention-subtle px-1 rounded-none">[DEV] OTP: {devOtpHint}</span>
        {/if}
      </div>
      <div class="flex items-center gap-2">
        <input
          id="otp-code"
          type="text"
          maxlength="6"
          bind:value={otp}
          placeholder="123456"
          disabled={verified}
          class="flex-1 px-3 py-1.5 text-xs font-mono tracking-widest text-center rounded-sm bg-surface-subtle border border-border text-ink hover:border-border-strong focus-visible:outline-2 focus-visible:outline-focus focus-visible:border-focus disabled:opacity-60 transition-colors"
        />
        <button
          type="button"
          onclick={() => (otpRequested = false)}
          disabled={verified}
          class="px-2 py-1.5 text-[11px] rounded-sm border border-border text-ink-muted hover:text-ink hover:border-border-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-50 cursor-pointer transition-all"
        >
          Change
        </button>
      </div>
    </div>

    <button
      onclick={handleConsentSubmit}
      disabled={verified || loading}
      class="w-full h-8 rounded-sm bg-brand text-white text-xs font-medium hover:bg-brand/90 active:scale-95 focus-visible:outline-2 focus-visible:outline-focus shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
    >
      {#if verified}
        <CheckCircle2 class="w-3.5 h-3.5 text-white" />
        <span>Consent Cryptographically Verified & Sealed</span>
      {:else if loading}
        <KeyRound class="w-3.5 h-3.5 animate-spin" />
        <span>Verifying Guardian Credentials...</span>
      {:else}
        <span>Confirm & Authorize Learner Access</span>
        <ArrowRight class="w-3.5 h-3.5" />
      {/if}
    </button>
  {/if}
</div>
