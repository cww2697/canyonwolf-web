import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.tsx'],
    setupFiles: ['./vitest.setup.ts']
  },

  css: {
    postcss: {
      plugins: []
    }
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react'
  }
});
