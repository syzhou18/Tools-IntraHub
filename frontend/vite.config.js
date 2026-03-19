import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 確保容器外部可以存取
    port: 5173,      // 對應你 docker-compose 的容器內埠號
    watch: {
      usePolling: true, // 👈 關鍵：強制 Vite 輪詢檢查檔案變動
      interval: 100,    // 檢查頻率 (毫秒)
    },
    hmr: {
      clientPort: 8080, // 👈 關鍵：對應你 docker-compose 外部對開的埠號
    },
  },
});