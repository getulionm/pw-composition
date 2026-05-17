import { test } from "../../support/fixtures/app.fixture";

test.describe("Cart", () => {
  test("an empty cart shows the empty-state message", async ({ cartWorkflow }) => {
    await cartWorkflow.expectEmpty();
  });

  test("a buyer can increase a line's quantity", async ({
    browseCatalogWorkflow,
    cartWorkflow,
  }) => {
    await browseCatalogWorkflow.addProductToCart("Acme Widget", "acme-widget");
    await cartWorkflow.setQuantity("Acme Widget", 3);
  });

  test("a buyer can remove a product from the cart", async ({
    browseCatalogWorkflow,
    cartWorkflow,
  }) => {
    await browseCatalogWorkflow.addProductToCart("Super Gizmo", "super-gizmo");
    await cartWorkflow.removeProduct("Super Gizmo");
  });
});
