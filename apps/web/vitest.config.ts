import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

const webModules = path.resolve(__dirname, 'node_modules')

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.join(webModules, 'react'),
      'react/jsx-runtime': path.join(webModules, 'react/jsx-runtime'),
      'react/jsx-dev-runtime': path.join(webModules, 'react/jsx-dev-runtime'),
      'react-dom': path.join(webModules, 'react-dom'),
      'react-dom/client': path.join(webModules, 'react-dom/client'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    server: {
      deps: {
        inline: ['zustand'],
      },
    },
    coverage: {
      include: ['src/logic/**', 'src/stores/**', 'src/components/**'],
    },
  },
})
