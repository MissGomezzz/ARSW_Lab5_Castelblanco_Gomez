import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.VITE_BACKEND_URL || 'http://localhost:8080'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      // Same-origin proxy so the browser never makes a cross-origin call (the backend has no CORS config).
      proxy: {
        '/api': backend,
        '/auth': backend,
      },
    },
  }
})
