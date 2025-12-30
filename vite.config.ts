import { resolve } from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/renderer',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
  },
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/renderer'),
    },
  },
  server: {
    port: 5173,
    open: false, // 禁用自动在浏览器中打开，因为 Electron 会自己打开窗口
    host: 'localhost', // 确保只监听 localhost
    hmr: {
      // 启用 HMR（热模块替换）
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },
});
