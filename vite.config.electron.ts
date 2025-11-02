import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import BaseConfig from './vite.base.config'

// https://vite.dev/config/
export default defineConfig({
  ...BaseConfig,
  plugins: [
    ...BaseConfig.plugins,
    electron({
      main: {
        entry: 'electron/main.ts',
      },
    }),
  ],
})