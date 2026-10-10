import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

// Relative base so the build works at any GitHub Pages path (user.github.io/<repo>/).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {chunkSizeWarningLimit: 1500},
  test: {include: ['tests/**/*.test.ts']},
});
