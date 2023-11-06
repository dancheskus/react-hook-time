/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import dts from 'vite-plugin-dts'

const babelPlugins = {
  plugins: [
    ['babel-plugin-styled-components', { displayName: true, fileName: false }],
  ]
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.ts'),
      name: 'react-hook-time',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    react({ babel: babelPlugins }),
    dts({ tsconfigPath: './tsconfig.build.json', })
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['src/setupTest.ts']
  },
})
