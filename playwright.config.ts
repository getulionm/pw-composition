import { defineConfig } from "@playwright/test";

const MOCK_PORT = Number(process.env.MOCK_PORT ?? 4173);
const baseURL = `http://127.0.0.1:${MOCK_PORT}/`;

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/*.spec.ts"],
  fullyParallel: false,

  reporter: [["list"]],

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    headless: !!process.env.CI,
  },

  webServer: {
    command: `node scripts/copy-readme-to-mock.mjs && npx http-server mock-app -p ${MOCK_PORT} -c-1 --silent`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
