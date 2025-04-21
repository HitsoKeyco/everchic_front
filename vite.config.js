import { defineConfig } from 'vite'; // Importa la función defineConfig de Vite para configurar el proyecto
import react from '@vitejs/plugin-react'; // Importa el plugin de React para Vite
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
    })
  ],
  build: { // Configuración del proceso de construcción
    outDir: 'dist', // Directorio de salida para los archivos compilados

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
