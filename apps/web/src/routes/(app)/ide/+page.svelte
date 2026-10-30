<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import RoboticsIdeDialog from '$lib/components/ide/RoboticsIdeDialog.svelte';

  let ideOpen = $state(true);
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
  });

  function handleClose() {
    ideOpen = false;
    goto('/student/missions');
  }

  $effect(() => {
    if (mounted && !ideOpen) {
      goto('/student/missions');
    }
  });
</script>

<svelte:head>
  <title>Robotics IDE & Hardware Runtime · CREED OS</title>
  <meta
    name="description"
    content="Zero-install browser robotics IDE powered by Pyodide WebAssembly, MicroPython artifact export, and Blockly."
  />
</svelte:head>

<RoboticsIdeDialog bind:open={ideOpen} onClose={handleClose} />
