import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'process.env': env,
    },
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mediapipe/*'],
        manifest: {
          name: 'Signo - Greek Sign Language Learning AI',
          short_name: 'Signo',
          description: 'Learn Greek Sign Language (ΕΝΓ) fingerspelling with real-time AI computer vision feedback',
          theme_color: '#1A1D28',
          background_color: '#1A1D28',
          display: 'standalone',
          icons: [
            {
              src: 'favicon.ico',
              sizes: '64x64 32x32 24x24 16x16',
              type: 'image/x-icon',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,wasm,data,tflite,json}'],
          runtimeCaching: [
            {
              urlPattern: /^\/mediapipe\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'mediapipe-wasm-cache',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),
    ],
    server: {
      open: true,
      port: 3000,
    },
    worker: {
      format: 'es',
    },
    build: {
      outDir: './build',
    },
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
        '~react-image-gallery': path.resolve(process.cwd(), 'node_modules/react-image-gallery'),
      },
    },
  }
})
