import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward /api calls to your running API — use YOUR api port (yours was 5035)
      '/api': 'http://localhost:5035',
    },
  },
});