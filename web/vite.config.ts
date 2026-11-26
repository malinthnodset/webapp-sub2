import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Vite's main config file.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev proxy: every request to /api/... is forwarded to the ASP.NET API.
    // Because the browser only talks to Vite (localhost:5173), we avoid CORS problems in development.
    // The port must match "applicationUrl" (http profile) in api/api/Properties/launchSettings.json.
    proxy: {
      '/api': {
        target: 'http://localhost:5214',
        changeOrigin: true,
      },
    },
  },
})
