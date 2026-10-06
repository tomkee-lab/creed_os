<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Badge from '../Badge.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Controls/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['growth', 'focus', 'alert', 'neutral', 'primary', 'indigo', 'teal', 'success'],
        description: 'Semantic token badge variant'
      },
      size: {
        control: 'select',
        options: ['sm', 'md'],
        description: 'Badge sizing scale'
      }
    }
  });
</script>

<Story name="Growth" args={{ variant: 'growth', size: 'sm' }}>
  {#snippet template(args)}
    <Badge {...args}>Demonstrated Competency</Badge>
  {/snippet}
</Story>

<Story name="Focus" args={{ variant: 'focus', size: 'sm' }}>
  {#snippet template(args)}
    <Badge {...args}>Growth Focus Area</Badge>
  {/snippet}
</Story>

<Story name="Alert" args={{ variant: 'alert', size: 'sm' }}>
  {#snippet template(args)}
    <Badge {...args}>Requires Attention</Badge>
  {/snippet}
</Story>

<Story name="Primary" args={{ variant: 'primary', size: 'sm' }}>
  {#snippet template(args)}
    <Badge {...args}>Core Mission</Badge>
  {/snippet}
</Story>

<Story name="Neutral" args={{ variant: 'neutral', size: 'sm' }}>
  {#snippet template(args)}
    <Badge {...args}>Classroom Observation</Badge>
  {/snippet}
</Story>

<Story name="Indigo" args={{ variant: 'indigo', size: 'sm' }}>
  {#snippet template(args)}
    <Badge {...args}>AI Mentor Verified</Badge>
  {/snippet}
</Story>
