import { test } from "../../support/fixtures/app.fixture";

/**
 * BDD-style version of `checkout.purchase.spec.ts`. The exact same workflow
 * calls, wrapped in `test.step('Given/When/Then ...')` so the Playwright
 * HTML report reads like a Gherkin scenario — without feature files or regex
 * glue. Tests remain native TypeScript: Cmd+click to definitions,
 * refactor-safe, no plugin.
 */
test("a member completes a purchase across Catalog -> Cart -> Checkout", async ({
  shellWorkflow,
  membershipWorkflow,
  browseCatalogWorkflow,
  cartWorkflow,
  checkoutWorkflow,
  header,
  toast,
}) => {
  await test.step("Given a member is on the store home", async () => {
    await shellWorkflow.openHome();
    await membershipWorkflow.switchToMember();
  });

  await test.step("When they add two products to the cart", async () => {
    await browseCatalogWorkflow.addProductToCart("Acme Widget", "acme-widget");
    await browseCatalogWorkflow.addProductToCart("Super Gizmo", "super-gizmo");
    await header.expectCartCount(2);
  });

  await test.step("And they raise the Acme Widget quantity to 2", async () => {
    await cartWorkflow.setQuantity("Acme Widget", 2);
  });

  await test.step("And they proceed to checkout and place the order with save card", async () => {
    await cartWorkflow.proceedToCheckout();
    const orderNumber = await checkoutWorkflow.placeOrder({ saveCard: true });
    test.expect(orderNumber).toMatch(/^ORD-\d{4}$/);
  });

  await test.step("Then a confirmation toast is visible", async () => {
    await toast.expectMessage(/Order placed/);
  });
});
