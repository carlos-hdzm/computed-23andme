import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      // https://vitest.dev/config/browser/playwright
      instances: [
        { browser: 'chromium' },
      ],
    },
    coverage: {
      provider: 'v8',
    },
    projects: [
      {
        test: {
          name: 'node',
          include: ['src/data-processing/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'browser',
          include: ['src/components/**/*.test.tsx', 'src/context/**/*.test.{ts|tsx}'],
        },
      },
    ],
  },
})
