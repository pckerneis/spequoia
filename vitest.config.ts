import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: [],
    include: ["packages/**/src/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "**/test/**",
        "**/tests/**",
        "**/vitest.config.ts",
        "**/tsconfig*.json",
        "**/*.d.ts",
        "**/dist/**",
        "**/node_modules/**",
      ],
    },
  },
});
