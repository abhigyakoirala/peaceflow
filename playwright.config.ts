import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  use: {
    baseURL: "http://localhost:8081",
    viewport: { width: 390, height: 844 },
    headless: true,
    channel: "chromium",
  },
  workers: 1,
  reporter: "list",
});
