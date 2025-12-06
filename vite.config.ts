import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Prioritize Vercel/System Env -> Local .env -> Fallback
  const apiKey = env.API_KEY || env.VITE_API_KEY || process.env.API_KEY || process.env.VITE_API_KEY || '';

  return {
    plugins: [react()],
    base: './', 
    define: {
      // Force replace process.env.API_KEY with the actual string value during build
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Also provide standard Vite access
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey)
    },
    build: {
      outDir: 'dist',
    },
    server: {
      port: 3000,
    }
  };
});