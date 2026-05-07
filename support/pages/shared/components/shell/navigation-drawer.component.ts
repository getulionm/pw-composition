import { expect, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../pom-marker";

/**
 * Left navigation drawer: Home, Records, and Tools flyout links.
 */
export class NavigationDrawerComponent {
  readonly marker = componentPomMarker("shell", "navigationDrawer");

  constructor(private readonly page: Page) {}

  toolsMenuButton() {
    return this.page.getByRole("button", { name: "Tools menu" });
  }

  createToolNavLink() {
    return this.page.getByRole("link", { name: "Create tool", exact: true });
  }

  createToolNavLockIcon() {
    return this.page.locator(".tools-nav-row--create .create-tool-lock-icon");
  }

  async ensureToolsMenuOpen() {
    const btn = this.toolsMenuButton();
    if ((await btn.getAttribute("aria-expanded")) === "false") {
      await btn.click();
    }
  }

  async openLink(linkName: string) {
    await this.page.getByRole("link", { name: linkName }).click();
  }

  async openViewToolsFromMenu() {
    await this.ensureToolsMenuOpen();
    await this.openLink("View tools");
  }

  async openCreateToolFromMenu() {
    await this.ensureToolsMenuOpen();
    await this.createToolNavLink().click();
  }

  async toggleMainNavDrawer() {
    await this.page
      .getByRole("button", { name: "Collapse menu", exact: true })
      .or(this.page.getByRole("button", { name: "Expand menu", exact: true }))
      .click();
  }

  async expectCreateToolNavLocked() {
    await expectPomMarkerVisible(this.page, this.marker);
    const link = this.createToolNavLink();
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link).toHaveAttribute("class", expect.stringContaining("nav-link-locked"));
    await expect(this.createToolNavLockIcon()).toBeVisible();
  }

  async expectCreateToolNavUnlocked() {
    await expectPomMarkerVisible(this.page, this.marker);
    await expect(this.createToolNavLink()).not.toHaveAttribute("aria-disabled", "true");
  }
}
