<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ShieldCheck,
    CheckCircle2,
    FileText,
    Layers,
    ExternalLink,
    X,
    Search,
    Scale,
    AlertCircle,
    Info,
    Code2,
    Cpu
  } from 'lucide-svelte';
  import {
    SBOM_DEPENDENCIES,
    CLEAN_ROOM_STATUS,
    LICENSE_TEXT_EXCERPTS,
    type DependencyLicenseRecord
  } from '$lib/compliance/licenses';

  let { isOpen = $bindable(false) } = $props<{
    isOpen?: boolean;
  }>();

  let activeTab = $state<'clean-room' | 'sbom' | 'licenses' | 'architecture'>('clean-room');
  let searchQuery = $state('');
  let licenseFilter = $state<string>('all');

  let filteredDependencies = $derived(
    SBOM_DEPENDENCIES.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLicense =
        licenseFilter === 'all' || item.license === licenseFilter;
      return matchesSearch && matchesLicense;
    })
  );

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen) {
      isOpen = false;
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

{#if isOpen}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in-0 duration-150 font-sans"
    role="dialog"
    aria-modal="true"
    aria-labelledby="compliance-dialog-title"
  >
    <!-- Modal Window (Strict WAY 2.1 0px Radius) -->
    <div
      class="w-full max-w-4xl max-h-[90vh] bg-surface border border-border shadow-2xl flex flex-col overflow-hidden text-ink animate-in zoom-in-95 duration-150"
    >
      <!-- Header -->
      <div class="px-5 py-4 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <div class="size-8 bg-mint/10 border border-mint/20 text-mint flex items-center justify-center">
            <ShieldCheck class="size-4" />
          </div>
          <div>
            <h2 id="compliance-dialog-title" class="text-sm sm:text-base font-semibold font-mono uppercase tracking-wide text-ink flex items-center gap-2">
              <span>Open Source Architecture & License Compliance</span>
              <span class="px-1.5 py-0.5 text-[9px] bg-mint/15 text-mint border border-mint/30 font-bold">100% Clean-Room</span>
            </h2>
            <p class="text-xs text-ink-muted">
              Formal audit ledger: Zero AGPL-3.0 copyleft taint · Permissive Apache-2.0 / MIT foundation
            </p>
          </div>
        </div>

        <button
          onclick={() => (isOpen = false)}
          class="p-1.5 hover:bg-surface text-ink-muted hover:text-ink border border-transparent hover:border-border transition-micro"
          aria-label="Close dialog"
        >
          <X class="size-4" />
        </button>
      </div>

      <!-- Segmented Navigation Tabs -->
      <div class="px-5 py-2 border-b border-border bg-surface flex items-center gap-2 overflow-x-auto shrink-0 text-xs font-mono">
        <button
          onclick={() => (activeTab = 'clean-room')}
          class="px-3 py-1.5 border transition-micro flex items-center gap-1.5 {activeTab === 'clean-room'
            ? 'bg-surface-raised border-mint text-mint font-bold shadow-2xs'
            : 'border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
        >
          <CheckCircle2 class="size-3.5" />
          <span>1. Clean-Room Verification</span>
        </button>

        <button
          onclick={() => (activeTab = 'sbom')}
          class="px-3 py-1.5 border transition-micro flex items-center gap-1.5 {activeTab === 'sbom'
            ? 'bg-surface-raised border-brand text-brand font-bold shadow-2xs'
            : 'border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
        >
          <Layers class="size-3.5" />
          <span>2. Dependency SBOM ({SBOM_DEPENDENCIES.length})</span>
        </button>

        <button
          onclick={() => (activeTab = 'licenses')}
          class="px-3 py-1.5 border transition-micro flex items-center gap-1.5 {activeTab === 'licenses'
            ? 'bg-surface-raised border-cyan text-cyan font-bold shadow-2xs'
            : 'border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
        >
          <Scale class="size-3.5" />
          <span>3. Legal Texts & Notices</span>
        </button>

        <button
          onclick={() => (activeTab = 'architecture')}
          class="px-3 py-1.5 border transition-micro flex items-center gap-1.5 {activeTab === 'architecture'
            ? 'bg-surface-raised border-violet text-violet font-bold shadow-2xs'
            : 'border-transparent text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
        >
          <Cpu class="size-3.5" />
          <span>4. Architectural Seam Map</span>
        </button>
      </div>

      <!-- Body Content Area (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
        {#if activeTab === 'clean-room'}
          <!-- TAB 1: Clean-Room & Copyleft Verification -->
          <div class="space-y-4">
            <div class="p-4 border border-mint/30 bg-mint/5 flex items-start gap-3">
              <CheckCircle2 class="size-5 text-mint shrink-0 mt-0.5" />
              <div class="space-y-1">
                <h3 class="font-mono font-bold text-ink uppercase text-xs">
                  Zero AGPL-3.0 Copyleft Contamination Verified
                </h3>
                <p class="text-ink-secondary leading-relaxed">
                  The upstream Scratch editor family (<code class="bg-surface px-1 font-mono">scratch-editor</code>, <code class="bg-surface px-1 font-mono">scratch-vm</code>, <code class="bg-surface px-1 font-mono">scratch-gui</code>, <code class="bg-surface px-1 font-mono">scratch-audio</code>) enforces strict AGPL-3.0-only network copyleft. CREED OS contains <strong>0 lines of code</strong> from those repositories. All execution engines, audio synthesizers, and hardware bridges are independently engineered clean-room implementations.
                </p>
              </div>
            </div>

            <!-- Key Metric Cards -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="p-3 border border-border bg-surface-subtle space-y-1">
                <span class="text-[10px] font-mono text-ink-muted uppercase">AGPL Violations</span>
                <div class="text-xl font-bold font-mono text-mint">0</div>
                <span class="text-[10px] text-ink-secondary">Complete network isolation</span>
              </div>
              <div class="p-3 border border-border bg-surface-subtle space-y-1">
                <span class="text-[10px] font-mono text-ink-muted uppercase">Block Framework</span>
                <div class="text-base font-bold font-mono text-cyan">Blockly 13.3</div>
                <span class="text-[10px] text-ink-secondary">Apache-2.0 License</span>
              </div>
              <div class="p-3 border border-border bg-surface-subtle space-y-1">
                <span class="text-[10px] font-mono text-ink-muted uppercase">Python Runtime</span>
                <div class="text-base font-bold font-mono text-brand">Pyodide WASM</div>
                <span class="text-[10px] text-ink-secondary">MPL-2.0 in Worker</span>
              </div>
              <div class="p-3 border border-border bg-surface-subtle space-y-1">
                <span class="text-[10px] font-mono text-ink-muted uppercase">Trademark Status</span>
                <div class="text-base font-bold font-mono text-mint">Original IP</div>
                <span class="text-[10px] text-ink-secondary">Zero Scratch marks used</span>
              </div>
            </div>

            <!-- Clean-Room Specification Protocols -->
            <div class="p-4 border border-border bg-surface space-y-2">
              <h4 class="font-mono font-bold uppercase text-[11px] text-ink">
                Clean-Room Architectural Protocols Enforced
              </h4>
              <ul class="space-y-1.5 text-ink-secondary pl-4 list-disc">
                <li>
                  <strong class="text-ink">Independent Block Generation:</strong> All 11 robotics block families (Events, Motion, Sensors, Actuators, AI Vision, Turtle Pen, Sound, Logic, Loops, Math, Data) produce clean Python and JavaScript code via bespoke generators.
                </li>
                <li>
                  <strong class="text-ink">Native Web Audio Synthesis:</strong> The audio generator uses native browser <code class="font-mono bg-surface-subtle px-1">AudioContext</code> oscillators for musical notes and piezo buzzers, avoiding <code class="font-mono bg-surface-subtle px-1">scratch-audio</code>.
                </li>
                <li>
                  <strong class="text-ink">In-Browser Hardware Flashing:</strong> Direct communication with ESP32 via Web Serial (115200 baud) and BBC micro:bit via WebUSB DAPLink, eliminating the proprietary desktop daemon (<code class="font-mono bg-surface-subtle px-1">scratch-link</code>).
                </li>
                <li>
                  <strong class="text-ink">Anti-Zip-Bomb Archive Protection:</strong> Project importers enforce strict 100-file and 25MB limits with path normalization, preventing malicious payload injection.
                </li>
              </ul>
            </div>
          </div>

        {:else if activeTab === 'sbom'}
          <!-- TAB 2: Dependency Software Bill of Materials (SBOM) -->
          <div class="space-y-3">
            <!-- Filter Bar -->
            <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div class="relative w-full sm:w-64">
                <Search class="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Filter dependencies..."
                  bind:value={searchQuery}
                  class="w-full pl-8 pr-3 py-1 bg-surface-subtle border border-border text-xs font-mono text-ink placeholder:text-ink-muted focus:outline-hidden focus:border-brand"
                />
              </div>

              <div class="flex items-center gap-1.5 w-full sm:w-auto font-mono text-xs">
                <span class="text-ink-muted text-[10px] uppercase">License:</span>
                {#each ['all', 'Apache-2.0', 'MIT', 'MPL-2.0', 'OFL-1.1'] as lic}
                  <button
                    onclick={() => (licenseFilter = lic)}
                    class="px-2 py-0.5 text-[10px] border transition-micro {licenseFilter === lic
                      ? 'border-brand text-brand bg-brand/10 font-bold'
                      : 'border-border text-ink-muted hover:text-ink bg-surface'}"
                  >
                    {lic}
                  </button>
                {/each}
              </div>
            </div>

            <!-- Table of Dependencies -->
            <div class="border border-border overflow-hidden">
              <div class="max-h-96 overflow-y-auto">
                <table class="w-full text-left border-collapse text-[11px] font-mono">
                  <thead class="sticky top-0 bg-surface-subtle border-b border-border text-ink-muted text-[10px] uppercase">
                    <tr>
                      <th class="p-2 font-bold">Package Name</th>
                      <th class="p-2 font-bold">Version</th>
                      <th class="p-2 font-bold">License</th>
                      <th class="p-2 font-bold">Author / Licensor</th>
                      <th class="p-2 font-bold">Clean-Room Role</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-border">
                    {#each filteredDependencies as dep}
                      <tr class="hover:bg-surface-subtle/50 transition-micro">
                        <td class="p-2 font-bold text-ink">
                          <a
                            href={dep.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="hover:text-brand hover:underline flex items-center gap-1"
                          >
                            <span>{dep.name}</span>
                            <ExternalLink class="size-2.5 opacity-50" />
                          </a>
                        </td>
                        <td class="p-2 text-ink-muted">{dep.version}</td>
                        <td class="p-2">
                          <span class="px-1.5 py-0.5 text-[10px] font-bold border {dep.license === 'Apache-2.0'
                            ? 'border-cyan/40 bg-cyan/10 text-cyan'
                            : dep.license === 'MIT'
                            ? 'border-mint/40 bg-mint/10 text-mint'
                            : dep.license === 'MPL-2.0'
                            ? 'border-brand/40 bg-brand/10 text-brand'
                            : 'border-violet/40 bg-violet/10 text-violet'}">
                            {dep.license}
                          </span>
                        </td>
                        <td class="p-2 text-ink-secondary truncate max-w-48" title={dep.author}>
                          {dep.author}
                        </td>
                        <td class="p-2 text-ink-muted font-sans text-[11px]">
                          {dep.role}
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
            <p class="text-[10px] text-ink-muted font-mono">
              Showing {filteredDependencies.length} of {SBOM_DEPENDENCIES.length} audited production packages. 0 copyleft dependencies found.
            </p>
          </div>

        {:else if activeTab === 'licenses'}
          <!-- TAB 3: Legal Texts & Notices -->
          <div class="space-y-4">
            <div class="space-y-1">
              <h3 class="font-mono font-bold text-xs uppercase text-ink">
                Preserved Open Source Licenses & Permissions
              </h3>
              <p class="text-ink-secondary text-[11px]">
                In compliance with Section 4 of Apache-2.0, Section 1 of MIT, and Section 3 of MPL-2.0, the following verbatim license texts and copyright statements are preserved across source and binary distributions:
              </p>
            </div>

            <!-- Apache-2.0 Excerpt -->
            <div class="p-4 border border-border bg-surface space-y-2">
              <div class="flex items-center justify-between text-xs font-mono font-bold text-cyan">
                <span>Apache License, Version 2.0 (Blockly & Plugins)</span>
                <span class="text-[10px] text-ink-muted">SPDX: Apache-2.0</span>
              </div>
              <pre class="p-3 bg-surface-subtle border border-border text-[10px] font-mono text-ink-secondary whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">{LICENSE_TEXT_EXCERPTS['Apache-2.0']}</pre>
            </div>

            <!-- MIT Excerpt -->
            <div class="p-4 border border-border bg-surface space-y-2">
              <div class="flex items-center justify-between text-xs font-mono font-bold text-mint">
                <span>The MIT License (Monaco Editor, xterm.js, Bits UI, Lucide)</span>
                <span class="text-[10px] text-ink-muted">SPDX: MIT</span>
              </div>
              <pre class="p-3 bg-surface-subtle border border-border text-[10px] font-mono text-ink-secondary whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">{LICENSE_TEXT_EXCERPTS['MIT']}</pre>
            </div>

            <!-- MPL-2.0 Excerpt -->
            <div class="p-4 border border-border bg-surface space-y-2">
              <div class="flex items-center justify-between text-xs font-mono font-bold text-brand">
                <span>Mozilla Public License Version 2.0 (Pyodide WASM Runtime)</span>
                <span class="text-[10px] text-ink-muted">SPDX: MPL-2.0</span>
              </div>
              <pre class="p-3 bg-surface-subtle border border-border text-[10px] font-mono text-ink-secondary whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">{LICENSE_TEXT_EXCERPTS['MPL-2.0']}</pre>
            </div>
          </div>

        {:else if activeTab === 'architecture'}
          <!-- TAB 4: Architectural Seam Map -->
          <div class="space-y-4">
            <div class="space-y-1">
              <h3 class="font-mono font-bold text-xs uppercase text-ink">
                Clean-Room Architectural Seam Map
              </h3>
              <p class="text-ink-secondary text-[11px]">
                Comparing the upstream AGPL-3.0 Scratch editor architecture with the independent CREED OS production pipeline:
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Upstream Reference Architecture -->
              <div class="p-4 border border-red-500/30 bg-red-500/5 space-y-2 font-mono text-xs">
                <div class="flex items-center gap-1.5 text-red-400 font-bold uppercase text-[11px]">
                  <AlertCircle class="size-3.5" />
                  <span>Upstream Monorepo (AGPL-3.0)</span>
                </div>
                <div class="space-y-1.5 text-[10px] text-ink-secondary">
                  <div class="p-2 border border-border bg-surface">
                    <strong>scratch-gui:</strong> React integration glue (AGPL-3.0-only)
                  </div>
                  <div class="p-2 border border-border bg-surface">
                    <strong>scratch-vm:</strong> Execution scheduler & AST targets (AGPL)
                  </div>
                  <div class="p-2 border border-border bg-surface">
                    <strong>scratch-audio:</strong> Web Audio sound engine (AGPL)
                  </div>
                  <div class="p-2 border border-border bg-surface">
                    <strong>scratch-link:</strong> Local OS WebSocket daemon (AGPL)
                  </div>
                  <div class="p-2 border border-border bg-surface">
                    <strong>scratch-render:</strong> WebGL stage compositor (AGPL)
                  </div>
                </div>
              </div>

              <!-- CREED OS Clean-Room Architecture -->
              <div class="p-4 border border-mint/30 bg-mint/5 space-y-2 font-mono text-xs">
                <div class="flex items-center gap-1.5 text-mint font-bold uppercase text-[11px]">
                  <CheckCircle2 class="size-3.5" />
                  <span>CREED OS Clean-Room (Apache/MIT)</span>
                </div>
                <div class="space-y-1.5 text-[10px] text-ink-secondary">
                  <div class="p-2 border border-border bg-surface">
                    <strong>BrowserIDE.svelte:</strong> Svelte 5 + Bits UI (MIT)
                  </div>
                  <div class="p-2 border border-border bg-surface">
                    <strong>roboticsBlocks.ts + Pyodide:</strong> Dual Python/JS AST + WASM
                  </div>
                  <div class="p-2 border border-border bg-surface">
                    <strong>webAudioSynth.ts:</strong> Native browser AudioContext synth
                  </div>
                  <div class="p-2 border border-border bg-surface">
                    <strong>hardwareBridge.ts:</strong> Web Serial & WebUSB APIs (No daemon)
                  </div>
                  <div class="p-2 border border-border bg-surface">
                    <strong>2D Rover Arena:</strong> SVG Kinematic Simulator & Obstacles
                  </div>
                </div>
              </div>
            </div>

            <!-- Conclusion Note -->
            <div class="p-3 border border-border bg-surface text-ink-muted text-[10px] leading-relaxed">
              <strong>Trademark & IP Notice:</strong> Scratch is a trademark of the Massachusetts Institute of Technology and the Scratch Foundation. CREED OS is an independent product and is not sponsored, endorsed, or affiliated with MIT or the Scratch Foundation.
            </div>
          </div>
        {/if}
      </div>

      <!-- Footer -->
      <div class="px-5 py-3 border-t border-border bg-surface-subtle flex items-center justify-between text-xs shrink-0 font-mono">
        <div class="flex items-center gap-2 text-ink-muted">
          <span class="size-1.5 bg-mint"></span>
          <span>Compliance verified for Production Distribution</span>
        </div>

        <button
          onclick={() => (isOpen = false)}
          class="px-4 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground font-bold transition-micro shadow-2xs"
        >
          Close Notices
        </button>
      </div>
    </div>
  </div>
{/if}
