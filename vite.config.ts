import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third argument '' ensures we load all variables, not just those with VITE_ prefix.
  const env = loadEnv(mode, '.', '');
  
  // On Vercel, environment variables are often exposed on process.env directly during build
  const apiKey = env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Define process.env.API_KEY global for the browser to match SDK requirements
      // We use JSON.stringify to ensure it's wrapped in quotes as a string literal
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
  };
});