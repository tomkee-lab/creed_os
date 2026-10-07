<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Sidebar from '../shell/Sidebar.svelte';

  const { Story } = defineMeta({
    title: 'WAY 3.0 Shell/Sidebar',
    component: Sidebar,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Calm Editorial Application Sidebar. Bifurcated across personas (Student, Parent, Teacher, Counselor, Admin, Studio) with 240px expanded and 68px collapsed modes.'
        }
      },
      layout: 'fullscreen'
    },
    argTypes: {
      collapsed: { control: 'boolean' },
      activeRole: {
        control: 'select',
        options: ['student', 'parent', 'teacher', 'counselor', 'admin', 'studio']
      }
    }
  });
</script>

<Story name="StudentExpanded" args={{ collapsed: false, activeRole: 'student' }}>
  {#snippet template(args)}
    <div class="h-screen w-full bg-canvas flex">
      <Sidebar {...args} />
      <div class="flex-1 p-8 text-ink text-sm">
        <h1 class="text-xl font-bold">Student Experience Canvas</h1>
        <p class="text-ink-secondary text-xs mt-1">Comfortable density, human-first developmental growth navigation.</p>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="TeacherExpanded" args={{ collapsed: false, activeRole: 'teacher' }}>
  {#snippet template(args)}
    <div class="h-screen w-full bg-canvas flex">
      <Sidebar {...args} />
      <div class="flex-1 p-8 text-ink text-sm">
        <h1 class="text-xl font-bold">Teacher Workspace Canvas</h1>
        <p class="text-ink-secondary text-xs mt-1">Cohort analytics, curriculum pacing, and intervention navigation.</p>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="StudioExpanded" args={{ collapsed: false, activeRole: 'studio' }}>
  {#snippet template(args)}
    <div class="h-screen w-full bg-canvas flex">
      <Sidebar {...args} />
      <div class="flex-1 p-8 text-ink text-sm">
        <h1 class="text-xl font-bold">Item Studio Workspace</h1>
        <p class="text-ink-secondary text-xs mt-1">Psychometric item authoring and calibration workbench.</p>
      </div>
    </div>
  {/snippet}
</Story>

<Story name="Collapsed" args={{ collapsed: true, activeRole: 'student' }}>
  {#snippet template(args)}
    <div class="h-screen w-full bg-canvas flex">
      <Sidebar {...args} />
      <div class="flex-1 p-8 text-ink text-sm">
        <h1 class="text-xl font-bold">Collapsed 68px Mode</h1>
        <p class="text-ink-secondary text-xs mt-1">Focused mode preserving maximum screen real estate.</p>
      </div>
    </div>
  {/snippet}
</Story>
