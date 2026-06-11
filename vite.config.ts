import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': 'http://localhost:3000',
      },
    },
    optimizeDeps: {
      // Force Vite to pre-bundle motion so it initialises as a single CJS-
      // compatible unit — prevents Safari's strict TDZ enforcement from
      // crashing on the circular class-field references inside the package.
      include: ['motion/react'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Give motion its own chunk so it is fully evaluated before any
            // app code that imports it — fixes "Cannot access X before
            // initialization" TDZ crash in Safari/WebKit.
            if (id.includes('/motion/') || id.includes('\\motion\\')) {
              return 'vendor-motion';
            }
            if (id.includes('react-dom') || id.includes('react/jsx')) {
              return 'vendor-react';
            }
          },
        },
      },
    },
  };
});
