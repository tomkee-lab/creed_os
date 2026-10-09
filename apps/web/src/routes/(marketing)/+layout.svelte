<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { Sun, Moon, ArrowRight, Menu, X, ShieldCheck, ExternalLink } from 'lucide-svelte';
  import CreedLogo from '$lib/components/brand/CreedLogo.svelte';

  let { children } = $props();

  let isDarkMode = $state(true);
  let mobileMenuOpen = $state(false);
  let scrollY = $state(0);
  const isScrolled = $derived(scrollY > 12);

  onMount(() => {
    const saved = localStorage.getItem('way_theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      isDarkMode = false;
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      isDarkMode = true;
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

  const currentPath = $derived(page.url.pathname);

  /** Nav link config for DRY iteration */
  const navLinks = [
    { href: '/platform', label: 'Platform' },
    { href: '/#moments', label: 'How It Works' },
    { href: '/schools', label: 'For Schools' },
    { href: '/families', label: 'For Families' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' }
  ];

  function isActive(href: string): boolean {
    if (href === '/#moments') return currentPath === '/' && typeof window !== 'undefined' && window.location.hash === '#moments';
    return currentPath === href || currentPath.startsWith(href + '/');
  }

  // Floating Indicator Pill Motion State
  let navContainer = $state<HTMLElement | null>(null);
  let indicatorLeft = $state(0);
  let indicatorWidth = $state(0);
  let indicatorOpacity = $state(0);

  function syncIndicator(targetEl?: HTMLElement | null) {
    if (!navContainer) return;
    if (targetEl) {
      indicatorLeft = targetEl.offsetLeft;
      indicatorWidth = targetEl.offsetWidth;
      indicatorOpacity = 1;
      return;
    }

    const activeEl = navContainer.querySelector<HTMLElement>('a.is-active');
    if (activeEl) {
      indicatorLeft = activeEl.offsetLeft;
      indicatorWidth = activeEl.offsetWidth;
      indicatorOpacity = 1;
    } else {
      indicatorOpacity = 0;
    }
  }

  $effect(() => {
    if (navContainer && currentPath) {
      requestAnimationFrame(() => syncIndicator(null));
    }
  });
</script>

<svelte:window bind:scrollY={scrollY} />

<div class="min-h-screen flex flex-col bg-canvas text-ink">
  <!-- ============================================================
       PUBLIC MARKETING SHELL
       Editorial top navigation with Lagom Micro-Animations
       ============================================================ -->
  <header
    class="marketing-header sticky top-0 z-30 w-full border-b transition-[background-color,border-color,backdrop-filter,box-shadow] duration-200 {isScrolled || mobileMenuOpen
      ? 'border-border bg-surface-raised/85 backdrop-blur-md shadow-xs'
      : 'border-transparent bg-transparent backdrop-blur-none'}"
  >
    <div class="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Logo — Hover: brand accent glow + spring scale -->
      <a href="/" class="flex items-center gap-2.5 group">
        <div class="logo-mark w-8 h-8 rounded-none bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shadow-xs">
          <CreedLogo size={20} class="transition-transform group-hover:scale-105" />
        </div>
        <div class="flex flex-col">
          <span class="logo-text font-heading font-semibold text-sm tracking-tight text-ink">
            CREED OS
          </span>
          <span class="text-[9px] uppercase tracking-widest text-ink-muted font-mono">
            Learner Intelligence
          </span>
        </div>
      </a>

      <!-- Center Editorial Links — Floating Indicator Pill with Lagom Spring Motion -->
      <nav
        bind:this={navContainer}
        onmouseleave={() => syncIndicator(null)}
        class="nav-island hidden md:flex items-center relative p-1 rounded-none border border-border/50 bg-surface-subtle/50 backdrop-blur-xs"
        aria-label="Main Navigation"
      >
        <!-- Compositor-accelerated Floating Indicator Pill -->
        <div
          class="nav-indicator pointer-events-none absolute top-1 bottom-1 rounded-none bg-surface-raised border border-border/80 shadow-2xs"
          style="transform: translate3d({indicatorLeft}px, 0, 0); width: {indicatorWidth}px; opacity: {indicatorOpacity};"
          aria-hidden="true"
        >
          <div class="absolute bottom-0 inset-x-0 h-0.5 bg-brand"></div>
        </div>

        {#each navLinks as { href, label }}
          <a
            {href}
            onmouseenter={(e) => syncIndicator(e.currentTarget)}
            onfocus={(e) => syncIndicator(e.currentTarget)}
            class="nav-link relative z-10 px-3.5 py-1 text-xs font-medium transition-colors select-none"
            class:is-active={isActive(href)}
            aria-current={isActive(href) ? 'page' : undefined}
          >
            <span class="relative z-10">{label}</span>
          </a>
        {/each}
      </nav>

      <!-- Right Action Buttons -->
      <div class="flex items-center gap-2.5">
        <!-- Theme Toggle — Celestial Rotation -->
        <button
          onclick={toggleTheme}
          class="theme-toggle p-1.5 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle cursor-pointer overflow-hidden border border-transparent hover:border-border transition-all"
          title={isDarkMode ? 'Switch to Mineral White (Light)' : 'Switch to Deep Slate (Dark)'}
          aria-label="Toggle theme"
        >
          <span class="celestial-icon inline-flex items-center justify-center" class:is-dark={isDarkMode}>
            {#if isDarkMode}
              <Sun class="w-4 h-4 text-attention" />
            {:else}
              <Moon class="w-4 h-4" />
            {/if}
          </span>
        </button>

        <!-- Primary CTA — Access Workspace -->
        <a
          href="/login"
          class="cta-button inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none bg-brand text-brand-foreground text-xs font-semibold shadow-xs"
        >
          <span>Access Workspace</span>
          <ArrowRight class="cta-arrow w-3.5 h-3.5" />
        </a>

        <!-- Mobile Hamburger Toggle -->
        <button
          onclick={() => mobileMenuOpen = !mobileMenuOpen}
          class="mobile-toggle md:hidden p-1.5 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle cursor-pointer border border-transparent hover:border-border"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {#if mobileMenuOpen}
            <X class="w-5 h-5" />
          {:else}
            <Menu class="w-5 h-5" />
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    {#if mobileMenuOpen}
      <nav class="mobile-nav md:hidden border-t border-border bg-surface-raised/95 backdrop-blur-md px-4 pb-4 pt-2">
        <div class="flex flex-col gap-1">
          {#each navLinks as { href, label }}
            <a
              {href}
              onclick={() => mobileMenuOpen = false}
              class="mobile-nav-link px-3 py-2.5 rounded-none text-sm font-medium text-ink-secondary flex items-center justify-between"
              class:is-active={isActive(href)}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              <span>{label}</span>
              {#if isActive(href)}
                <span class="w-1.5 h-1.5 rounded-none bg-brand"></span>
              {/if}
            </a>
          {/each}
          <div class="border-t border-border mt-2 pt-2">
            <a
              href="/login"
              onclick={() => mobileMenuOpen = false}
              class="mobile-cta-link flex items-center justify-between px-3.5 py-2.5 rounded-none bg-brand text-brand-foreground text-sm font-semibold shadow-xs"
            >
              <span>Access Workspace</span>
              <ArrowRight class="w-4 h-4" />
            </a>
          </div>
        </div>
      </nav>
    {/if}
  </header>

  <!-- Public Content -->
  <main class="flex-1" class:-mt-16={currentPath === '/'}>
    {@render children?.()}
  </main>

  <!-- ============================================================
       COMPREHENSIVE EDITORIAL MASTER FOOTER
       WAY 2.1 "Quiet Editorial Intelligence"
       ============================================================ -->
  <footer class="border-t border-border bg-surface py-12 px-4 sm:px-6 lg:px-8 mt-20 text-xs">
    <div class="max-w-7xl mx-auto space-y-12">
      <!-- 5-Column Navigation Matrix -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-8 text-ink-secondary">
        <!-- Col 1: Identity & Statutory -->
        <div class="col-span-2 space-y-4">
          <div class="flex items-center gap-2.5 group">
            <div class="logo-mark w-7 h-7 rounded-none bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shrink-0 shadow-xs">
              <CreedLogo size={18} />
            </div>
            <div class="flex items-center gap-2">
              <span class="font-heading font-semibold text-sm text-ink tracking-tight">CREED OS</span>
              <span class="text-border">•</span>
              <span class="text-[10px] font-mono text-mint uppercase tracking-wider">WAY 3.0</span>
            </div>
          </div>
          <p class="text-xs text-ink-secondary leading-relaxed max-w-sm">
            AI-Native Learner Intelligence & Pathway Navigation Platform. Built on deterministic item response theory, authentic artifact evidence, and verified parental consent state machines.
          </p>
          <div class="flex items-center gap-2 text-[11px] text-ink-muted font-mono">
            <ShieldCheck class="w-3.5 h-3.5 text-mint" />
            <span>India DPDP Act 2023 · Relationship-Scoped RLS</span>
          </div>
        </div>

        <!-- Col 2: Workspaces -->
        <div class="space-y-3 font-sans">
          <h4 class="text-xs font-semibold text-ink uppercase tracking-wider">Workspaces</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/login?next=%2Fstudent" class="footer-link">Student Space</a></li>
            <li><a href="/login?next=%2Fparent" class="footer-link">Parent Portal</a></li>
            <li><a href="/login?next=%2Fteacher" class="footer-link">Teacher Copilot</a></li>
            <li><a href="/login?next=%2Fcounselor" class="footer-link">Counselor Suite</a></li>
            <li><a href="/login?next=%2Fadmin" class="footer-link">Admin Console</a></li>
            <li><a href="/login?next=%2Fstudio" class="footer-link">Item Studio</a></li>
          </ul>
        </div>

        <!-- Col 3: Science & Methodology -->
        <div class="space-y-3 font-sans">
          <h4 class="text-xs font-semibold text-ink uppercase tracking-wider">Science</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/platform" class="footer-link">Deterministic IRT</a></li>
            <li><a href="/platform" class="footer-link">Adaptive CAT Bounds</a></li>
            <li><a href="/platform" class="footer-link">Evidence Provenance</a></li>
            <li><a href="/about" class="footer-link">Pedagogical Safety</a></li>
            <li><a href="/about" class="footer-link">Quiet Mentorship</a></li>
          </ul>
        </div>

        <!-- Col 4: Solutions & Governance -->
        <div class="space-y-3 font-sans">
          <h4 class="text-xs font-semibold text-ink uppercase tracking-wider">Governance</h4>
          <ul class="space-y-2 text-xs">
            <li><a href="/schools" class="footer-link">For Schools</a></li>
            <li><a href="/families" class="footer-link">For Families</a></li>
            <li><a href="/pricing" class="footer-link">Pricing & Plans</a></li>
            <li><a href="/consent" class="footer-link">Consent Ledger</a></li>
            <li><a href="/consent" class="footer-link">DPDP Compliance</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar (Copyright & Quiet Editorial System) -->
      <div class="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted font-sans">
        <div>
          © 2026 CREED OS Inc. All rights reserved. Deterministic Scoring. Sealed Provenance.
        </div>
        <div class="flex items-center gap-5">
          <a href="/login" class="footer-link text-ink hover:text-brand font-medium">Access Workspace</a>
          <a href="/help" class="footer-link">Help & Documentation</a>
          <a href="/consent" class="footer-link">Consent & Privacy</a>
          <a
            href="https://github.com/tomkee-lab/creed_os"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link inline-flex items-center gap-1"
          >
            <span>GitHub</span>
            <ExternalLink class="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</div>

<style>
  /* ================================================================
     MARKETING SHELL MICRO-ANIMATIONS
     Lagom Motion Contract: 140ms (micro) · 200ms (standard) · 280ms (emphasis)
     Easing: cubic-bezier(0.16, 1, 0.3, 1) — WAY "Lagom" spring curve
     ================================================================ */

  /* --- Logo Hover: Brand color shift + container glow --- */
  .logo-mark {
    transition:
      background-color var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      border-color var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      box-shadow var(--duration-emphasis, 280ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  :global(.group:hover) .logo-mark {
    background-color: var(--color-brand);
    border-color: var(--color-brand);
    color: var(--color-brand-foreground);
    box-shadow: 0 0 12px color-mix(in oklch, var(--color-brand) 30%, transparent);
  }

  .logo-text {
    transition: color var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  :global(.group:hover) .logo-text {
    color: var(--color-brand);
  }

  /* --- Floating Indicator Pill & Nav Island --- */
  .nav-island {
    box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.08);
  }

  .nav-indicator {
    transition:
      transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      width var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      opacity var(--duration-micro, 140ms) ease;
    will-change: transform, width, opacity;
  }

  .nav-link {
    color: var(--color-ink-secondary);
    transition:
      color var(--duration-micro, 140ms) ease,
      transform var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .nav-link:hover {
    color: var(--color-ink);
  }

  .nav-link:active {
    transform: scale(0.96);
  }

  .nav-link.is-active {
    color: var(--color-ink);
    font-weight: 600;
  }

  /* --- Theme Toggle: Celestial rotation (matching TopBar) --- */
  .theme-toggle {
    transition:
      color var(--duration-micro, 140ms) ease,
      background-color var(--duration-micro, 140ms) ease,
      border-color var(--duration-micro, 140ms) ease,
      transform var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .theme-toggle:active {
    transform: scale(0.90);
  }

  .celestial-icon {
    transition: transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .celestial-icon.is-dark {
    transform: rotate(0deg);
  }

  .celestial-icon:not(.is-dark) {
    transform: rotate(-45deg);
  }

  .theme-toggle:hover .celestial-icon.is-dark {
    transform: rotate(45deg);
  }

  .theme-toggle:hover .celestial-icon:not(.is-dark) {
    transform: rotate(-12deg);
  }


  /* --- Primary CTA Button ("Access Workspace"): Arrow glide + tactile spring + glow --- */
  .cta-button {
    transition:
      background-color var(--duration-micro, 140ms) ease,
      box-shadow var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      transform var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .cta-button:hover {
    background-color: var(--color-brand-hover);
    box-shadow: 0 0 16px color-mix(in oklch, var(--color-brand) 30%, transparent);
  }

  .cta-button:active {
    transform: scale(0.96);
  }

  .cta-button :global(.cta-arrow) {
    transition: transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .cta-button:hover :global(.cta-arrow) {
    transform: translateX(3px);
  }

  /* --- Mobile Toggle: Tactile press --- */
  .mobile-toggle {
    transition:
      color var(--duration-micro, 140ms) ease,
      background-color var(--duration-micro, 140ms) ease,
      border-color var(--duration-micro, 140ms) ease,
      transform var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .mobile-toggle:active {
    transform: scale(0.90);
  }

  /* --- Mobile Nav Drawer --- */
  .mobile-nav {
    animation: slideDown var(--duration-emphasis, 280ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .mobile-nav-link {
    transition:
      color var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      background-color var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      transform var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .mobile-nav-link:hover {
    color: var(--color-ink);
    background-color: var(--color-surface-subtle);
  }

  .mobile-nav-link:active {
    transform: scale(0.98);
  }

  .mobile-nav-link.is-active {
    color: var(--color-brand);
    background-color: color-mix(in oklch, var(--color-brand) 8%, transparent);
  }

  .mobile-cta-link {
    transition:
      background-color var(--duration-micro, 140ms) ease,
      box-shadow var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      transform var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .mobile-cta-link:hover {
    background-color: var(--color-brand-hover);
    box-shadow: 0 0 16px color-mix(in oklch, var(--color-brand) 30%, transparent);
  }

  .mobile-cta-link:active {
    transform: scale(0.97);
  }

  /* --- Footer Links: Subtle underline slide --- */
  .footer-link {
    position: relative;
    transition: color var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .footer-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    right: 50%;
    height: 1px;
    background-color: var(--color-ink-muted);
    transition:
      left var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      right var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .footer-link:hover {
    color: var(--color-ink);
  }

  .footer-link:hover::after {
    left: 0;
    right: 0;
  }

  /* --- Footer Logo: Subtle brand glow on group hover --- */
  :global(footer .group:hover) .logo-mark {
    box-shadow: 0 0 8px color-mix(in oklch, var(--color-brand) 20%, transparent);
  }

  /* --- Marketing Header: Apple Safari & compositor optimization --- */
  .marketing-header {
    will-change: background-color, border-color, backdrop-filter;
  }

  /* ================================================================
     REDUCED MOTION — Respect system preference
     ================================================================ */
  @media (prefers-reduced-motion: reduce) {
    .marketing-header,
    .nav-indicator,
    .nav-link,
    .footer-link::after,
    .logo-mark,
    .logo-text,
    .celestial-icon,
    .cta-button,
    .cta-button :global(.cta-arrow),
    .theme-toggle,
    .mobile-toggle,
    .mobile-nav-link,
    .mobile-cta-link {
      transition: none !important;
      animation: none !important;
      transform: none !important;
    }
  }
</style>
