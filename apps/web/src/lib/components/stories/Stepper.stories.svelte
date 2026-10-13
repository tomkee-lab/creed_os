<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Stepper from '../Stepper.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Technical Primitives/Stepper',
    component: Stepper,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Strict 0px sharp technical stepper for multi-step diagnostic assessments, evidence calibration sequences, and learner mission onboarding.'
        }
      }
    },
    argTypes: {
      current: {
        control: { type: 'number', min: 1, max: 4 },
        description: 'Active 1-based step index'
      },
      completed: {
        control: 'boolean',
        description: 'Whether all steps are marked completed'
      },
      clickable: {
        control: 'boolean',
        description: 'Allow direct navigation to past or future steps'
      }
    }
  });

  const sampleSteps = [
    { id: 'baseline', label: 'Baseline Diagnostic', description: 'Item calibration' },
    { id: 'socratic', label: 'Socratic Inquiry', description: 'Formative interaction' },
    { id: 'artifact', label: 'Artifact Verification', description: 'Rubric scoring' },
    { id: 'attestation', label: 'Guardian Attestation', description: 'DPDP consent review' }
  ];
</script>

<Story
  name="InProgress"
  args={{
    steps: sampleSteps,
    current: 2,
    completed: false,
    clickable: true
  }}
/>

<Story
  name="InitialStep"
  args={{
    steps: sampleSteps,
    current: 1,
    completed: false,
    clickable: true
  }}
/>

<Story
  name="AllCompleted"
  args={{
    steps: sampleSteps,
    current: 4,
    completed: true,
    clickable: false
  }}
/>
