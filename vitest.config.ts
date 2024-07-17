import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    environmentMatchGlobs: [["**/*.node.test.ts", "node"]],
    setupFiles: "./src/tests/setup.ts",
    coverage: {
      include: ["src/**", "!src/tests/**", "!src/i18nConfig.js"],
    },
  },
});
