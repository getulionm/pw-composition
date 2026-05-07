import { expect, Page } from "@playwright/test";
import { BasePage } from "../shared/base.page";
import { MastheadComponent } from "../shared/components/shell/masthead.component";
import { NavigationDrawerComponent } from "../shared/components/shell/navigation-drawer.component";
import { TableComponent } from "../shared/components/widgets/table.component";

export class ViewToolsPage extends BasePage {
  readonly masthead: MastheadComponent;
  readonly nav: NavigationDrawerComponent;
  readonly builtToolsTable: TableComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.viewTools",
      pathname: "/control-center/view-tools",
      documentTitle: "View tools",
    });
    this.masthead = new MastheadComponent(page);
    this.nav = new NavigationDrawerComponent(page);
    this.builtToolsTable = new TableComponent(page, page.getByRole("table", { name: "Built tools" }));
  }

  private async expectHeading(name: string) {
    await expect(this.page.getByRole("heading", { name })).toBeVisible();
  }

  async goto() {
    await this.gotoPath(this.screen.pathname);
    await this.expectHeading("View tools");
    await this.expectScreen();
  }

  async expectBuiltToolsTableVisible() {
    await this.builtToolsTable.expectVisible();
  }

  /** Assert a row exists in the Built tools table (journey outcome). */
  async expectToolRowVisible(name: string) {
    await this.builtToolsTable.expectRowVisible(name);
  }
}
