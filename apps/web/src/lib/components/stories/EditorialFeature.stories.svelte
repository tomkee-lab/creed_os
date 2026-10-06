<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EditorialFeature from '../EditorialFeature.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Editorial/EditorialFeature',
    component: EditorialFeature,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Mixed-media editorial feature card conforming to WAY 2.1 expressive 8px radius geometry and true 8pt spacing rhythm. Replaces generic stock images with rich documentary visuals.'
        }
      }
    }
  });
</script>

<Story
  name="RoboticsMaker"
  args={{
    src: '/generated_images/pathway_robotics_asian.png',
    alt: 'Middle school student working with robotic chassis and microcontrollers in an engineering workshop',
    aspectRatio: '16:9',
    badge: 'Signature Pathway',
    caption: 'Class 8-10 Exploratory Engineering Cohort',
    title: 'Autonomous Robotics & Sensor Logic',
    description:
      'Immerse in hardware prototyping, sensor fusion, and algorithmic motor control with industry mentor feedback.',
    actionLabel: 'Explore Pathway Syllabus',
    actionHref: '/student/pathways',
    secondaryLabel: 'View Evidence Rubric',
    secondaryHref: '#'
  }}
/>

<Story
  name="BioDiscovery"
  args={{
    src: '/generated_images/pathway_bio_asian.png',
    alt: 'Student conducting microfluidics and cellular observation under guided optical microscopy',
    aspectRatio: '16:9',
    badge: 'Life Sciences Sprint',
    caption: 'Biotechnology & Computational Health',
    title: 'Cellular Systems & Bio-Informatics',
    description:
      'Explore ecological data modeling, genetics foundations, and statistical inference through real-world biological datasets.',
    actionLabel: 'Launch Bio Module',
    actionHref: '/student/pathways'
  }}
/>
