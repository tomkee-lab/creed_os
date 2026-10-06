<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EvidenceDisclosure from '../EvidenceDisclosure.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Patterns/EvidenceDisclosure',
    component: EvidenceDisclosure,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Level 3 Progressive Disclosure component. Hides detailed audit records, timestamps, and psychometric provenance behind an intentional interaction to eliminate card soup.'
        }
      }
    }
  });
</script>

<Story
  name="Default"
  args={{
    title: 'Kinematics & Rate Laws Competency Record',
    evidenceStrength: 'Strong Foundation',
    records: [
      {
        id: 'EV-8902',
        sourceType: 'Adaptive CAT Assessment',
        sourceTitle: 'Linear Acceleration Multi-Step Problem',
        observedAt: 'Oct 04, 2026 • 10:14 AM',
        summary: 'Answered correctly on first attempt without hint scaffolding. Response time: 42s.'
      },
      {
        id: 'EV-8903',
        sourceType: 'Facilitator Rubric Observation',
        sourceTitle: 'Laboratory Experiment: Friction Cart Track',
        observedAt: 'Oct 02, 2026 • 02:30 PM',
        summary: 'Demonstrated precise error analysis in data table and synthesized velocity-time curve.'
      },
      {
        id: 'EV-8904',
        sourceType: 'Hands-on Project',
        sourceTitle: 'Autonomous Buggy Braking Distance Calculation',
        observedAt: 'Sep 28, 2026 • 11:45 AM',
        summary: 'Code accurately computed stopping distances across 4 varying surface friction coefficients.'
      }
    ]
  }}
/>

<Story
  name="SingleRecord"
  args={{
    title: 'Peer Collaboration Metric',
    evidenceStrength: 'Developing Foundation',
    records: [
      {
        id: 'EV-7719',
        sourceType: 'Facilitator Observation',
        sourceTitle: 'Pair Programming in Robotics Studio',
        observedAt: 'Oct 05, 2026 • 11:20 AM',
        summary: 'Actively navigated code reviews and explained sensor logic clearly to project partner.'
      }
    ]
  }}
/>
