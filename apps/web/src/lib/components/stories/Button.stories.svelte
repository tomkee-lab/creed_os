<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from '../Button.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Controls/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
        description: 'WAY 2.1 calibrated visual weight token'
      },
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg'],
        description: 'Control density scale (sm: 32px, md: 40px, lg: 48px)'
      },
      disabled: { control: 'boolean' },
      loading: { control: 'boolean' }
    }
  });
</script>

<Story name="Primary" args={{ variant: 'primary', size: 'md' }}>
  {#snippet template(args)}
    <Button {...args}>Explore Pathway &rarr;</Button>
  {/snippet}
</Story>

<Story name="Secondary" args={{ variant: 'secondary', size: 'md' }}>
  {#snippet template(args)}
    <Button {...args}>Secondary Action</Button>
  {/snippet}
</Story>

<Story name="Outline" args={{ variant: 'outline', size: 'md' }}>
  {#snippet template(args)}
    <Button {...args}>Outline Action</Button>
  {/snippet}
</Story>

<Story name="Ghost" args={{ variant: 'ghost', size: 'md' }}>
  {#snippet template(args)}
    <Button {...args}>Ghost Action</Button>
  {/snippet}
</Story>

<Story name="Danger" args={{ variant: 'danger', size: 'md' }}>
  {#snippet template(args)}
    <Button {...args}>Destructive Action</Button>
  {/snippet}
</Story>

<Story name="Loading" args={{ variant: 'primary', size: 'md', loading: true }}>
  {#snippet template(args)}
    <Button {...args}>Processing Request</Button>
  {/snippet}
</Story>

<Story name="Disabled" args={{ variant: 'primary', size: 'md', disabled: true }}>
  {#snippet template(args)}
    <Button {...args}>Disabled State</Button>
  {/snippet}
</Story>
