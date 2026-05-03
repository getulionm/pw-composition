import { expect, Page } from "@playwright/test";

/**
 * Shell masthead: brand, **ADMIN** / **USER** workspace control, account menu + dropdown.
 * Menu button reads **Admin menu** or **User menu** with the workspace selection.
 */
export class MastheadComponent {
  constructor(private readonly page: Page) {}

  readonly root = this.page.getByRole("banner");

  accountMenuButton() {
    return this.page
      .getByRole("button", { name: "Admin menu", exact: true })
      .or(this.page.getByRole("button", { name: "User menu", exact: true }));
  }

  async expectVisible() {
    await expect(this.root).toBeVisible();
    await expect(this.root.getByText("MOCK SHELL")).toBeVisible();
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
