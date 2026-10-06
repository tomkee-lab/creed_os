import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Adapter} */
const adapter = {
  name: '@sveltejs/adapter-auto',
  async adapt(builder) {
    const mod = await import('@sveltejs/adapter-auto');
    const autoAdapter = mod.default();
    return autoAdapter.adapt(builder);
  }
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter,
    alias: {
      $lib: './src/lib'
    }
  }
};

export default config;


