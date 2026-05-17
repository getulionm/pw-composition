import type { Page } from "@playwright/test";
import { CartPage } from "../pages/cart.page";

/**
 * Cart-team-owned journeys: review, adjust quantity, remove, proceed.
 */
export class CartWorkflow {
  readonly cart: CartPage;

  constructor(page: Page) {
    this.cart = new CartPage(page);
  }

  async openCart(): Promise<void> {
    await this.cart.goto();
  }

  async expectEmpty(): Promise<void> {
    await this.cart.goto();
    await this.cart.expectEmpty();
  }

  async setQuantity(productName: string, target: number): Promise<void> {
    await this.cart.goto();
    const stepper = this.cart.stepperFor(productName);
    const current = await stepper.readQuantity();
    const delta = target - current;
    if (delta > 0) await stepper.increment(delta);
    if (delta < 0) await stepper.decrement(-delta);
    await this.cart.expectLineQuantity(productName, target);
  }

  async removeProduct(productName: string): Promise<void> {
    await this.cart.goto();
    await this.cart.removeLine(productName);
    await this.cart.expectLineNotVisible(productName);
  }

  async proceedToCheckout(): Promise<void> {
    await this.cart.goto();
    await this.cart.proceedToCheckout();
  }

  async clearCart(): Promise<void> {
    await this.cart.clear();
  }
}
