/**
 * COUNTER-EXAMPLE. This spec performs the same "the shop lists the two seed
 * products" case as `catalog-browse.spec.ts`, but uses raw `page.locator(...)`
 * and inline `expect(...)` instead of a page fixture.
 *
 * It is shipped as a teaching artifact: the framework does not forbid this
 * style. When a one-off debugging case or a framework-evolution edge demands
 * raw locators, this is what it looks like. The clean version next to it is
 * what we recommend. Pick by readability, not by rule.
 */
import { expect, test } from "@playwright/test";

test("raw counter-example: the shop lists the two seed products", async ({ page }) => {
  await page.goto("/catalog/");

  await expect(page.getByRole("table", { name: "Products" })).toBeVisible();
  await expect(
    page
      .getByRole("table", { name: "Products" })
      .getByRole("row")
      .filter({ hasText: "Acme Widget" })
  ).toBeVisible();
  await expect(
    page
      .getByRole("table", { name: "Products" })
      .getByRole("row")
      .filter({ hasText: "Super Gizmo" })
  ).toBeVisible();
});
