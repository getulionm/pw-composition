import { expect, Page } from "@playwright/test";
import { BasePage } from "../../../framework/base.page";
import { HeaderComponent } from "../../shell/components/header.component";
import { NavDrawerComponent } from "../../shell/components/nav-drawer.component";

export type CheckoutDetails = {
  fullName: string;
  address: string;
  cardNumber: string;
  saveCard?: boolean;
};

export class CheckoutPage extends BasePage {
  readonly header: HeaderComponent;
  readonly nav: NavDrawerComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "store.checkout",
      pathname: "/checkout",
      documentTitle: "Checkout",
    });
    this.header = new HeaderComponent(page);
    this.nav = new NavDrawerComponent(page);
  }

  async goto(): Promise<void> {
    await this.gotoPath(this.screen.pathname + "/");
    await this.expectScreen();
  }

  async fillDetails(details: CheckoutDetails): Promise<void> {
    await this.page.getByLabel("Full name").fill(details.fullName);
    await this.page.getByLabel("Address").fill(details.address);
    await this.page.getByLabel("Card number").fill(details.cardNumber);
    if (details.saveCard) {
      await this.page.getByLabel("Save card for later").check();
    }
  }

  async placeOrder(): Promise<void> {
    await this.page.getByRole("button", { name: "Place order" }).click();
  }

  async expectSaveCardLocked(): Promise<void> {
    await expect(this.page.getByLabel("Save card for later")).toBeDisabled();
  }

  async expectSaveCardUnlocked(): Promise<void> {
    await expect(this.page.getByLabel("Save card for later")).toBeEnabled();
  }
}
