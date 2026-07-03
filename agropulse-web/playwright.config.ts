import { defineConfig, devices } from "@playwright/test";

/**
 * Configuración Playwright — smoke tests E2E de AgroPulse.
 *
 * - Levanta `npm run dev` en :3000 (o reutiliza el server existente).
 * - Solo Chromium (suficiente para smoke tests académicos + CI ligero).
 * - Locale es-CR para que formatos de moneda/fecha coincidan con producción.
 */
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  // En CI se añade el reporte HTML para subirlo como artifact si falla.
  reporter: process.env.CI
    ? [["list"], ["html", { open: "never" }]]
    : [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    locale: "es-CR",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
