import { defineConfig } from 'vitest/config'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'
import { loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load biến môi trường từ file .env.[mode]
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tanstackRouter({ autoCodeSplitting: true }),  // Scan src/routes, generate routeTree.gen.ts
      viteReact(),
      tailwindcss(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 3000, // port động từ .env
    },
    mode, // gán lại mode để Vite biết bạn đang chạy ở môi trường nào
  }
})
