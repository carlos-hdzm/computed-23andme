import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    alias: {
      src: "/src",
      components: "/src/components",
      assets: "/src/assets",
      context: "/src/context",
      processing: "/src/processing",
      styles: "/src/styles",
      types: "/src/types",
      util: "/src/util",
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        relativeUrls: true,
        javascriptEnabled: true
      },
    },
  },
  build: {
    minify: false,
  },
})
