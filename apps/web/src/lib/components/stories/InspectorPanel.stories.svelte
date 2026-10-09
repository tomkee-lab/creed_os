<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import InspectorPanel from '../shell/InspectorPanel.svelte';

  const { Story } = defineMeta({
    title: 'WAY 3.0 Shell/InspectorPanel',
    component: InspectorPanel,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Slide-over Details Inspector Drawer for deep diagnostic evidence, psychometric item metadata, and provenance disclosure without breaking page flow.'
        }
      },
      layout: 'fullscreen'
    },
    argTypes: {
      open: { control: 'boolean' },
      title: { control: 'text' },
      category: { control: 'text' },
      subtitle: { control: 'text' }
    }
  });
</script>

<Story
  name="EvidenceInspector"
  args={{
    open: true,
    title: 'Kinematic Topology Verification',
    category: 'Assessment Evidence',
    subtitle: 'Diagnostic Item #204 · Robotics & Spatial Systems'
  }}
>
  {#snippet template(args)}
    <div class="h-screen w-full bg-canvas relative">
      <div class="p-8">
        <h1 class="text-lg font-bold text-ink">Background Workspace View</h1>
        <p class="text-xs text-ink-secondary mt-1">The inspector panel slides over from the right on demand.</p>
      </div>

      <InspectorPanel {...args}>
        <div class="space-y-4 text-xs text-ink">
          <div class="p-3 bg-surface-subtle border border-border rounded-none">
            <span class="text-[10px] uppercase font-mono text-ink-muted">Evidence Provenance</span>
            <p class="font-medium mt-1">Completed via interactive kinematic simulation build at 14:32 IST.</p>
          </div>

          <div class="space-y-2">
            <span class="text-xs font-semibold text-ink">Demonstrated Capabilities:</span>
            <ul class="space-y-1 text-ink-secondary list-disc pl-4">
              <li>Assembled 3-axis linkage with correct kinematic constraint</li>
              <li>Identified degree-of-freedom redundancy in closed loop</li>
              <li>Calculated mechanical advantage under varying payload</li>
            </ul>
          </div>
        </div>
      </InspectorPanel>
    </div>
  {/snippet}
</Story>
