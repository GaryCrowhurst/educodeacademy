import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: '/CodeEdAi/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    },
    cssCodeSplit: false,
    assetsInlineLimit: 100000000
  },
  server: {
    port: 3000,
    open: true
  }
})
