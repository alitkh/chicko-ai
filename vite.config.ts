import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures relative paths for assets, useful for some deployments
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  }
});