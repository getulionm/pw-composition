import { mergeTests } from "@playwright/test";
import { registerPomVisualOnPage } from "../helpers/pom-visual";
import { test as shellTest } from "../modules/shell/shell.fixture";
import { test as catalogTest } from "../modules/catalog/catalog.fixture";
import { test as cartTest } from "../modules/cart/cart.fixture";
import { test as checkoutTest } from "../modules/checkout/checkout.fixture";

/**
 * Root `test` for specs.
 *
 * Two responsibilities:
 *   1. Compose per-module fixture files via Playwright's `mergeTests`.
 *      Adding a new module = one folder + one line below.
 *   2. App-level page initialization. This is where ambient, cross-cutting
 *      browser setup lives — currently just the POM-visual outline toggle
 *      (opt-in via `POM_VISUAL=1`). Tests never reference this; the override
 *      runs once per page automatically.
 */
const merged = mergeTests(shellTest, catalogTest, cartTest, checkoutTest);

export const test = merged.extend({
  page: async ({ page }, use) => {
    if (process.env.POM_VISUAL === "1") {
      await registerPomVisualOnPage(page);
    }
    await use(page);
  },
});

export { expect } from "@playwright/test";
