import { test as base } from "@playwright/test";
import { CheckoutPage } from "./pages/checkout.page";
import { OrderConfirmationPage } from "./pages/order-confirmation.page";
import { CheckoutWorkflow } from "./workflows/checkout.workflow";

export type CheckoutFixtures = {
  checkoutPage: CheckoutPage;
  orderConfirmationPage: OrderConfirmationPage;
  checkoutWorkflow: CheckoutWorkflow;
};

/**
 * Checkout-team-owned fixture surface.
 */
export const test = base.extend<CheckoutFixtures>({
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  orderConfirmationPage: async ({ page }, use) => use(new OrderConfirmationPage(page)),
  checkoutWorkflow: async ({ page }, use) => use(new CheckoutWorkflow(page)),
});
