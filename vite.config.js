import { defineConfig } from 'vite'; // Importa la función defineConfig de Vite para configurar el proyecto
import react from '@vitejs/plugin-react'; // Importa el plugin de React para Vite
import { visualizer } from 'rollup-plugin-visualizer'; // Importa el visualizador de paquetes para analizar el tamaño del bundle
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  server: {
    port: 5174,
    host: true, // Permite acceder desde cualquier IP
    open: true // Abre el navegador automáticamente
  },
  plugins: [
    react(), // Plugin para compilar componentes React (JSX/TSX)
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    visualizer({ // Configuración del visualizador de tamaño de paquetes
      open: true, // Abre automáticamente el informe en el navegador
      filename: 'dist/stats.html', // Ruta donde se guardará el informe
      gzipSize: true, // Muestra el tamaño comprimido con gzip
      brotliSize: true, // Muestra el tamaño comprimido con brotli
    })
  ],
  build: { // Configuración del proceso de construcción
    outDir: 'dist', // Directorio de salida para los archivos compilados
    rollupOptions: { // Opciones avanzadas de Rollup (empaquetador usado por Vite)
      output: {
        manualChunks: { // División manual de código en chunks para optimizar carga
          'vendor': [ // Chunk para librerías principales
            'react',
            'react-dom',
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            'react-redux',
            '@reduxjs/toolkit'
          ],
          'ui': [ // Chunk para componentes de UI
            'framer-motion',
            'react-slick',
            'slick-carousel'
          ]
        },        
        plugins: [visualizer()], // Plugin para visualizar tamaño de chunks
        external: ['react-helmet-async'], // Librerías que no se incluirán en el bundle        
      }
    },
    chunkSizeWarningLimit: 1000, // Aumenta el límite de advertencia para chunks grandes (en KB)
    minify: 'terser', // Usa Terser para minificar el código (más eficiente que esbuild)
    terserOptions: { // Opciones avanzadas para Terser
      compress: {
        drop_console: true, // Elimina todos los console.log en producción
        drop_debugger: true // Elimina todas las declaraciones debugger en producción
      }
    }
  }
});
