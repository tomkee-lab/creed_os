<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import WorkspaceHeader from '../shell/WorkspaceHeader.svelte';

  const { Story } = defineMeta({
    title: 'WAY 3.0 Shell/WorkspaceHeader',
    component: WorkspaceHeader,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Canonical page header surface for WAY 3.0 workspaces adhering to Signal → Context → Action layout hierarchy.'
        }
      }
    },
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' }
    }
  });
</script>

<Story
  name="Default"
  args={{
    title: 'Adaptive Item Studio',
    description: 'Calibrate, simulate, and publish psychometric assessment items.'
  }}
>
  {#snippet template(args)}
    <div class="p-6 bg-canvas w-full">
      <WorkspaceHeader {...args} />
    </div>
  {/snippet}
</Story>
