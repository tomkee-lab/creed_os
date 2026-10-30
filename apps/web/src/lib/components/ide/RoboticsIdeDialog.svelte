<script lang="ts">
  import { Dialog } from 'bits-ui';
  import BrowserIDE from './BrowserIDE.svelte';

  interface Props {
    open?: boolean;
    initialMission?: string;
    onClose?: () => void;
  }

  let {
    open = $bindable(false),
    initialMission = 'starter',
    onClose
  }: Props = $props();

  let ideStage = $state<'primary' | 'middle' | 'secondary'>('primary');

  function handleClose() {
    open = false;
    onClose?.();
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay
      class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs transition-opacity duration-200"
    />
    <Dialog.Content
      class="fixed inset-0 sm:inset-2 md:inset-4 z-50 bg-canvas border border-border rounded-sm shadow-2xl flex flex-col font-sans select-none overflow-hidden focus-visible:outline-none animate-in fade-in-0 zoom-in-99 duration-150"
    >
      <Dialog.Title class="sr-only">Robotics IDE & Studio Dialog</Dialog.Title>
      <Dialog.Description class="sr-only">
        Zero-install browser robotics IDE powered by Pyodide WebAssembly, MicroPython artifact export, and Blockly.
      </Dialog.Description>

      {#if open}
        <BrowserIDE
          bind:stage={ideStage}
          inDialog={true}
          isFullscreen={false}
          initialMissionId={initialMission}
          onClose={handleClose}
        />
      {/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
