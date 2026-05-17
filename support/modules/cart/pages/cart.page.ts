import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../../../framework/base.page";
import { QuantityStepperComponent } from "../../../shared/components/quantity-stepper.component";
import { TableComponent } from "../../../shared/components/table.component";
import { HeaderComponent } from "../../shell/components/header.component";
import { NavDrawerComponent } from "../../shell/components/nav-drawer.component";

export class CartPage extends BasePage {
  readonly header: HeaderComponent;
  readonly nav: NavDrawerComponent;
  readonly table: TableComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "store.cart",
      pathname: "/cart",
      documentTitle: "Cart",
    });
    this.header = new HeaderComponent(page);
    this.nav = new NavDrawerComponent(page);
    this.table = new TableComponent(page, page.getByRole("table", { name: "Cart items" }));
  }

  private rowFor(productName: string): Locator {
    return this.table.rowByText(productName);
  }

  stepperFor(productName: string): QuantityStepperComponent {
    return new QuantityStepperComponent(this.page, this.rowFor(productName));
  }

  async goto(): Promise<void> {
    await this.gotoPath(this.screen.pathname + "/");
    await this.expectScreen();
  }

  async expectEmpty(): Promise<void> {
    await expect(this.page.locator("#empty-cart-message")).toBeVisible();
  }

  async expectLineVisible(productName: string): Promise<void> {
    await this.table.expectRowVisible(productName);
  }

  async expectLineUnitPrice(productName: string, price: string): Promise<void> {
    const row = this.rowFor(productName);
    await expect(row.locator("td").nth(1)).toHaveText(price);
  }

  async expectLineNotVisible(productName: string): Promise<void> {
    await this.table.expectRowNotVisible(productName);
  }

  async expectLineQuantity(productName: string, qty: number): Promise<void> {
    await this.stepperFor(productName).expectQuantity(qty);
  }

  async incrementLine(productName: string, times = 1): Promise<void> {
    await this.stepperFor(productName).increment(times);
  }

  async decrementLine(productName: string, times = 1): Promise<void> {
    await this.stepperFor(productName).decrement(times);
  }

  async removeLine(productName: string): Promise<void> {
    await this.rowFor(productName).getByRole("button", { name: `Remove ${productName}` }).click();
  }

  async expectTotal(amount: string): Promise<void> {
    await expect(this.page.getByTestId("cart-total")).toHaveText(amount);
  }

  async proceedToCheckout(): Promise<void> {
    await this.page.getByRole("button", { name: "Checkout" }).click();
  }

  async clear(): Promise<void> {
    await this.page.evaluate(() => {
      const store = (window as Window & { mockStore?: { cart: { clear: () => void } } }).mockStore;
      store?.cart.clear();
    });
  }
}
