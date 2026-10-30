<script lang="ts">
  import { Sun, Moon } from 'lucide-svelte';
  import CreedLogo from '$lib/components/brand/CreedLogo.svelte';
  import LoginForm from '$lib/components/login-form.svelte';
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { isReducedMotion } from '$lib/motion/scroll.js';

  let isDarkMode = $state(true);

  onMount(() => {
    isDarkMode = document.documentElement.classList.contains('dark');

    if (!isReducedMotion()) {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        '.login-header-reveal',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.28 }
      )
        .fromTo(
          '.login-portal-card',
          { opacity: 0, y: 16, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45 },
          '-=0.1'
        )
        .fromTo(
          '.login-image-layer',
          { opacity: 0, scale: 1.04 },
          { opacity: 1, scale: 1, duration: 0.55 },
          '-=0.28'
        )
        .fromTo(
          '.login-footer-reveal',
          { opacity: 0 },
          { opacity: 1, duration: 0.25 },
          '-=0.15'
        );
    }
  });

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('way_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('way_theme', 'light');
    }
  }
</script>

<svelte:head>
  <title>Sign In · CREED OS</title>
</svelte:head>

<div class="h-screen max-h-screen flex flex-col justify-between px-4 py-2 sm:px-6 sm:py-3 lg:px-8 bg-canvas text-ink overflow-x-hidden overflow-y-auto lg:overflow-hidden">
  <!-- Top header: symmetrical to portal width -->
  <header class="login-header-reveal flex items-center justify-between max-w-4xl mx-auto w-full shrink-0">
    <div class="flex items-center gap-2">
      <a href="/" class="flex items-center gap-2 font-medium group">
        <div class="flex size-7 items-center justify-center rounded-sm bg-brand/10 text-brand border border-brand/20 shadow-xs group-hover:bg-brand group-hover:text-brand-foreground transition-all duration-200">
          <CreedLogo size={15} />
        </div>
        <span class="font-heading font-semibold text-xs sm:text-sm tracking-tight text-ink group-hover:text-brand transition-colors duration-200">
          CREED OS
        </span>
      </a>
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface-raised border border-border text-[9px] font-mono text-ink-muted">
        <span class="w-1 h-1 bg-mint rounded-none"></span>
        OBSERVATORY v2.1
      </span>
    </div>

    <button
      onclick={toggleTheme}
      class="min-h-9 min-w-9 inline-flex items-center justify-center rounded-sm text-ink-muted hover:text-ink hover:bg-surface-subtle transition-all duration-140 cursor-pointer active:scale-95"
      aria-label="Toggle theme"
    >
      {#if isDarkMode}
        <Sun class="w-4 h-4 text-attention transition-transform hover:rotate-12 duration-200" />
      {:else}
        <Moon class="w-4 h-4 transition-transform hover:-rotate-12 duration-200" />
      {/if}
    </button>
  </header>

  <!-- Portal card: max-w-4xl with balanced vertical breathing room -->
  <main class="w-full max-w-4xl mx-auto my-auto py-1 sm:py-1.5 flex-1 flex items-center justify-center">
    <div class="login-portal-card w-full rounded-sm bg-surface-raised border border-border shadow-lg overflow-hidden grid md:grid-cols-2 relative transition-all duration-200 hover:border-border-strong">
      <!-- Left image column: matched to right column height -->
      <div class="relative w-full h-40 sm:h-48 md:h-full md:min-h-0 bg-surface-subtle overflow-hidden select-none border-b md:border-b-0 md:border-r border-border">
        <img
          src="/images/illustrations/login_observatory.jpg"
          alt="CREED OS Learner Intelligence Observatory"
          class="login-image-layer absolute inset-0 h-full w-full object-cover object-center dark:brightness-[0.94] dark:contrast-[1.02] transition-transform duration-200 ease-out hover:scale-[1.015]"
          loading="eager"
        />
        <!-- Corner plate tag -->
        <div class="absolute top-3 left-3 z-10">
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-canvas/85 backdrop-blur-xs border border-border/80 text-[9px] font-mono uppercase tracking-wider text-ink font-semibold">
            <span class="w-1.5 h-1.5 bg-mint rounded-none"></span>
            EVD-3904 · OBSERVATORY
          </span>
        </div>
      </div>

      <!-- Right form column: compact, elegant padding -->
      <div class="flex flex-col justify-center px-6 py-4 sm:px-8 sm:py-5 bg-surface-raised relative">
        <!-- Subtle top brand accent hairline -->
        <div class="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-brand/40 to-transparent"></div>
        <LoginForm />
      </div>
    </div>
  </main>

  <!-- Legal footer: symmetrical to portal width -->
  <footer class="login-footer-reveal max-w-4xl mx-auto w-full text-center text-[10px] font-mono text-ink-muted py-0.5 transition-colors shrink-0">
    DPDP Act 2023 Compliant · Verified Parental Consent Required for Minors under 18
  </footer>
</div>
