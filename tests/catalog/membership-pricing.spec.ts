import { test } from "../../support/fixtures/app.fixture";

/**
 * COMPLEX-tier: membership (shell) + catalog browse + product detail + cart.
 * Guest pays full price; member sees struck full price and pays half in cart.
 */
test("guest pays full price; member pays member price on catalog, detail, and cart", async ({
  membershipWorkflow,
  browseCatalogWorkflow,
  catalogPage,
  productDetailPage,
  cartWorkflow,
  cartPage,
}) => {
  await browseCatalogWorkflow.openCatalog();
  await membershipWorkflow.switchToGuest();
  await cartWorkflow.clearCart();

  await catalogPage.expectGuestPriceFor("Acme Widget", "£10");
  await browseCatalogWorkflow.openProductDetail("Acme Widget", "acme-widget");
  await membershipWorkflow.switchToGuest();
  await productDetailPage.expectGuestPrice("£10");
  await productDetailPage.addToCart();
  await cartPage.goto();
  await cartPage.expectLineUnitPrice("Acme Widget", "£10.00");
  await cartWorkflow.clearCart();

  await membershipWorkflow.switchToMember();
  await catalogPage.goto();
  await catalogPage.expectMemberPriceFor("Acme Widget", "£10", "£5");
  await browseCatalogWorkflow.openProductDetail("Acme Widget", "acme-widget");
  await productDetailPage.expectMemberPrice("£10", "£5");
  await productDetailPage.addToCart();
  await cartPage.goto();
  await cartPage.expectLineUnitPrice("Acme Widget", "£5.00");
});
