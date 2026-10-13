<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GlyphMatrix from '../GlyphMatrix.svelte';

  const { Story } = defineMeta({
    title: 'WAY 2.1 Atmosphere/GlyphMatrix',
    component: GlyphMatrix,
    tags: ['autodocs'],
    parameters: {
      docs: {
        description: {
          component:
            'Calm generative canvas texture displaying subtle mathematical and psychometric glyph mutations. Respects prefers-reduced-motion and provides quiet sci-fi atmosphere.'
        }
      }
    },
    argTypes: {
      cellSize: { control: { type: 'number', min: 8, max: 32 } },
      mutationRate: { control: { type: 'number', min: 0.01, max: 0.2, step: 0.01 } },
      opacity: { control: { type: 'number', min: 0.1, max: 1.0, step: 0.05 } },
      interval: { control: { type: 'number', min: 30, max: 200 } }
    }
  });
</script>

<Story
  name="SubtleBackground"
  args={{
    cellSize: 16,
    mutationRate: 0.03,
    opacity: 0.45,
    interval: 100
  }}
>
  {#snippet template(args)}
    <div class="relative w-full h-64 bg-surface border border-border overflow-hidden p-6 flex flex-col justify-end">
      <GlyphMatrix {...args} class="absolute inset-0 w-full h-full" />
      <div class="relative z-10 text-xs font-mono text-ink">
        <p class="font-bold">WAY 2.1 Atmospheric Surface</p>
        <p class="text-ink-muted">Generative telemetry field (quiet restrained canvas)</p>
      </div>
    </div>
  {/snippet}
</Story>

<Story
  name="DenseTelemetry"
  args={{
    cellSize: 12,
    mutationRate: 0.06,
    opacity: 0.6,
    interval: 80
  }}
>
  {#snippet template(args)}
    <div class="relative w-full h-64 bg-surface-raised border border-border overflow-hidden p-6 flex flex-col justify-end">
      <GlyphMatrix {...args} class="absolute inset-0 w-full h-full" />
      <div class="relative z-10 text-xs font-mono text-ink">
        <p class="font-bold">Dense Telemetry Stream</p>
        <p class="text-ink-muted">Active calculation environment background</p>
      </div>
    </div>
  {/snippet}
</Story>
