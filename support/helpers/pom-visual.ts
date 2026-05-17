import type { Page } from "@playwright/test";

const POM_VISUAL_STORAGE_KEY = "pw-pom-visual";

/**
 * When `POM_VISUAL=1`, the fixture enables the same outline mode as the mock's
 * floating inspector by setting `localStorage` key **`pw-pom-visual`** before
 * each document loads. `mock-app/shared/mock-shell.js` reads it and toggles
 * `body.pom-visual`.
 */
export async function registerPomVisualOnPage(page: Page): Promise<void> {
  await page.addInitScript((key: string) => {
    try {
      localStorage.setItem(key, "1");
    } catch {
      /* ignore */
    }
  }, POM_VISUAL_STORAGE_KEY);
}
