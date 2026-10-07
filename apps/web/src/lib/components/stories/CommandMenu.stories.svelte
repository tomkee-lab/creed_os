<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CommandMenu from '../shell/CommandMenu.svelte';

  const { Story } = defineMeta({
    title: 'WAY 3.0 Shell/CommandMenu',
    component: CommandMenu,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Global ⌘K Command Palette. Allows instant jumping to learners, pathways, missions, and diagnostic tools with keyboard shortcuts.'
        }
      },
      layout: 'centered'
    },
    argTypes: {
      open: { control: 'boolean' }
    }
  });
</script>

<Story name="Open" args={{ open: true }}>
  {#snippet template(args)}
    <div class="h-120 w-160 relative">
      <CommandMenu {...args} />
    </div>
  {/snippet}
</Story>
