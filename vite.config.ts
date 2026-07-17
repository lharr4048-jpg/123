import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base + single CSS chunk so `npm run build:single` can inline the
  // whole app into one self-contained HTML that runs directly from file://.
  base: './',
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
  },
})
