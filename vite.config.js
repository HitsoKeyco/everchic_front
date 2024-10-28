import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import { visualizer } from 'rollup-plugin-visualizer'; // Asegúrate de usar llaves en esta importación

export default defineConfig({
  plugins: [
    react(),
    // visualizer({
    //   open: true,
    //   filename: 'dist/stats.html',
    // })
  ],
  build: {
    outDir: 'dist',
  },
});
