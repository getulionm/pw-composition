import { expect, Page } from "@playwright/test";
import { BasePage } from "../../../framework/base.page";
import { HeaderComponent } from "../../shell/components/header.component";
import { NavDrawerComponent } from "../../shell/components/nav-drawer.component";

export class OrderConfirmationPage extends BasePage {
  readonly header: HeaderComponent;
  readonly nav: NavDrawerComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "store.order-confirmation",
      pathname: "/checkout/order-confirmation",
      documentTitle: "Order confirmation",
    });
    this.header = new HeaderComponent(page);
    this.nav = new NavDrawerComponent(page);
  }

  async expectLoaded(): Promise<void> {
    await this.expectScreen();
    await expect(this.page.getByRole("heading", { name: "Thank you" })).toBeVisible();
  }

  async expectOrderNumberPattern(pattern: RegExp = /^ORD-\d{4}$/): Promise<void> {
    await expect(this.page.getByTestId("order-number")).toHaveText(pattern);
  }

  async readOrderNumber(): Promise<string> {
    return ((await this.page.getByTestId("order-number").textContent()) ?? "").trim();
  }
}
