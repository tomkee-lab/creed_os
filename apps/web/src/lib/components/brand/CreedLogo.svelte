<script lang="ts">
  let {
    size = 28,
    class: className = '',
    animated = true
  }: {
    size?: number;
    class?: string;
    animated?: boolean;
  } = $props();
</script>

<!--
  CREED OS Sigil — Mandalorian-inspired logomark with Lagom Micro-Interactions
  A geometric T-visor helmet silhouette with neural intelligence growth pathways.
  Respects WAY 2.1 motion budget (140ms–280ms) and prefers-reduced-motion.
-->
<svg
  width={size}
  height={size}
  viewBox="0 0 64 64"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  class="creed-logo {animated ? 'is-animated' : ''} {className}"
  aria-label="CREED OS"
  role="img"
>
  <!-- Helmet Outer Chassis & Arch Dome -->
  <path
    class="helmet-chassis"
    d="M14 27C14 16.5 22 8 32 8C42 8 50 16.5 50 27V42L40 56H37L46 41V27C46 18.5 39.5 12 32 12C24.5 12 18 18.5 18 27V41L27 56H24L14 42V27Z"
    fill="currentColor"
    opacity="0.95"
  />

  <!-- Iconic Mandalorian T-Visor -->
  <path
    class="t-visor"
    d="M17 26.5H47V30.5H35V45L32 47.5L29 45V30.5H17V26.5Z"
    fill="currentColor"
  />

  <!-- Upper Neural Growth Trunk -->
  <line
    class="neural-trunk"
    x1="32"
    y1="26.5"
    x2="32"
    y2="14"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
  />
  <circle class="neural-node neural-node-center" cx="32" cy="13" r="2.5" fill="currentColor"/>

  <!-- Left Neural Circuit Branch -->
  <path
    class="neural-branch-left"
    d="M32 21H25V17"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <circle class="neural-node neural-node-left" cx="25" cy="16" r="2" fill="currentColor"/>

  <!-- Right Neural Circuit Branch -->
  <path
    class="neural-branch-right"
    d="M32 21H39V17"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
  <circle class="neural-node neural-node-right" cx="39" cy="16" r="2" fill="currentColor"/>

  <!-- Outer Dome Accent Curves -->
  <path
    class="neural-accent"
    d="M22 25V22C22 19.5 24 17.5 26.5 17.5"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
  />
  <path
    class="neural-accent"
    d="M42 25V22C42 19.5 40 17.5 37.5 17.5"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
  />

  <!-- Lower Cheek Tactical Slots (Beskar Chiseled Facets) -->
  <path class="tactical-slot" d="M20 33L26 44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path class="tactical-slot" d="M44 33L38 44" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path class="tactical-slot" d="M23 46L26.5 52" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path class="tactical-slot" d="M41 46L37.5 52" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>

<style>
  .creed-logo {
    display: inline-block;
    transition: transform var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .t-visor {
    transition: opacity var(--duration-standard, 200ms) ease,
                filter var(--duration-standard, 200ms) ease;
  }

  .neural-trunk,
  .neural-branch-left,
  .neural-branch-right,
  .neural-accent {
    transition: stroke var(--duration-standard, 200ms) ease,
                stroke-width var(--duration-standard, 200ms) ease;
  }

  .neural-node {
    transform-origin: center;
    transition: transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  /* Micro-interactions when parent group is hovered or active */
  :global(.group:hover) .creed-logo.is-animated .t-visor,
  .creed-logo.is-animated:hover .t-visor {
    filter: drop-shadow(0 0 4px color-mix(in oklch, currentColor 45%, transparent));
  }

  :global(.group:hover) .creed-logo.is-animated .neural-node,
  .creed-logo.is-animated:hover .neural-node {
    transform: scale(1.2);
  }

  :global(.group:hover) .creed-logo.is-animated .neural-trunk,
  .creed-logo.is-animated:hover .neural-trunk {
    stroke-width: 2.8;
  }

  :global(.group:hover) .creed-logo.is-animated .tactical-slot,
  .creed-logo.is-animated:hover .tactical-slot {
    opacity: 1;
    stroke-width: 2.2;
  }

  /* Strict Reduced Motion Law */
  @media (prefers-reduced-motion: reduce) {
    .creed-logo,
    .t-visor,
    .neural-trunk,
    .neural-node {
      transition: none !important;
      animation: none !important;
      filter: none !important;
      transform: none !important;
    }
  }
</style>
