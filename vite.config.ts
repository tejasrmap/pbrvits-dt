import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/@react-three')) {
            return 'r3f-vendor';
          }
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/zustand')) {
            return 'ui-vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1200
  }
})
