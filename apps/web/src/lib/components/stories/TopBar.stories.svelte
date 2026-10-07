<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TopBar from '../shell/TopBar.svelte';

  const { Story } = defineMeta({
    title: 'WAY 3.0 Shell/TopBar',
    component: TopBar,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Calm Editorial TopBar featuring contextual breadcrumbs, global ⌘K search trigger, theme switcher, notifications, and authenticated persona switcher.'
        }
      },
      layout: 'fullscreen'
    },
    argTypes: {
      activeRole: {
        control: 'select',
        options: ['student', 'parent', 'teacher', 'counselor', 'admin', 'studio']
      },
      isDarkMode: { control: 'boolean' }
    }
  });
</script>

<Story name="Student" args={{ activeRole: 'student', isDarkMode: false }}>
  {#snippet template(args)}
    <div class="w-full bg-canvas">
      <TopBar {...args} />
      <div class="p-8 text-ink text-sm">
        <p class="text-ink-secondary text-xs">TopBar rendered in student context with Anaya Verma profile avatar.</p>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="Teacher" args={{ activeRole: 'teacher', isDarkMode: false }}>
  {#snippet template(args)}
    <div class="w-full bg-canvas">
      <TopBar {...args} />
      <div class="p-8 text-ink text-sm">
        <p class="text-ink-secondary text-xs">TopBar rendered in teacher context with Rajesh K. profile avatar.</p>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="Counselor" args={{ activeRole: 'counselor', isDarkMode: false }}>
  {#snippet template(args)}
    <div class="w-full bg-canvas">
      <TopBar {...args} />
      <div class="p-8 text-ink text-sm">
        <p class="text-ink-secondary text-xs">TopBar rendered in counselor context with Dr. Sunita Rao profile avatar.</p>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="Admin" args={{ activeRole: 'admin', isDarkMode: false }}>
  {#snippet template(args)}
    <div class="w-full bg-canvas">
      <TopBar {...args} />
      <div class="p-8 text-ink text-sm">
        <p class="text-ink-secondary text-xs">TopBar rendered in admin context with DPIS Administrator profile avatar.</p>
      </div>
    </div>
  {/snippet}
</Story>
