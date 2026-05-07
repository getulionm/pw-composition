import { expect, Page } from "@playwright/test";
import { BasePage } from "../shared/base.page";
import { MastheadComponent } from "../shared/components/shell/masthead.component";
import { NavigationDrawerComponent } from "../shared/components/shell/navigation-drawer.component";

/**
 * ADMIN-only creation surface; the tools table is on {@link ViewToolsPage}.
 */
export class CreateToolPage extends BasePage {
  readonly masthead: MastheadComponent;
  readonly nav: NavigationDrawerComponent;
  readonly itemCreatedMessage = this.page.getByText("Item created, view it in the View tools page.");
  readonly userWorkspaceMessage = this.page.locator("#create-tool-user-message");

  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.createTool",
      pathname: "/control-center/create-tool",
      documentTitle: "Create tool",
    });
    this.masthead = new MastheadComponent(page);
    this.nav = new NavigationDrawerComponent(page);
  }

  private async expectHeading(name: string) {
    await expect(this.page.getByRole("heading", { name })).toBeVisible();
  }

  async goto() {
    await this.gotoPath(this.screen.pathname);
    await this.expectHeading("Create tool");
    await this.expectScreen();
  }

  async createItem() {
    await this.page.getByRole("button", { name: "Create Item" }).click();
  }

  async expectItemCreatedMessage() {
    await expect(this.itemCreatedMessage).toBeVisible();
  }

  async expectFunctionalityHidden() {
    await expect(this.userWorkspaceMessage).toBeVisible();
    await expect(this.page.getByRole("button", { name: "Create Item" })).toBeHidden();
  }
}
