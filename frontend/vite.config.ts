import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'process.env': env,
    },
    plugins: [react()],
    server: {
      open: true,
      port: 3000,
    },
    build: {
      outDir: './build',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~react-image-gallery': path.resolve(__dirname, 'node_modules/react-image-gallery'),
      },
    },
  }
})
