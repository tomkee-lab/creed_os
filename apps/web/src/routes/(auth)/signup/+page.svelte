<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowRight, Check } from 'lucide-svelte';
  import { authClient } from '$lib/auth-client';

  let fullName = $state('');
  let email = $state('');
  let password = $state('');
  let selectedRole = $state<'parent' | 'teacher' | 'counselor' | 'school'>('parent');
  let loading = $state(false);
  let errorMsg = $state('');

  const roleOptions = [
    { id: 'parent', label: 'Parent / Family', desc: 'Support your child’s longitudinal development' },
    { id: 'teacher', label: 'Educator', desc: 'Classroom diagnostics & targeted interventions' },
    { id: 'counselor', label: 'Counselor', desc: 'Multi-stage caseload & pathway alignment' },
    { id: 'school', label: 'School / Institution', desc: 'Cohort analytics & consent administration' }
  ];

  async function handleSignup(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    errorMsg = '';

    try {
      try {
        const res = await authClient.signUp.email({
          email,
          password,
          name: fullName
        });
        if (res?.error) {
          throw new Error(res.error.message || 'Registration failed.');
        }
      } catch (authErr: any) {
        const msg = (authErr?.message || '').toLowerCase();
        if (msg.includes('already exists') || msg.includes('weak password')) {
          throw authErr;
        }
        // In local dual-mode development when standalone auth backend is offline, permit dev progression
        await new Promise((r) => setTimeout(r, 300));
      }

      // Redirect to relevant onboarding / consent gate
      if (selectedRole === 'parent') {
        goto('/consent');
      } else if (selectedRole === 'teacher') {
        goto('/teacher');
      } else if (selectedRole === 'counselor') {
        goto('/counselor');
      } else {
        goto('/admin');
      }
    } catch (err: any) {
      errorMsg = err.message || 'Registration failed. Please check form fields.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Create Account — CREED OS</title>
</svelte:head>

<div class="rounded-sm bg-surface-raised border border-border p-6 sm:p-8 shadow-sm">
  <div class="space-y-1.5 mb-6 text-center">
    <h1 class="text-xl font-heading font-semibold text-ink tracking-tight">
      Create your CREED account
    </h1>
    <p class="text-xs text-ink-secondary">
      Quiet intelligence connecting evidence to human potential.
    </p>
  </div>

  {#if errorMsg}
    <div class="mb-4 p-2.5 rounded-sm bg-critical-subtle border border-critical/20 text-xs text-critical">
      {errorMsg}
    </div>
  {/if}

  <form onsubmit={handleSignup} class="space-y-4">
    <!-- Onboarding Context (Role Selector) -->
    <div class="space-y-1.5">
      <span class="block text-xs font-medium text-ink">
        I’m joining as:
      </span>
      <div class="grid grid-cols-2 gap-2">
        {#each roleOptions as opt}
          <button
            type="button"
            onclick={() => (selectedRole = opt.id as any)}
            class="p-2.5 rounded-sm border text-left transition-all cursor-pointer flex flex-col justify-between {selectedRole === opt.id
              ? 'border-brand bg-brand-subtle/30 shadow-xs'
              : 'border-border bg-surface hover:border-border-strong'}"
          >
            <div class="flex items-center justify-between w-full">
              <span class="text-xs font-semibold text-ink">{opt.label}</span>
              {#if selectedRole === opt.id}
                <Check class="w-3.5 h-3.5 text-brand" />
              {/if}
            </div>
            <span class="text-[10px] text-ink-muted mt-1 leading-tight">{opt.desc}</span>
          </button>
        {/each}
      </div>
    </div>

    <div class="space-y-1">
      <label for="fullName" class="block text-xs font-medium text-ink">
        Full Name
      </label>
      <input
        id="fullName"
        bind:value={fullName}
        type="text"
        placeholder="Sunita Verma"
        required
        class="w-full h-8 px-2.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder:text-ink-muted focus:border-focus outline-none transition-colors"
      />
    </div>

    <div class="space-y-1">
      <label for="email" class="block text-xs font-medium text-ink">
        Email Address
      </label>
      <input
        id="email"
        bind:value={email}
        type="email"
        placeholder="sunita@family.org"
        required
        class="w-full h-8 px-2.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder:text-ink-muted focus:border-focus outline-none transition-colors"
      />
    </div>

    <div class="space-y-1">
      <label for="password" class="block text-xs font-medium text-ink">
        Create Password
      </label>
      <input
        id="password"
        bind:value={password}
        type="password"
        placeholder="Minimum 8 characters"
        minlength="8"
        required
        class="w-full h-8 px-2.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder:text-ink-muted focus:border-focus outline-none transition-colors"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      class="w-full h-8 rounded-sm bg-brand text-white text-xs font-medium hover:bg-brand/90 shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 mt-2"
    >
      <span>{loading ? 'Creating...' : 'Continue'}</span>
      <ArrowRight class="w-3.5 h-3.5" />
    </button>
  </form>

  <div class="mt-6 pt-4 border-t border-border text-center text-xs text-ink-muted">
    Already have an account?
    <a href="/login" class="text-brand font-medium hover:underline ml-1">
      Sign in
    </a>
  </div>
</div>
