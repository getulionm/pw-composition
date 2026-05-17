import { expect, Locator, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../../framework/pom-marker";

export type Membership = "MEMBER" | "GUEST";

/**
 * Shell header: brand, membership switcher, cart link with badge, account menu.
 */
export class HeaderComponent {
  readonly marker = componentPomMarker("shell", "header");

  constructor(private readonly page: Page) {}

  accountMenuButton(): Locator {
    return this.page
      .getByRole("button", { name: "Member menu", exact: true })
      .or(this.page.getByRole("button", { name: "Guest menu", exact: true }));
  }

  cartLink(): Locator {
    return this.page.getByRole("link", { name: /^Cart\b/, exact: false });
  }

  cartBadge(): Locator {
    return this.page.locator("#cart-badge");
  }

  async expectVisible(): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
    await expect(this.page.getByRole("banner")).toBeVisible();
    await expect(this.page.getByRole("banner").getByText("MOCK STORE")).toBeVisible();
  }

  async chooseMembership(membership: Membership): Promise<void> {
    await this.page.getByLabel("Membership").selectOption(membership);
  }

  async expectMembership(membership: Membership): Promise<void> {
    await expect(this.page.locator("body")).toHaveAttribute("data-membership", membership);
  }

  async openCart(): Promise<void> {
    await this.cartLink().click();
  }

  async expectCartCount(count: number): Promise<void> {
    await expect(this.cartBadge()).toHaveAttribute("data-cart-count", String(count));
  }

  async openUserMenu(): Promise<void> {
    await this.accountMenuButton().click();
  }

  async expectUserInMenu(name: string): Promise<void> {
    await expect(this.page.getByRole("menuitem", { name })).toBeVisible();
  }
}
