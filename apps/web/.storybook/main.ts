import type { StorybookConfig } from '@storybook/sveltekit';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|ts|svelte)'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {},
  },
};

export default config;
