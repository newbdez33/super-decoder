import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const webModules = path.resolve(__dirname, 'node_modules')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      react: path.join(webModules, 'react'),
      'react/jsx-runtime': path.join(webModules, 'react/jsx-runtime'),
      'react/jsx-dev-runtime': path.join(webModules, 'react/jsx-dev-runtime'),
      'react-dom': path.join(webModules, 'react-dom'),
      'react-dom/client': path.join(webModules, 'react-dom/client'),
    },
  },
})
