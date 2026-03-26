import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100,
    },
    hmr: {
      clientPort: 8080,
    },
    proxy: {
      '/api': {
        target: 'http://192.168.3.231:3000', // 改成你的後端實際位址
        changeOrigin: true,
      },
    },
  },
})