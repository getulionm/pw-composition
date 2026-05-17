import { test } from "../../support/fixtures/app.fixture";

/**
 * COMPLEX-tier spec.
 *
 * What makes this "complex" is NOT the number of steps — it's the number of
 * modules involved. This test composes workflows from FOUR modules in one
 * test body:
 *   - shellWorkflow         (shell module)
 *   - membershipWorkflow    (shell — user type, explicit Given)
 *   - browseCatalogWorkflow (catalog module)
 *   - cartWorkflow          (cart module)
 *   - checkoutWorkflow      (checkout module — form only, not identity)
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
  await shellWorkflow.openHome();
  await membershipWorkflow.switchToMember();

  await browseCatalogWorkflow.addProductToCart("Acme Widget", "acme-widget");
  await browseCatalogWorkflow.addProductToCart("Super Gizmo", "super-gizmo");
  await header.expectCartCount(2);

  await cartWorkflow.setQuantity("Acme Widget", 2);
  await cartWorkflow.proceedToCheckout();

  const orderNumber = await checkoutWorkflow.placeOrder({ saveCard: true });

  await toast.expectMessage(/Order placed/);
  test.expect(orderNumber).toMatch(/^ORD-\d{4}$/);
});
