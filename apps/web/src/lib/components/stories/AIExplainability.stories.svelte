<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AIExplainability from '../AIExplainability.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Governance/AIExplainability',
    component: AIExplainability,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Calibrated Iris marker with zero glowing neon effects. Expands into a modal disclosure with explicit reasoning, verifiable evidence sources, and child safety guardrails.'
        }
      }
    }
  });
</script>

<Story
  name="Default"
  args={{
    label: 'AI Socratic Mentor',
    reasoning:
      'Scaffolded guiding questions deployed based on observed hesitation in multi-step dimensional analysis.',
    evidenceSources: [
      'Diagnostic item #24 (Kinematics) latency: 84s',
      'Recent robotics lab problem decomposition logs',
      'Grade 8 curriculum benchmark standards'
    ],
    limitations:
      'Purely formative Socratic dialogue; scores derive solely from verified assessment items, never unconstrained LLM outputs.'
  }}
/>

<Story
  name="PathwayRecommendation"
  args={{
    label: 'Pathway Match Logic',
    reasoning:
      'Identified strong alignment with Autonomous Systems Engineering based on demonstrated spatial reasoning and algorithm design competencies.',
    evidenceSources: [
      'Robotics Maker Studio Project Grade: Mastery',
      'Spatial Reasoning CAT Assessment (θ: +1.42)',
      'Verified interest survey response from student'
    ],
    limitations:
      'Exploratory pathway orientation only. Does not restrict student from selecting alternate academic tracks.'
  }}
/>
