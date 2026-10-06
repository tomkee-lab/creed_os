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
