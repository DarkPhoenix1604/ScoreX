import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The server configuration, including the proxy, must be inside this object
  server: {
    proxy: {
      // This proxies any request starting with /api...
      '/api': {
        // ...to your backend server running on port 8000
        target: 'http://localhost:8000',
        changeOrigin: true, // Recommended for this type of setup
      },
      // This is also useful for serving the word cloud images
       '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})