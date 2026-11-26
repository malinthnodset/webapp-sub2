import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vites main config file. Adjust to customize how project is built, how dev server runs, and add extra plugins

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
