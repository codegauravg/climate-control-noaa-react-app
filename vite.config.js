import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Content-Type-Options':  'nosniff',
      'X-Frame-Options':         'DENY',
      'X-XSS-Protection':        '0',
      'Referrer-Policy':         'strict-origin-when-cross-origin',
      'Permissions-Policy':      'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "connect-src 'self' https://www.ncei.noaa.gov ws://localhost:5173 wss://localhost:5173",
        "img-src 'self' data:",
        "font-src 'self'",
        "object-src 'none'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; '),
    },
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
