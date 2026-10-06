<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import WaySection from '../WaySection.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Patterns/WaySection',
    component: WaySection,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Canonical section boundary adhering to the Content Density Rule: 1 title, 1 short supporting sentence maximum, 1 primary action.'
        }
      }
    }
  });
</script>

<Story name="WithAction">
  <WaySection
    eyebrow="DEVELOPMENTAL HORIZON"
    title="Strengths & Foundational Demonstrations"
    subtitle="Observable competencies validated across classroom assessments and studio projects."
    actionLabel="View Detailed Competency Matrix"
    actionHref="/student/pathways"
  >
    <div class="p-6 surface-card rounded-sm border border-(--border-subtle) space-y-2">
      <p class="text-sm text-(--text-primary) font-medium">Demonstrated competence across 4 core domains.</p>
      <p class="text-xs text-(--text-secondary)">All observations verified by classroom facilitators.</p>
    </div>
  </WaySection>
</Story>

<Story name="SimpleHeader">
  <WaySection
    title="Recent Assessment Records"
    subtitle="Diagnostic sessions completed over the last 14 days."
  >
    <div class="p-4 surface-card rounded-sm border border-(--border-subtle) text-xs text-(--text-secondary)">
      3 active continuous assessment points logged.
    </div>
  </WaySection>
</Story>
