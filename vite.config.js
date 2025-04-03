import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/', // Use environment variable for base URL
  server: {
    proxy: {
      '/api': {
        target: 'https://todojango.onrender.com', // Proxy API requests
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  optimizeDeps: {
    include: ['axios', 'react', 'react-dom'], // Pre-bundle frequently used dependencies
  },
});
