<script lang="ts">
  import BaseWorkbenchShell from '@core-os/ui/components/workbench/WorkbenchShell.svelte';

  interface Props {
    title: string;
    stage?: 1 | 2 | 3;
    stageLabels?: [string, string, string];
    onStageChange?: (stage: 1 | 2 | 3) => void;
    dockCollapsed?: boolean;
    kpis?: Array<{ label: string; value: string | number; unit?: string }>;
    socraticOpen?: boolean;
    theoryOpen?: boolean;
    headerActions?: import('svelte').Snippet;
    controls?: import('svelte').Snippet;
    canvas?: import('svelte').Snippet;
    hudActions?: import('svelte').Snippet;
    socraticContent?: import('svelte').Snippet;
    theoryContent?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    stage = $bindable(1),
    stageLabels,
    onStageChange,
    dockCollapsed = $bindable(false),
    kpis = [],
    socraticOpen = $bindable(false),
    theoryOpen = $bindable(false),
    headerActions,
    controls,
    canvas,
    hudActions,
    socraticContent,
    theoryContent,
    children
  }: Props = $props();
</script>

<BaseWorkbenchShell
  {title}
  bind:stage
  {stageLabels}
  {onStageChange}
  bind:dockCollapsed
  {kpis}
  bind:socraticOpen
  bind:theoryOpen
  {headerActions}
  {controls}
  {canvas}
  {hudActions}
  {socraticContent}
  {theoryContent}
  {children}
/>
