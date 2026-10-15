import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Cross-platform Cesium Vite plugin avoiding Windows absolute path concatenation bugs
 */
function creedCesium(): Plugin {
  const cesiumSource = path.resolve('node_modules/cesium/Build/Cesium');
  return {
    name: 'creed-cesium',
    config() {
      return {
        define: {
          CESIUM_BASE_URL: JSON.stringify('/cesium/')
        }
      };
    },
    configureServer(server) {
      server.middlewares.use('/cesium', (req, res, next) => {
        const cleanUrl = (req.url || '').split('?')[0];
        const filePath = path.join(cesiumSource, cleanUrl);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath);
          if (ext === '.css') res.setHeader('Content-Type', 'text/css');
          else if (ext === '.js') res.setHeader('Content-Type', 'application/javascript');
          else if (ext === '.json') res.setHeader('Content-Type', 'application/json');
          else if (ext === '.png') res.setHeader('Content-Type', 'image/png');
          else if (ext === '.jpg') res.setHeader('Content-Type', 'image/jpeg');
          else if (ext === '.wasm') res.setHeader('Content-Type', 'application/wasm');
          res.setHeader('Access-Control-Allow-Origin', '*');
          return fs.createReadStream(filePath).pipe(res);
        }
        next();
      });
    },
    async closeBundle() {
      const targetDir = path.resolve('.svelte-kit/output/client/cesium');
      if (fs.existsSync(cesiumSource)) {
        try {
          fs.mkdirSync(targetDir, { recursive: true });
          for (const sub of ['Assets', 'ThirdParty', 'Workers', 'Widgets']) {
            const src = path.join(cesiumSource, sub);
            const dest = path.join(targetDir, sub);
            if (fs.existsSync(src)) {
              await fs.promises.cp(src, dest, { recursive: true });
            }
          }
        } catch (err) {
          console.warn('[creed-cesium] Asset copy notice:', err);
        }
      }
    },
    transformIndexHtml() {
      return [
        {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: '/cesium/Widgets/widgets.css'
          }
        }
      ];
    }
  };
}

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
    creedCesium(),
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
          if (id.includes('node_modules/cesium')) {
            return 'cesium';
          }
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
      'monaco-editor',
      'cesium'
    ],
    exclude: [
      'satellite.js'
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
