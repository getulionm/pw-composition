import { expect, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../../framework/pom-marker";

/**
 * Left navigation drawer: Home, Catalog, Cart links and the collapse/expand rail.
 */
export class NavDrawerComponent {
  readonly marker = componentPomMarker("shell", "navDrawer");

  constructor(private readonly page: Page) {}

  async expectVisible(): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
  }

  async openLink(linkName: string): Promise<void> {
    await this.page.getByRole("link", { name: linkName, exact: true }).click();
  }

  async toggleDrawer(): Promise<void> {
    await this.page
      .getByRole("button", { name: "Collapse menu", exact: true })
      .or(this.page.getByRole("button", { name: "Expand menu", exact: true }))
      .click();
  }

  async expectDrawerCollapsed(): Promise<void> {
    await expect(this.page.locator("#app-layout")).toHaveClass(/nav-collapsed/);
  }

  async expectDrawerExpanded(): Promise<void> {
    await expect(this.page.locator("#app-layout")).not.toHaveClass(/nav-collapsed/);
  }
}
