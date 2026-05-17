import { expect, test } from "../../support/fixtures/app.fixture";

test.describe("Catalog", () => {
  // SIMPLE-tier: a single page fixture used directly. No workflow needed for
  // a one-screen assertion. The test composes nothing — the page does the
  // composing for it. The framework allows this on purpose.
  test("simple: the shop lists the two seed products", async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.expectProductListed("Acme Widget");
    await catalogPage.expectProductListed("Super Gizmo");
  });

  // MEDIUM-tier: ONE workflow fixture orchestrates page-to-page interaction
  // inside a SINGLE module (catalog). The complex tier in `tests/checkout/`
  // is the same idea but with workflows from MULTIPLE modules in one test.
  test("medium: a buyer searches and opens a product", async ({ browseCatalogWorkflow }) => {
    await browseCatalogWorkflow.searchForProduct("Acme", "Acme Widget", "Super Gizmo");
    await browseCatalogWorkflow.openProductDetail("Acme Widget", "acme-widget");
  });

  test("medium: clearing search restores the full list", async ({ browseCatalogWorkflow }) => {
    await browseCatalogWorkflow.clearSearchRestoresFullList("Acme");
  });

  test("medium: adding to cart updates the shell cart badge", async ({
    browseCatalogWorkflow,
    header,
  }) => {
    await browseCatalogWorkflow.addProductToCart("Acme Widget", "acme-widget");
    await header.expectCartCount(1);
    await expect(header.cartBadge()).toBeVisible();
  });

  test("medium: add to cart shows a toast on the shell surface", async ({ browseCatalogWorkflow, toast }) => {
    await browseCatalogWorkflow.addProductToCart("Acme Widget", "acme-widget");
    await toast.expectMessage(/Acme Widget added to cart/);
  });
});
