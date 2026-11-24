import { defineConfig } from 'vite'
import monkey from 'vite-plugin-monkey'

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        match: [
          '*://www.yuketang.cn/v2/web/cloud/student/exercise/*',
          '*://www.yuketang.cn/v2/web/iframe-exercise/*',
        ],
        grant: ['GM_xmlhttpRequest'],
        connect: [
          '*.yuketang.cn',
          'fe-static-yuketang.yuketang.cn',
          '*.xuetangx.com',
        ],
        license: 'MIT',
      },
    }),
  ],
})
