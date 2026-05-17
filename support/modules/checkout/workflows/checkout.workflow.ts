import type { Page } from "@playwright/test";
import { CheckoutDetails, CheckoutPage } from "../pages/checkout.page";
import { OrderConfirmationPage } from "../pages/order-confirmation.page";

const DEFAULT_DETAILS: CheckoutDetails = {
  fullName: "Sam Patel",
  address: "1 Test Street, Springfield",
  cardNumber: "4242424242424242",
};

export type PlaceOrderOptions = {
  /** When true, checks "Save card for later" (requires MEMBER — set via membershipWorkflow first). */
  saveCard?: boolean;
  details?: Partial<CheckoutDetails>;
};

/**
 * Checkout-team-owned journeys: fill, place order, verify confirmation.
 * Membership (MEMBER vs GUEST) is shell-owned — call membershipWorkflow.switchTo*
 * before placeOrder; this workflow only drives the checkout form.
 */
export class CheckoutWorkflow {
  readonly checkout: CheckoutPage;
  readonly confirmation: OrderConfirmationPage;

  constructor(page: Page) {
    this.checkout = new CheckoutPage(page);
    this.confirmation = new OrderConfirmationPage(page);
  }

  async openCheckout(): Promise<void> {
    await this.checkout.goto();
  }

  async placeOrder(options: PlaceOrderOptions = {}): Promise<string> {
    const saveCard = options.saveCard ?? false;
    await this.checkout.goto();
    await this.checkout.fillDetails({
      ...DEFAULT_DETAILS,
      ...options.details,
      saveCard,
    });
    await this.checkout.placeOrder();
    await this.confirmation.expectLoaded();
    await this.confirmation.expectOrderNumberPattern();
    return this.confirmation.readOrderNumber();
  }
}
