<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DropdownCheckbox from '../DropdownCheckbox.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Controls/DropdownCheckbox',
    component: DropdownCheckbox,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Multi-select checkbox popover with zero-radius sharp frame, custom check indicators, and clear selection counter.'
        }
      }
    }
  });

  const sampleCompetencies = [
    { id: 'dim_spatial', label: 'Spatial Reasoning', description: '3D rotation & projection', checked: true },
    { id: 'dim_computational', label: 'Computational Logic', description: 'Decomposition & algorithms', checked: true },
    { id: 'dim_quantitative', label: 'Quantitative Fluency', description: 'Numerical calibration', checked: false },
    { id: 'dim_scientific', label: 'Scientific Inquiry', description: 'Hypothesis testing', checked: false }
  ];
</script>

<Story
  name="CompetencyFilter"
  args={{
    title: 'Filter Competencies',
    items: sampleCompetencies
  }}
/>

<Story
  name="EmptySelection"
  args={{
    title: 'Select Assessment Domains',
    items: sampleCompetencies.map(c => ({ ...c, checked: false }))
  }}
/>
