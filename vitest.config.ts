import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "assets",
        "src/main.tsx",
        "src/types",
        "src/context/context.ts",
        "src/components/MainView/MainView.tsx",
      ],
      thresholds: {
        statements: 90,
        branches: 70,
        functions: 75,
        lines: 85,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          include: [
            "src/data-processing/**/*.test.ts",
            "src/context/**/*.test.ts",
          ],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: "browser",
          include: [
            "src/App.test.tsx",
            "src/components/**/*.test.tsx",
            "src/context/**/*.test.tsx",
          ],
          setupFiles: ['src/vitest-setup.ts'],
          browser: {
            enabled: true,
            provider:
              process.env.NODE_ENV === "CI"
                ? playwright({
                    launchOptions: {
                      channel: "chrome",
                    },
                  })
                : playwright(),
            // https://vitest.dev/config/browser/playwright
            instances: [{ browser: "chromium" }],
            headless: true,
          },
        },
      },
    ],
  },
});
