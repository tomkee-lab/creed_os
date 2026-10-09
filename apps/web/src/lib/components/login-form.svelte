<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button/index.js';
  import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldDescription,
    FieldSeparator
  } from '$lib/components/ui/field/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Icon } from '$lib/components/icons';
  import { ChevronDown, Eye, EyeOff, ArrowRight } from 'lucide-svelte';
  import { magneticHover } from '$lib/motion/interaction.js';
  import { cn, type WithElementRef } from '$lib/utils.js';
  import type { HTMLFormAttributes } from 'svelte/elements';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: WithElementRef<HTMLFormAttributes> = $props();

  const id = $props.id();

  const ROLES = [
    { value: 'student', title: 'Student', label: 'Learner Workspace', email: 'learner@core-os.app', path: '/student', icon: 'ph:student' },
    { value: 'parent', title: 'Parent', label: 'Guardian Workspace', email: 'guardian@core-os.app', path: '/parent', icon: 'ph:users' },
    { value: 'teacher', title: 'Teacher', label: 'Educator Workspace', email: 'educator@core-os.app', path: '/teacher', icon: 'ph:chalkboard-teacher' },
    { value: 'counselor', title: 'Counselor', label: 'Counselor Advisory', email: 'counselor@core-os.app', path: '/counselor', icon: 'ph:heartbeat' },
    { value: 'admin', title: 'Administrator', label: 'Admin Console', email: 'admin@core-os.app', path: '/admin', icon: 'carbon:security' },
    { value: 'studio', title: 'Item Studio', label: 'Psychometrics Studio', email: 'studio@core-os.app', path: '/studio', icon: 'carbon:sigma' }
  ];

  let selectedRole = $state('student');
  let email = $state(ROLES[0].email);
  let password = $state('••••••••••••');
  let showPassword = $state(false);
  let loading = $state(false);
  let errorMsg = $state('');

  const nextUrl = $derived(page.url.searchParams.get('next') || '');
  const statusParam = $derived(page.url.searchParams.get('status'));
  const isPendingApproval = $derived(statusParam === 'pending_approval');
  const isAuthRequired = $derived(!!page.url.searchParams.get('next') && !statusParam);

  function handleRoleChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    selectedRole = target.value;
    const found = ROLES.find((r) => r.value === selectedRole);
    if (found) {
      email = found.email;
    }
  }

  async function handleFormSubmit(e: SubmitEvent) {
    e.preventDefault();
    loading = true;
    errorMsg = '';

    const currentRoleObj = ROLES.find((r) => r.value === selectedRole) || ROLES[0];

    try {
      if (import.meta.env.DEV) {
        // In local development, activate the requested persona session
        const res = await fetch('/api/auth/dev-switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: selectedRole })
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to switch persona.');
        }

        const destination = nextUrl && nextUrl !== '/student' ? nextUrl : currentRoleObj.path;
        goto(destination);
      } else {
        // Production Better Auth sign-in
        const { authClient } = await import('$lib/auth-client');
        const res = await authClient.signIn.email({
          email,
          password
        });
        if (res?.error) {
          throw new Error(res.error.message || 'Authentication failed. Please verify credentials.');
        }
        goto(nextUrl || currentRoleObj.path);
      }
    } catch (err: any) {
      errorMsg = err.message || 'Authentication failed. Please verify credentials.';
    } finally {
      loading = false;
    }
  }
</script>

<form
  class={cn('flex flex-col gap-3.5', className)}
  bind:this={ref}
  onsubmit={handleFormSubmit}
  {...restProps}
