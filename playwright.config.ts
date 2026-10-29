import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const executablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
    launchOptions: { executablePath },
  },
  webServer: [
    {
      command: "npm run dev -- --port 4173 --strictPort",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: !process.env.CI,
      env: { VITE_LEAD_ENDPOINT: "" },
    },
    {
      command: "npm run dev -- --port 4174 --strictPort",
      url: "http://127.0.0.1:4174",
      reuseExistingServer: !process.env.CI,
      env: { VITE_LEAD_ENDPOINT: "/api/leads" },
    },
    {
      command: "npm run preview -- --port 4175 --strictPort",
      url: "http://127.0.0.1:4175",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "node tests/static-server.mjs",
      url: "http://127.0.0.1:4176/aulademo/",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
