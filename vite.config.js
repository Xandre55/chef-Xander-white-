import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/xandre-frontend', // Important for GitHub Pages
  plugins: [react()],
})