>
  <FieldGroup class="gap-3">
    <!-- Header -->
    <div class="flex flex-col items-center gap-1 text-center mb-0.5">
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-brand-subtle border border-brand/20 text-[10px] font-mono text-brand font-semibold uppercase tracking-wider mb-1">
        <span class="w-1.5 h-1.5 bg-brand rounded-none"></span>
        Observatory Handshake
      </div>
      <h1 class="text-lg sm:text-xl font-heading font-semibold tracking-tight text-ink">
        Welcome back
      </h1>
      <p class="text-xs text-balance text-ink-secondary leading-relaxed">
        Sign in to access your learner workspace
      </p>
    </div>

    {#if isPendingApproval}
      <div class="p-2.5 rounded-none bg-brand-subtle border border-brand/20 text-xs text-brand space-y-1 text-left">
        <div class="font-medium flex items-center gap-1.5">
          <Icon icon="carbon:information" class="w-3.5 h-3.5" />
          <span>Registration Under Institutional Review</span>
        </div>
        <p class="text-[11px] text-ink-secondary">
          Staff and educator accounts require school administrator approval before accessing workspaces.
        </p>
      </div>
    {:else if isAuthRequired}
      <div class="p-2 rounded-none bg-surface-subtle border border-border text-xs text-ink-secondary flex items-center gap-2 text-left">
        <Icon icon="carbon:locked" class="w-3.5 h-3.5 text-ink-muted shrink-0" />
        <span>Active session required to access the requested workspace.</span>
      </div>
    {/if}

    {#if errorMsg}
      <div class="p-2 rounded-none bg-critical-subtle border border-critical/20 text-xs text-critical text-left">
        {errorMsg}
      </div>
    {/if}

    <!-- Role-Based Selection Dropdown -->
    <Field class="gap-1">
      <FieldLabel for="role-select-{id}" class="text-[11px] font-medium text-ink-secondary">Role / Persona Profile</FieldLabel>
      <div class="relative group">
        <select
          id="role-select-{id}"
          value={selectedRole}
          onchange={handleRoleChange}
          class="w-full h-8 pl-2.5 pr-8 rounded-none bg-surface border border-border text-xs text-ink hover:border-border-strong focus:border-focus outline-none transition-colors appearance-none cursor-pointer"
        >
          {#each ROLES as r}
            <option value={r.value}>{r.label}</option>
          {/each}
        </select>
        <ChevronDown class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted group-hover:text-ink transition-colors" />
      </div>
    </Field>

    <!-- Email Field -->
    <Field class="gap-1">
      <FieldLabel for="email-{id}" class="text-[11px] font-medium text-ink-secondary">Email or Learner ID</FieldLabel>
      <Input
        id="email-{id}"
        type="email"
        bind:value={email}
        placeholder="user@core-os.app"
        required
        class="h-8 text-xs bg-surface focus:border-focus transition-colors"
      />
    </Field>

    <!-- Password Field with Show/Hide Toggle -->
    <Field class="gap-1">
      <div class="flex items-center justify-between">
        <FieldLabel for="password-{id}" class="text-[11px] font-medium text-ink-secondary">Password</FieldLabel>
        <a href="/reset-password" class="text-[11px] text-brand hover:underline underline-offset-4 transition-colors">
          Forgot password?
        </a>
      </div>
      <div class="relative">
        <Input
          id="password-{id}"
          type={showPassword ? 'text' : 'password'}
          bind:value={password}
          required
          class="h-8 pr-8 text-xs bg-surface focus:border-focus transition-colors"
        />
        <button
          type="button"
          onclick={() => (showPassword = !showPassword)}
          class="absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink p-1 transition-colors cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {#if showPassword}
            <EyeOff class="w-3.5 h-3.5" />
          {:else}
            <Eye class="w-3.5 h-3.5" />
          {/if}
        </button>
      </div>
    </Field>

    <!-- Primary Action Button with Magnetic Hover -->
    <Field class="pt-0.5">
      <button
        use:magneticHover
        type="submit"
        disabled={loading}
        class="group w-full cursor-pointer h-8.5 rounded-none text-xs font-semibold bg-brand text-brand-foreground hover:bg-brand-hover shadow-xs active:scale-[0.99] transition-all duration-140 flex items-center justify-center gap-1.5 disabled:opacity-50"
      >
        <span>{loading ? 'Authenticating...' : `Login as ${ROLES.find(r => r.value === selectedRole)?.title}`}</span>
        <ArrowRight class="w-3.5 h-3.5 transition-transform duration-140 group-hover:translate-x-0.5" />
      </button>
    </Field>

    <FieldSeparator class="my-1 text-ink-muted">Or continue with</FieldSeparator>

    <!-- Secondary / OAuth Action -->
    <Field>
      <button
        type="button"
        onclick={() => {
          // Fast-track demo login with active role
          const found = ROLES.find(r => r.value === selectedRole) || ROLES[0];
          goto(nextUrl || found.path);
        }}
        class="w-full cursor-pointer h-8 rounded-none text-xs font-medium gap-2 border border-border bg-surface hover:bg-surface-subtle hover:border-border-strong text-ink active:scale-[0.99] transition-all duration-140 flex items-center justify-center"
      >
        <Icon icon="carbon:badge" class="w-3.5 h-3.5 text-brand" />
        <span>One-Click Institutional Handshake</span>
      </button>

      <FieldDescription class="text-center pt-2 text-xs text-ink-muted">
        Don't have an account?
        <a href="/signup" class="text-brand font-medium hover:underline underline-offset-4 ml-1 transition-colors">
          Sign up
        </a>
      </FieldDescription>
    </Field>
  </FieldGroup>
</form>
