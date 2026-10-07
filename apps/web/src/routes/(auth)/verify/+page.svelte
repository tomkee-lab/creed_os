<script lang="ts">
  import { CheckCircle2, ArrowRight } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Verify Account — CREED OS</title>
</svelte:head>

<div class="rounded-sm bg-surface-raised border border-border p-6 sm:p-8 shadow-sm text-center space-y-4">
  <div class="w-10 h-10 rounded-sm bg-positive-subtle text-positive mx-auto flex items-center justify-center">
    <CheckCircle2 class="w-5 h-5" />
  </div>

  <div class="space-y-1">
    <h1 class="text-xl font-heading font-semibold text-ink tracking-tight">
      Verification Email Sent
    </h1>
    <p class="text-xs text-ink-secondary leading-relaxed">
      Please check your email and click the confirmation link to complete your secure setup.
    </p>
  </div>

  <div class="pt-4 border-t border-border">
    <a
      href="/login"
      class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-white text-xs font-medium hover:bg-brand/90 transition-colors"
    >
      <span>Proceed to Sign In</span>
      <ArrowRight class="w-3.5 h-3.5" />
    </a>
  </div>
</div>
