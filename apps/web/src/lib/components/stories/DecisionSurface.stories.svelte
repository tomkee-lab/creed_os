<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DecisionSurface from '../DecisionSurface.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Patterns/DecisionSurface',
    component: DecisionSurface,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'WAY 2.1 primary decision architecture. Complies with the Three Information Levels Law: Level 1 Signal & Header, Level 2 Context & Primary Next Action, Level 3 Evidence & Provenance Disclosure.'
        }
      }
    }
  });
</script>

<Story
  name="PrimaryAction"
  args={{
    signal: "Today's Mission",
    signalVariant: 'primary',
    title: 'Kinematics & Rate Laws Mastery Sprint',
    context: 'Complete today’s 20-minute adaptive practice session to unlock advanced trajectory simulations.',
    actionLabel: 'Begin Session (20 mins)',
    evidenceBadge: 'Verified Demonstration',
    disclosureTitle: 'Psychometric Calibration Rationale',
    disclosureBody:
      'Diagnostic telemetry identified high spatial reasoning with emerging capability in rate integration. Scaffolded practice accelerates concept consolidation.'
  }}
/>

<Story
  name="GrowthFocus"
  args={{
    signal: 'Demonstrated Mastery',
    signalVariant: 'growth',
    title: 'Algorithmic Problem Decomposition Certified',
    context: 'All 6 foundational sub-skills demonstrated with consistent application across 3 independent labs.',
    actionLabel: 'View Pathway Options',
    evidenceBadge: 'Verified Project Evidence',
    disclosureTitle: 'Assessment Provenance',
    disclosureBody:
      'Evaluated through hands-on robotics workspace submission and verified by classroom facilitator rubric on Oct 4.'
  }}
/>

<Story
  name="AlertIntervention"
  args={{
    signal: 'Attention Required',
    signalVariant: 'alert',
    title: 'Spatial Representation Gap Identified',
    context: 'Student hesitated on 3 consecutive 3D projection questions during yesterday’s diagnostic.',
    actionLabel: 'Review Targeted Remediation',
    evidenceBadge: 'Adaptive Assessment Log',
    disclosureTitle: 'Diagnostic Parameters',
    disclosureBody:
      'IRT item response pattern indicated rapid response times with low accuracy on rotation transforms, suggesting guessed answers rather than deliberate calculation.'
  }}
/>

<Story
  name="NeutralReference"
  args={{
    signal: 'Administrative Update',
    signalVariant: 'neutral',
    title: 'Term 1 Milestone Portfolio Ready for Review',
    context: 'All competency badges and facilitator reflections have been compiled for family dialogue.',
    actionLabel: 'Open Family Dialogue Card',
    evidenceBadge: 'Portfolio Snapshot'
  }}
/>
