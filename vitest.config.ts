import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: "v8",
    },
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          include: ["src/data-processing/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: [
            "src/components/**/*.test.tsx",
            "src/context/**/*.test.{ts,tsx}",
          ],
          browser: {
            enabled: true,
            provider: playwright(),
            // https://vitest.dev/config/browser/playwright
            instances: [{ browser: "chromium" }],
            headless: true,
          },
        },
      },
    ],
  },
});
