import { Page } from "@playwright/test";
import { BasePage } from "../shared/base.page";
import { TableComponent } from "../shared/components/inner/table.component";

export class ViewToolsPage extends BasePage {
  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.viewTools",
      pathname: "/control-center/view-tools",
      documentTitle: "View tools",
    });
  }

  private table() {
    return new TableComponent(this.page, this.page.getByRole("table", { name: "Built tools" }));
  }

  async goto() {
    await this.gotoPath("view-tools/");
    await this.expectHeading("View tools");
    await this.expectScreen();
  }

  async expectBuiltToolsTableVisible() {
    await this.table().expectVisible();
  }
}
