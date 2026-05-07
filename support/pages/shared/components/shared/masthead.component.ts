import { expect, Page } from "@playwright/test";
import { BaseComponent } from "../../base.component";
import { componentPomMarker } from "../../pom-marker";

/**
 * Shell masthead: brand, workspace switcher, and account menu.
 */
export class MastheadComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, componentPomMarker("shared", "masthead"));
  }

  accountMenuButton() {
    return this.page
      .getByRole("button", { name: "Admin menu", exact: true })
      .or(this.page.getByRole("button", { name: "User menu", exact: true }));
  }

  async expectVisible() {
    await this.expectMarkerVisible();
    await expect(this.page.getByRole("banner")).toBeVisible();
    await expect(this.page.getByRole("banner").getByText("MOCK SHELL")).toBeVisible();
  }

  async chooseWorkspace(mode: "ADMIN" | "USER") {
    await this.page.getByLabel("Workspace").selectOption(mode);
  }

  async expectWorkspace(mode: "ADMIN" | "USER") {
    await expect(this.page.locator("body")).toHaveAttribute("data-workspace", mode);
  }

  async openUserMenu() {
    await this.accountMenuButton().click();
  }

  async expectUserInMenu(name: string) {
    await expect(this.page.getByRole("menuitem", { name })).toBeVisible();
  }
}
