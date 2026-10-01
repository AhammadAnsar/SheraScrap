import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  resolve: { alias: [
    { find: /^.*\/cms\/CMSContext$/, replacement: path.resolve('src/static/CMSContext.tsx') },
    { find: /^.*\/components\/ScrapEstimator$/, replacement: path.resolve('src/static/QuoteRequest.tsx') },
    { find: './ScrapEstimator', replacement: path.resolve('src/static/QuoteRequest.tsx') },
  ] },
  build: { outDir: 'dist/pages', emptyOutDir: true, target: 'es2020' },
});
