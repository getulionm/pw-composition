import { expect, Page } from "@playwright/test";
import { BasePage } from "../shared/base.page";

/**
 * ADMIN-only creation surface; the tools table is {@link ViewToolsPage#grid}.
 */
export class CreateToolPage extends BasePage {
  readonly itemCreatedMessage = this.page.getByText("Item created, view it in the View tools page.");
  readonly userWorkspaceMessage = this.page.locator("#create-tool-user-message");

  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.createTool",
      pathname: "/control-center/create-tool",
      documentTitle: "Create tool",
    });
  }

  async goto() {
    await this.gotoPath("create-tool/");
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
