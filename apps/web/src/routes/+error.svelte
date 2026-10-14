<script lang="ts">
  import { page } from '$app/state';
  import { ShieldAlert, ArrowLeft, LogIn, Lock, Compass, Sliders, RefreshCw } from 'lucide-svelte';
  import CreedLogo from '$lib/components/brand/CreedLogo.svelte';

  const status = $derived(page.status);
  const errorMessage = $derived(page.error?.message || 'An unexpected error occurred.');
  const pathname = $derived(page.url.pathname);

  const isAccessDenied = $derived(status === 403 || status === 401);
  const isNotFound = $derived(status === 404);

  // Target workspace persona derivation
  const requiredPersona = $derived.by(() => {
    if (pathname.startsWith('/studio') || pathname.startsWith('/author')) {
      return {
        role: 'studio',
        title: 'Psychometrics & Item Studio',
        personaTitle: 'Psychometrician (Studio)',
        description: '3PL IRT item authoring, parameter calibration, and discrimination metrics.'
      };
    }
    if (pathname.startsWith('/admin')) {
      return {
        role: 'admin',
        title: 'Institutional Administration',
        personaTitle: 'System Administrator',
        description: 'Consent audit records, tenant configurations, and educator provisioning.'
      };
    }
    if (pathname.startsWith('/teacher')) {
      return {
        role: 'teacher',
        title: 'Teacher Copilot',
        personaTitle: 'Lead Educator',
        description: 'Differentiated lesson plan studio and classroom observation logging.'
      };
    }
    if (pathname.startsWith('/counselor')) {
      return {
        role: 'counselor',
        title: 'Counselor Intelligence Center',
        personaTitle: 'Academic Counselor',
        description: 'Caseload telemetry and longitudinal learner guidance.'
      };
    }
    if (pathname.startsWith('/parent')) {
      return {
        role: 'parent',
        title: 'Parent Portal',
        personaTitle: 'Parent Guardian',
        description: 'Child growth evidence and statutory DPDP consent management.'
      };
    }
    return null;
  });

  let switching = $state(false);

  async function handleDevSwitch() {
    if (!requiredPersona || switching) return;
    switching = true;
    try {
      await fetch('/api/auth/dev-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: requiredPersona.role })
      });
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch dev persona:', err);
      switching = false;
    }
  }

  const title = $derived.by(() => {
    if (status === 401) return 'Authentication Required';
    if (status === 403) return 'Institutional Access Restricted';
    if (status === 404) return 'Destination Not Found';
    return 'System Error';
  });

  const subtitle = $derived.by(() => {
    if (status === 401) {
      return 'You must possess an active, verified session to access this workspace.';
    }
    if (status === 403) {
      return errorMessage || 'Your authenticated role does not possess permissions to access this institutional workspace under DPDP Act governance.';
    }
    if (status === 404) {
      return 'The requested navigation resource or page could not be located in CREED OS.';
    }
    return 'An unexpected condition interrupted the requested operation.';
  });
</script>

<svelte:head>
  <title>{status} · {title} — CREED OS</title>
</svelte:head>

