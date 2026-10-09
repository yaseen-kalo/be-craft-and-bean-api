import { defineConfig } from "@playwright/test";
import { env } from "@config/env";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: env.baseURL,
  },
});
