import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const SERVER_PORT = 3004;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: '.vitest/setup',
    include: ['./src/**/*.{test,spec}.{ts,tsx}'],
    watchExclude: ['**/node_modules/**', '**/src/main.tsx'],
    exclude: ['**/src/main.tsx'],
  },
});
