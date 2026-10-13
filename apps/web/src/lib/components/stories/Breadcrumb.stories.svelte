<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Breadcrumb from '../Breadcrumb.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Navigation/Breadcrumb',
    component: Breadcrumb,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Calm, monospace-accented navigational breadcrumb hierarchy with zero curved pills or bubble tabs.'
        }
      }
    }
  });
</script>

<Story
  name="MissionDeepLink"
  args={{
    items: [
      { label: 'Learner Studio', href: '/student' },
      { label: 'Kinematics & Dynamics', href: '/student/missions' },
      { label: 'RoboBridge Truss Analysis' }
    ]
  }}
/>

<Story
  name="EducatorConsole"
  args={{
    items: [
      { label: 'Console', href: '/teacher' },
      { label: 'Cohort Benchmarks', href: '/teacher/benchmarks' },
      { label: 'Class 8-A Diagnostic Dossier' }
    ]
  }}
/>

<Story
  name="SingleLevel"
  args={{
    items: [
      { label: 'Dashboard' }
    ]
  }}
/>
