<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import SocraticVoiceMentor from '$lib/components/mentor/SocraticVoiceMentor.svelte';
</script>

<svelte:head>
  <title>Socratic Mentor Studio — CREED OS</title>
</svelte:head>

<div class="max-w-4xl mx-auto py-6 px-4 space-y-6">
  <!-- Orient: Topic & Minimal Navigation -->
  <header class="flex items-center justify-between pb-4 border-b border-border">
    <a
      href="/student"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-secondary hover:text-foreground transition-colors"
    >
      <ArrowLeft class="size-3.5" />
      <span>Back to Today's Missions</span>
    </a>

    <div class="text-right">
      <h1 class="text-lg font-bold tracking-tight text-foreground">
        Socratic Mentor Studio
      </h1>
      <p class="text-xs text-foreground-secondary">
        Kinematics & Gear Ratio Balancing • Real-time Socratic Dialogue
      </p>
    </div>
  </header>

  <!-- Interactive Socratic Voice Mentor with Affective Telemetry & Maker Break Suggestions -->
  <SocraticVoiceMentor initialTopic="Kinematics & Gear Ratio Balancing" />
</div>
