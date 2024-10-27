import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          materialUI: ['@mui/material'],
          otherVendors: [
            '@emotion/react',
            '@popperjs/core',
            'axios',
            'sweetalert2',
            'framer-motion',
            'decimal.js',
            'react-hook-form',
          ],
          
        },
      },
    },
  },
});