<div class="min-h-screen bg-canvas text-ink flex flex-col justify-between p-4 sm:p-8">
  <!-- Minimal Top Header -->
  <header class="max-w-4xl mx-auto w-full flex items-center justify-between pb-8">
    <a href="/" class="flex items-center gap-2 group">
      <div class="w-8 h-8 rounded-none bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shadow-xs group-hover:bg-brand group-hover:text-brand-foreground transition-all">
        <CreedLogo size={18} class="transition-transform group-hover:scale-105" />
      </div>
      <span class="font-heading font-semibold text-xs tracking-tight text-ink group-hover:text-brand transition-colors">
        CREED OS
      </span>
    </a>

    <span class="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-none bg-surface border border-border text-ink-muted">
      HTTP {status}
    </span>
  </header>

  <!-- Focused Center Card -->
  <main class="max-w-md mx-auto w-full my-auto">
    <div class="rounded-none bg-surface-raised border border-border p-6 sm:p-8 shadow-sm space-y-6">
      <!-- Icon & Status Tag -->
      <div class="flex items-center justify-between">
        <div class="w-10 h-10 rounded-none {isAccessDenied ? 'bg-critical-subtle text-critical border border-critical/20' : 'bg-surface-subtle text-ink-muted border border-border'} flex items-center justify-center shadow-xs">
          {#if isAccessDenied}
            <Lock class="w-5 h-5" />
          {:else if isNotFound}
            <Compass class="w-5 h-5" />
          {:else}
            <ShieldAlert class="w-5 h-5" />
          {/if}
        </div>

        <span class="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
          {isAccessDenied ? 'SECURITY // RBAC' : 'SYSTEM STATUS'}
        </span>
      </div>

      <!-- Level 1 Signal & Level 2 Context -->
      <div class="space-y-2">
        <h1 class="text-xl font-heading font-semibold text-ink tracking-tight">
          {isAccessDenied && errorMessage ? errorMessage : title}
        </h1>
        <p class="text-xs text-ink-secondary leading-relaxed">
          {subtitle}
        </p>
      </div>

      <!-- Progressive Diagnostic Readout (Level 3 Evidence) -->
      {#if isAccessDenied}
        <div class="p-3 rounded-none bg-surface border border-border space-y-1.5 text-[11px]">
          <div class="flex items-center justify-between text-ink-muted font-mono text-[10px]">
            <span>POLICY ENFORCEMENT</span>
            <span>DPDP ACT 2023</span>
          </div>
          <p class="text-ink-secondary text-xs">
            Student developmental evidence, diagnostic assessments, and administrative rosters are strictly bound to authenticated institutional credentials and verified guardian consent.
          </p>
          {#if requiredPersona}
            <p class="text-ink-muted text-[10px] pt-1 border-t border-border/50">
              Target Workspace: <span class="text-ink font-medium">{requiredPersona.title}</span> ({requiredPersona.description})
            </p>
          {/if}
        </div>
      {/if}

      <!-- Level 1 Action Primacy -->
      <div class="space-y-2 pt-2 border-t border-border">
        {#if import.meta.env.DEV && isAccessDenied && requiredPersona}
          <button
            onclick={handleDevSwitch}
            disabled={switching}
            class="w-full h-9 rounded-none bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand-hover shadow-xs flex items-center justify-center gap-2 transition-micro cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            {#if switching}
              <RefreshCw class="w-3.5 h-3.5 animate-spin" />
              <span>Activating {requiredPersona.personaTitle}...</span>
            {:else}
              <Sliders class="w-3.5 h-3.5" />
              <span>Switch to {requiredPersona.personaTitle} & Continue</span>
            {/if}
          </button>
        {/if}

        {#if status === 401}
          <a
            href="/login?next={encodeURIComponent(pathname)}"
            class="w-full h-8 rounded-none bg-brand text-brand-foreground text-xs font-medium hover:bg-brand/90 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogIn class="w-3.5 h-3.5" />
            <span>Sign in to CREED OS</span>
          </a>
        {:else}
          <div class="grid grid-cols-2 gap-2">
            <a
              href="/student"
              class="h-8 rounded-none {import.meta.env.DEV && requiredPersona ? 'bg-surface text-ink border border-border hover:bg-surface-subtle' : 'bg-brand text-brand-foreground hover:bg-brand/90'} text-xs font-medium shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Compass class="w-3.5 h-3.5" />
              <span>Learner Home</span>
            </a>
            <a
              href="/login?next={encodeURIComponent(pathname)}"
              class="h-8 rounded-none bg-surface text-ink border border-border hover:bg-surface-subtle text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogIn class="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </a>
          </div>
        {/if}

        <a
          href="/"
          class="w-full h-8 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </a>
      </div>
    </div>
  </main>

  <!-- Legal & Privacy Sovereignty Footer -->
  <footer class="max-w-4xl mx-auto w-full text-center text-[11px] text-ink-muted pt-8">
    CREED OS Learner Intelligence Platform · Zero Production Data Leaks Policy
  </footer>
</div>
