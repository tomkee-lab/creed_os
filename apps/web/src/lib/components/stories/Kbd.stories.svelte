<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Kbd from '../Kbd.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Technical Primitives/Kbd',
    component: Kbd,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Engineered monospace keyboard shortcut badge with strict 0px structural radius and subtle border contrast.'
        }
      }
    }
  });
</script>

<Story name="CommandKey">
  {#snippet template()}
    <div class="flex items-center gap-2 text-xs text-foreground">
      <span>Command Palette</span>
      <Kbd>⌘K</Kbd>
    </div>
  {/snippet}
</Story>

<Story name="KeyCombo">
  {#snippet template()}
    <div class="flex items-center gap-1.5 text-xs text-foreground">
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>Shift</Kbd>
      <span>+</span>
      <Kbd>P</Kbd>
    </div>
  {/snippet}
</Story>

<Story name="EscapeKey">
  {#snippet template()}
    <div class="flex items-center gap-2 text-xs text-foreground">
      <span>Dismiss Modal</span>
      <Kbd>ESC</Kbd>
    </div>
  {/snippet}
</Story>
