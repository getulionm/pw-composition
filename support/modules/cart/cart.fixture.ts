import { test as base } from "@playwright/test";
import { CartPage } from "./pages/cart.page";
import { CartWorkflow } from "./workflows/cart.workflow";

export type CartFixtures = {
  cartPage: CartPage;
  cartWorkflow: CartWorkflow;
};

/**
 * Cart-team-owned fixture surface.
 */
export const test = base.extend<CartFixtures>({
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  cartWorkflow: async ({ page }, use) => use(new CartWorkflow(page)),
});
