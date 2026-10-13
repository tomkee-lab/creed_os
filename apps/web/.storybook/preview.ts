import type { Preview } from '@storybook/sveltekit';
import '../src/app.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Tooling Fixture: Storybook background manager toolbar swatch palette.
    // These approximate canonical WAY 2.1 OKLCH tokens (--surface-canvas light, --surface-raised light, --surface-canvas dark).
    // They are test/preview fixtures for Storybook iframe painting, not production component tokens.
    backgrounds: {
      default: 'mineral-canvas',
      values: [
        { name: 'mineral-canvas', value: '#F5F7FA' },
        { name: 'pure-white', value: '#FFFFFF' },
        { name: 'slate-studio', value: '#101622' },
      ],
    },
    docs: {
      toc: true,
    },
    layout: 'padded',
  },
};

export default preview;
