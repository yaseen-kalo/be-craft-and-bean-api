import { defineConfig } from "@playwright/test";
import { env } from "@config/env";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: env.baseURL,
  },

  reporter: [["list"], ["html", { open: "never" }]],

  webServer: {
    command: "npx tsx mock-server/server.ts",
    url: "http://localhost:3001/v1/categories",
    reuseExistingServer: !process.env.CI,
  },
});
