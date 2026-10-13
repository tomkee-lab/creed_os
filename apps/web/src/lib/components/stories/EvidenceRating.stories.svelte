<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EvidenceRating from '../EvidenceRating.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Technical Primitives/EvidenceRating',
    component: EvidenceRating,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Segmented angular rating indicator (strict 0px sharp blocks). Conveys rubric depth, rubric calibration, or triangulation strength without rounded pill stars.'
        }
      }
    },
    argTypes: {
      rating: {
        control: { type: 'number', min: 0, max: 5 },
        description: 'Demonstrated evidence rating level'
      },
      max: {
        control: { type: 'number', min: 1, max: 10 },
        description: 'Maximum available rating tiers'
      },
      label: {
        control: 'text',
        description: 'Descriptive rubric tier qualifier'
      }
    }
  });
</script>

<Story
  name="HighConfidence"
  args={{
    rating: 4,
    max: 5,
    label: 'Triangulated Evidence'
  }}
/>

<Story
  name="FullMastery"
  args={{
    rating: 5,
    max: 5,
    label: 'Exemplary Demonstration'
  }}
/>

<Story
  name="EmergingEvidence"
  args={{
    rating: 2,
    max: 5,
    label: 'Formative Observation'
  }}
/>

<Story
  name="SevenTierRubric"
  args={{
    rating: 6,
    max: 7,
    label: 'Advanced Research Tier'
  }}
/>
