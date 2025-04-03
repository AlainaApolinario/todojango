import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/todojango/', // 👈 Set this to your repo name in lowercase
});
