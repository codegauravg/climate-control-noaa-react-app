import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/noaa': {
        target: 'https://www.ncei.noaa.gov',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/noaa/, '/cdo-web/api/v2')
      }
    }
  }
});
