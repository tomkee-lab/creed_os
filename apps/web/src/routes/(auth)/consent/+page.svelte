<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    Shield,
    CheckCircle2,
    Lock,
    ArrowRight,
    AlertCircle,
    Phone,
    UserCheck,
    KeyRound,
    FileText,
    Activity,
    Layers,
    FileCheck,
    RotateCcw,
    ShieldAlert,
    ExternalLink
  } from 'lucide-svelte';
  import AltchaWidget from '$lib/components/security/AltchaWidget.svelte';
  import { PinInput, PinInputCell } from '$lib/components/ui/pin-input';
  import { Icon } from '$lib/components/icons';

  type ConsentTab = 'verify' | 'dpdp' | 'ledger' | 'privacy';
  let activeTab = $state<ConsentTab>('verify');

  let channel = $state<'digilocker' | 'sms'>('sms');
  let parentName = $state('');
  let parentContact = $state('');
  let relationship = $state('');
  let altchaPayload = $state('');
  let altchaVerified = $state(false);
  let otp = $state('');
  let otpRequested = $state(false);
  let devOtpHint = $state(''); // Only populated in DEV environments via server response
  let verified = $state(false);
  let loading = $state(false);
  let errorMessage = $state('');
  let hydrated = $state(false);

  // Live Consent Withdrawal simulator state
  let withdrawLoading = $state(false);
  let withdrawResult = $state<string | null>(null);

  onMount(() => {
    hydrated = true;

    function syncHash() {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.replace('#', '') as ConsentTab;
      if (['verify', 'dpdp', 'ledger', 'privacy'].includes(hash)) {
        activeTab = hash;
      }
    }

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  });

  function setTab(tab: ConsentTab) {
    activeTab = tab;
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
    }
  }

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
          channel: channel === 'sms' ? 'SMS_OTP' : 'DIGILOCKER',
          altcha: altchaPayload || undefined
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        errorMessage = data.error || 'Failed to send OTP. Please try again.';
        loading = false;
        return;
      }

      otpRequested = true;
      // devOtp is only included in development server responses (never in production)
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

  async function handleWithdrawConsent() {
    withdrawLoading = true;
    withdrawResult = null;
    try {
      const res = await fetch('/api/v1/consent/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        withdrawResult = 'Consent successfully revoked and recorded in immutable ledger. All diagnostic profiling frozen.';
      } else {
        withdrawResult = data.error || 'Withdrawal request failed.';
      }
    } catch (err: any) {
      withdrawResult = err?.message || 'Failed to communicate with consent authority.';
    } finally {
      withdrawLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Parental Consent & DPDP Governance Portal · CREED OS</title>
  <meta
    name="description"
    content="India DPDP Act 2023 compliance, immutable consent ledger state machine, and verified parental consent gate."
  />
</svelte:head>

<div data-hydrated={hydrated ? 'true' : 'false'} class="space-y-6">
  <!-- Governance Portal Navigation Tabs -->
  <div class="border-b border-border flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs">
    <button
      type="button"
      onclick={() => setTab('verify')}
      class="px-3 py-2 rounded-sm font-medium transition-colors cursor-pointer border {activeTab === 'verify'
        ? 'border-brand bg-brand/10 text-brand font-semibold'
        : 'border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
    >
      <span class="flex items-center gap-1.5">
        <UserCheck class="w-3.5 h-3.5" />
        <span>Parental Verification Gate</span>
      </span>
    </button>

    <button
      type="button"
      onclick={() => setTab('dpdp')}
      class="px-3 py-2 rounded-sm font-medium transition-colors cursor-pointer border {activeTab === 'dpdp'
        ? 'border-brand bg-brand/10 text-brand font-semibold'
        : 'border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
    >
      <span class="flex items-center gap-1.5">
        <Shield class="w-3.5 h-3.5" />
        <span>DPDP Compliance</span>
      </span>
    </button>

    <button
      type="button"
      onclick={() => setTab('ledger')}
      class="px-3 py-2 rounded-sm font-medium transition-colors cursor-pointer border {activeTab === 'ledger'
        ? 'border-brand bg-brand/10 text-brand font-semibold'
        : 'border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
    >
      <span class="flex items-center gap-1.5">
        <Activity class="w-3.5 h-3.5" />
        <span>Consent Ledger</span>
      </span>
    </button>

    <button
      type="button"
      onclick={() => setTab('privacy')}
      class="px-3 py-2 rounded-sm font-medium transition-colors cursor-pointer border {activeTab === 'privacy'
        ? 'border-brand bg-brand/10 text-brand font-semibold'
        : 'border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
    >
      <span class="flex items-center gap-1.5">
        <Lock class="w-3.5 h-3.5" />
        <span>Consent & Privacy</span>
      </span>
    </button>
  </div>

  <!-- Parental verification gate tab. Contains elements and test selectors required by E2E suites. -->
  {#if activeTab === 'verify'}
    <div class="rounded-sm bg-surface-raised border border-border p-6 sm:p-8 shadow-sm space-y-6">
      <!-- Header -->
      <div class="flex items-start gap-3">
        <div class="w-9 h-9 rounded-sm bg-brand-subtle border border-brand/20 flex items-center justify-center shrink-0">
          <Icon icon="carbon:shield-check" class="w-5 h-5 text-brand" />
        </div>
        <div>
          <h1 class="text-base font-heading font-medium text-ink tracking-tight">
            Verified Parental Consent Notice
          </h1>
          <p class="text-xs text-ink-muted">
            Mandatory statutory verification under India DPDP Act 2023 & Child Safety Standards
          </p>
        </div>
      </div>

      <!-- Student Scope Summary -->
      <div class="p-3.5 rounded-sm bg-surface border border-border space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="text-ink-muted">Minor Learner:</span>
          <span class="font-medium text-ink">Enrolled Student (Class 8)</span>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-ink-muted">Affiliated Institution:</span>
          <span class="font-medium text-ink">Affiliated Educational Institution</span>
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
            class="p-2 rounded-sm border text-left transition-colors cursor-pointer hover:border-border-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 {channel === 'sms'
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
            class="p-2 rounded-sm border text-left transition-colors cursor-pointer hover:border-border-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60 {channel === 'digilocker'
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
        <div class="space-y-2">
          <AltchaWidget bind:payload={altchaPayload} bind:verified={altchaVerified} />
          <button
            type="button"
            onclick={handleRequestOtp}
            class="w-full h-8 rounded-none bg-surface border border-border text-ink text-xs font-medium hover:bg-surface-subtle hover:border-border-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-focus shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Phone class="w-3.5 h-3.5 text-brand" />
            <span>Send Verification OTP</span>
          </button>
        </div>
      {:else}
        <div class="space-y-3 pt-2 border-t border-border">
          <div class="flex items-center justify-between">
            <label for="otp-code" class="block text-xs font-medium text-ink">Enter 6-Digit Verification Code</label>
            {#if devOtpHint}
              <span class="text-[10px] font-mono text-attention bg-attention-subtle px-1 rounded-none">[DEV] OTP: {devOtpHint}</span>
            {/if}
          </div>

          <!-- Bits UI v1 Segmented PinInput OTP -->
          <div data-testid="pin-input-otp" class="flex items-center justify-between gap-2">
            <PinInput
              bind:value={otp}
              maxlength={6}
              disabled={verified}
              inputId="otp-code"
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
              onclick={() => (otpRequested = false)}
              disabled={verified}
              class="px-2 py-1.5 text-[11px] rounded-none border border-border text-ink-muted hover:text-ink hover:border-border-strong active:scale-95 focus-visible:outline-2 focus-visible:outline-focus disabled:opacity-50 cursor-pointer transition-all"
            >
              Change
            </button>
          </div>
        </div>

        <button
          onclick={handleConsentSubmit}
          disabled={verified || loading}
          class="w-full h-9 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 active:scale-95 focus-visible:outline-2 focus-visible:outline-focus shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {#if verified}
            <CheckCircle2 class="w-3.5 h-3.5 text-brand-foreground" />
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
  {/if}

  <!-- DPDP Act 2023 statutory compliance tab. -->
  {#if activeTab === 'dpdp'}
    <div id="dpdp" class="space-y-6 scroll-mt-20">
      <div class="p-6 sm:p-8 rounded-sm bg-surface-raised border border-border space-y-4">
        <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
          <Shield class="w-3.5 h-3.5" />
          <span>Statutory Alignment</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-heading font-medium text-ink tracking-tight">
          India Digital Personal Data Protection Act (DPDP Act 2023)
        </h2>
        <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
          CREED OS is engineered specifically around Chapter II, Section 9 of the DPDP Act 2023, establishing statutory guarantees for all minor learners under 18 years of age.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
            <div class="font-semibold text-ink flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-brand rounded-none"></span>
              <span>Section 9(1) · Verifiable Parental Consent</span>
            </div>
            <p class="text-ink-secondary leading-relaxed">
              Mandates that data fiduciaries obtain verifiable parental consent before processing any personal data of a minor. Handshakes occur via Aadhaar OTP or DigiLocker.
            </p>
          </div>

          <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
            <div class="font-semibold text-ink flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-brand rounded-none"></span>
              <span>Section 9(2) · Harmful Processing Ban</span>
            </div>
            <p class="text-ink-secondary leading-relaxed">
              Absolute statutory prohibition against processing that causes detrimental physical or psychological effects on children, including anxiety-inducing ranking systems.
            </p>
          </div>

          <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
            <div class="font-semibold text-ink flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-brand rounded-none"></span>
              <span>Section 9(3) · Prohibition of Behavioral Tracking</span>
            </div>
            <p class="text-ink-secondary leading-relaxed">
              Strict statutory ban on tracking, behavioral monitoring, or targeted advertising directed at children. Zero marketing pixels or third-party cookies exist on CREED OS.
            </p>
          </div>

          <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
            <div class="font-semibold text-ink flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-brand rounded-none"></span>
              <span>Section 6 · Plain Notice & Transparency</span>
            </div>
            <p class="text-ink-secondary leading-relaxed">
              Clear, transparent, multilingual notices provided in English, Hindi, and regional languages detailing exact purposes of formative psychometric telemetry.
            </p>
          </div>
        </div>
      </div>

      <!-- Institutional Fiduciary Contacts -->
      <div class="p-4 rounded-sm bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <span class="font-semibold text-ink">Designated Data Protection Officer (DPO):</span>
          <span class="text-ink-secondary font-mono ml-2">dpo@creed-os.app · Statutory Grievance Redressal (7 Days)</span>
        </div>
        <button
          type="button"
          onclick={() => setTab('verify')}
          class="px-3 py-1.5 rounded-sm bg-brand text-brand-foreground font-semibold shrink-0 hover:bg-brand/90 transition-colors cursor-pointer"
        >
          Verify Guardian Consent
        </button>
      </div>
    </div>
  {/if}

  <!-- Immutable consent ledger tab. -->
  {#if activeTab === 'ledger'}
    <div id="ledger" class="space-y-6 scroll-mt-20">
      <div class="p-6 sm:p-8 rounded-sm bg-surface-raised border border-border space-y-4">
        <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
          <Activity class="w-3.5 h-3.5" />
          <span>Cryptographic State Machine</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-heading font-medium text-ink tracking-tight">
          Consent Lifecycle & Immutable Audit Ledger
        </h2>
        <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
          Consent is not a checkbox; it is a tamper-evident finite state machine enforced at the database Row Level Security layer.
        </p>

        <!-- 5-Stage State Machine Display -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-2">
          <div class="p-3 rounded-sm bg-surface border border-border space-y-1">
            <span class="text-[10px] font-mono text-ink-muted">STATE 01</span>
            <div class="font-mono text-xs font-semibold text-ink">DRAFT</div>
            <p class="text-[11px] text-ink-muted">Profile initiated by school. Processing locked.</p>
          </div>

          <div class="p-3 rounded-sm bg-surface border border-border space-y-1">
            <span class="text-[10px] font-mono text-ink-muted">STATE 02</span>
            <div class="font-mono text-xs font-semibold text-attention">INVITED</div>
            <p class="text-[11px] text-ink-muted">Guardian token dispatched via SMS/DigiLocker.</p>
          </div>

          <div class="p-3 rounded-sm bg-surface border border-border space-y-1">
            <span class="text-[10px] font-mono text-ink-muted">STATE 03</span>
            <div class="font-mono text-xs font-semibold text-brand">CONSENTED</div>
            <p class="text-[11px] text-ink-muted">Government-backed OTP verification verified.</p>
          </div>

          <div class="p-3 rounded-sm bg-surface border border-border space-y-1">
            <span class="text-[10px] font-mono text-ink-muted">STATE 04</span>
            <div class="font-mono text-xs font-semibold text-positive">ACTIVE</div>
            <p class="text-[11px] text-ink-muted">Diagnostic missions authorized under RLS policies.</p>
          </div>

          <div class="p-3 rounded-sm bg-surface border border-border space-y-1">
            <span class="text-[10px] font-mono text-ink-muted">STATE 05</span>
            <div class="font-mono text-xs font-semibold text-critical">WITHDRAWN</div>
            <p class="text-[11px] text-ink-muted">Consent revoked. Immediate data processing freeze.</p>
          </div>
        </div>
      </div>

      <!-- Active Demonstrable Ledger Record -->
      <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <div class="flex items-center gap-2">
            <FileCheck class="w-4 h-4 text-mint" />
            <h3 class="text-sm font-semibold text-ink">Active Minor Consent Receipt</h3>
          </div>
          <span class="px-2 py-0.5 rounded-sm bg-positive/10 text-positive border border-positive/20 font-mono text-[11px]">
            ACTIVE · SHA-256 SEALED
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div class="p-3 rounded-sm bg-surface border border-border space-y-1">
            <span class="text-ink-muted block text-[10px]">CONSENT RECORD ID</span>
            <span class="text-ink font-semibold">CON-2026-IND-984210</span>
          </div>
          <div class="p-3 rounded-sm bg-surface border border-border space-y-1">
            <span class="text-ink-muted block text-[10px]">LEARNER IDENTITY HASH</span>
            <span class="text-ink truncate block">3fa85f64-5717-4562-b3fc-2c963f66afa6</span>
          </div>
          <div class="p-3 rounded-sm bg-surface border border-border space-y-1">
            <span class="text-ink-muted block text-[10px]">VERIFICATION PROTOCOL</span>
            <span class="text-ink">UIDAI SMS OTP Handshake (Govt. of India)</span>
          </div>
          <div class="p-3 rounded-sm bg-surface border border-border space-y-1">
            <span class="text-ink-muted block text-[10px]">CRYPTOGRAPHIC PROVENANCE SEAL</span>
            <span class="text-ink truncate block">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
          </div>
        </div>

        <!-- 1-Click Revocation Simulator (Live Backend Handshake) -->
        <div class="pt-2 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-0.5">
            <div class="text-xs font-semibold text-ink">Statutory Right to Withdraw Consent (Section 6(4))</div>
            <p class="text-xs text-ink-secondary">Parents may revoke consent at any time without punitive consequences.</p>
          </div>

          <button
            type="button"
            onclick={handleWithdrawConsent}
            disabled={withdrawLoading}
            class="px-3 py-1.5 rounded-sm bg-critical-subtle border border-critical/30 text-critical hover:bg-critical/20 text-xs font-medium transition-colors shrink-0 cursor-pointer disabled:opacity-50"
          >
            {#if withdrawLoading}
              <span>Executing Revocation...</span>
            {:else}
              <span>Simulate Consent Revocation</span>
            {/if}
          </button>
        </div>

        {#if withdrawResult}
          <div class="p-3 bg-surface border border-border rounded-sm text-xs text-ink space-y-1">
            <div class="font-semibold text-positive flex items-center gap-1.5">
              <CheckCircle2 class="w-4 h-4" />
              <span>Ledger Transaction Result:</span>
            </div>
            <p class="text-ink-secondary font-mono">{withdrawResult}</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Consent and privacy policy tab. -->
  {#if activeTab === 'privacy'}
    <div id="privacy" class="space-y-6 scroll-mt-20">
      <div class="p-6 sm:p-8 rounded-sm bg-surface-raised border border-border space-y-4">
        <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
          <Lock class="w-3.5 h-3.5" />
          <span>Child Privacy Sovereignty</span>
        </div>
        <h2 class="text-xl sm:text-2xl font-heading font-medium text-ink tracking-tight">
          Data Minimization & Child Safety Policy
        </h2>
        <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
          We operate under strict data minimization. Children are not advertising targets or training fuel.
        </p>

        <!-- What We Process vs Never Touch -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
            <h3 class="font-semibold text-ink flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-positive" />
              <span>What CREED OS Collects & Processes</span>
            </h3>
            <ul class="space-y-1.5 text-ink-secondary">
              <li>• Item Response vectors for 3PL difficulty calibration</li>
              <li>• Simulation mechanical parameters (torque, gear ratios)</li>
              <li>• Qualitative classroom demonstration rubrics from teachers</li>
              <li>• Verified parental consent ledger receipts and timestamps</li>
            </ul>
          </div>

          <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
            <h3 class="font-semibold text-ink flex items-center gap-2">
              <ShieldAlert class="w-4 h-4 text-critical" />
              <span>What We Strictly NEVER Collect</span>
            </h3>
            <ul class="space-y-1.5 text-ink-secondary">
              <li>• Biometric telemetry (facial scanning, eye tracking)</li>
              <li>• Persistent voice recordings or ambient audio</li>
              <li>• Social media graph identifiers or browsing history</li>
              <li>• Behavioral tracking or advertising profile identifiers</li>
            </ul>
          </div>
        </div>

        <!-- Relationship Scoped RLS -->
        <div class="p-4 rounded-sm bg-surface border border-border space-y-2 text-xs">
          <h3 class="font-semibold text-ink">Relationship-Scoped Row Level Security (RLS)</h3>
          <p class="text-ink-secondary leading-relaxed">
            Data is strictly isolated at the PostgreSQL kernel level. Student records can only be queried by the verified student themselves, their consented legal guardian, and their accredited classroom teacher. Cross-tenant queries are blocked unconditionally by database policies.
          </p>
        </div>
      </div>
    </div>
  {/if}
</div>
