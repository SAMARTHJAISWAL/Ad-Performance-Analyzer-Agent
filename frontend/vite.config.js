import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Same output folder as Create React App, so the existing Vercel project
    // (set up for CRA) keeps finding the build without a settings change.
    outDir: 'build',
  },
  server: {
    // Same port as the old CRA dev server, so existing docs and bookmarks keep working.
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
});
