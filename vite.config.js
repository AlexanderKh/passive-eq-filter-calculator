import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [
    vue(),
    vueJsx(),
    svgLoader(),
    VueDevTools(),
    viteStaticCopy({
      targets: [
        {
          src: 'LICENSE.md',
          dest: '.'
        },
        {
          src: 'README.md',
          dest: '.'
        },
        {
          src: 'THIRD-PARTY-LICENSES.txt',
          dest: '.'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
