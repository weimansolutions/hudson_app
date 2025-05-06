import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // cuando en el cliente llames a /api/v1/..., Vite lo enviará a localhost:8000
      '/api/v1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api\/v1/, '/api/v1')
      }
    }
  },
  define: {
    'process.env': {}
  }
})
