import { UserConfig } from "vite";
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from "@tanstack/router-plugin/vite"

const BaseConfig = {
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
    tanstackRouter(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!id.includes('node_modules')) return


          const m = id.replace(/\\/g, '/')
            .match(/node_modules\/(?:\.pnpm\/[^/]+\/node_modules\/)?(@[^/]+\/[^/]+|[^/]+)/)
          const pkg = (m?.[1] ?? 'vendor').replace('@', '').replace('/', '-')
          return pkg
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/media/[name]-[hash].[ext]',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
  server: {
    proxy: {
      '/api_1': {
        target: "http://www.byteverse.vip/oneapi",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api_1/, ''),
      },
      '/api_2': {
        target: "http://8.130.135.47/parseapi",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api_2/, ''),
      },
      'api_3': {
        target: "http://115.190.25.82:9999",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api_3/, ''),
      },
    },
  }
} satisfies UserConfig
export default BaseConfig