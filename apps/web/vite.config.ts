import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Prevent abrupt socket disconnects common with tunnels on Windows from silently crashing Vite in dev
if (process.env.NODE_ENV !== 'production') {
  process.on('uncaughtException', (err: any) => {
    if (err?.code === 'ECONNRESET' || err?.code === 'EPIPE' || err?.code === 'ETIMEDOUT') {
      return;
    }
    console.error('[vite:uncaughtException]', err);
    process.exit(1);
  });
}

export default defineConfig({
  plugins: [
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide'
    }),
    tailwindcss(),
    sveltekit()
  ],
  esbuild: {
    target: 'esnext',
    supported: {
      'top-level-await': true
    }
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 6000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/monaco-editor')) {
            return 'monaco';
          }
          if (id.includes('node_modules/three')) {
            return 'three';
          }
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      }
    },
    include: [
      'jszip',
      'altcha-lib/v1',
      '@xterm/xterm',
      'monaco-editor'
    ]
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.trycloudflare.com',
      '.loca.lt'
    ]
  },
  ssr: {
    noExternal: [
      'svelte-sonner',
      'layerchart',
      '@xyflow/svelte',
      '@tanstack/table-core',
      'sveltekit-superforms',
      'altcha',
      'altcha-lib',
      '@iconify/svelte'
    ]
  }
});
