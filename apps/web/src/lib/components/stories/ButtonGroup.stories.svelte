<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ButtonGroup from '../ButtonGroup.svelte';
  import Button from '../Button.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Controls/ButtonGroup',
    component: ButtonGroup,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Unified control group uniting multiple buttons into a continuous sharp 0px segment with overlapping hairline borders.'
        }
      }
    }
  });
</script>

<Story name="SegmentedFilter">
  {#snippet template()}
    <ButtonGroup>
      <Button variant="outline" size="sm">Day</Button>
      <Button variant="outline" size="sm">Week</Button>
      <Button variant="primary" size="sm">Month</Button>
      <Button variant="outline" size="sm">Term</Button>
    </ButtonGroup>
  {/snippet}
</Story>

<Story name="PaginationControls">
  {#snippet template()}
    <ButtonGroup>
      <Button variant="outline" size="sm">&larr; Previous Item</Button>
      <Button variant="outline" size="sm">Item 4 of 12</Button>
      <Button variant="outline" size="sm">Next Item &rarr;</Button>
    </ButtonGroup>
  {/snippet}
</Story>
