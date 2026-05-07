import { expect, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../pom-marker";

/**
 * Shell masthead: brand, workspace switcher, and account menu.
 */
export class MastheadComponent {
  readonly marker = componentPomMarker("shell", "masthead");

  constructor(private readonly page: Page) {}

  accountMenuButton() {
    return this.page
      .getByRole("button", { name: "Admin menu", exact: true })
      .or(this.page.getByRole("button", { name: "User menu", exact: true }));
  }

  async expectVisible() {
    await expectPomMarkerVisible(this.page, this.marker);
    await expect(this.page.getByRole("banner")).toBeVisible();
    await expect(this.page.getByRole("banner").getByText("CONTROL CENTER")).toBeVisible();
  }

  async chooseWorkspace(mode: "ADMIN" | "USER") {
    await this.page.getByLabel("Workspace").selectOption(mode);
  }

  async switchToUser() {
    await this.chooseWorkspace("USER");
  }

  async switchToAdmin() {
    await this.chooseWorkspace("ADMIN");
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
