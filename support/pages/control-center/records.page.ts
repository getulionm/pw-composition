import { expect, Page } from "@playwright/test";
import { BasePage } from "../shared/base.page";
import { MastheadComponent } from "../shared/components/shell/masthead.component";
import { NavigationDrawerComponent } from "../shared/components/shell/navigation-drawer.component";
import { SearchBoxComponent } from "../shared/components/widgets/search-box.component";
import { TableComponent } from "../shared/components/widgets/table.component";

export class RecordsPage extends BasePage {
  readonly masthead: MastheadComponent;
  readonly nav: NavigationDrawerComponent;
  readonly searchBox: SearchBoxComponent;
  readonly table: TableComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.records",
      pathname: "/control-center/records",
      documentTitle: "Records",
    });
    this.masthead = new MastheadComponent(page);
    this.nav = new NavigationDrawerComponent(page);
    this.searchBox = new SearchBoxComponent(page);
    this.table = new TableComponent(page);
  }

  private async expectHeading(name: string) {
    await expect(this.page.getByRole("heading", { name })).toBeVisible();
  }

  async goto() {
    await this.gotoPath(this.screen.pathname);
    await this.expectHeading("Records");
    await this.expectScreen();
  }

  async searchRecords(query: string) {
    await this.searchBox.search(query);
  }

  async expectRowVisible(rowText: string) {
    await this.table.expectRowVisible(rowText);
  }

  async expectRowNotVisible(rowText: string) {
    await this.table.expectRowNotVisible(rowText);
  }

  async clickViewOnRecord(recordName: string) {
    await this.table.clickRowAction(recordName, "View");
  }

  async expectSearchInputEmpty() {
    await expect(this.searchBox.input).toHaveValue("");
  }

  async openRecord(name: string) {
    await this.searchBox.search(name);
    await this.table.clickRowAction(name, "View");
  }

  async createRecord() {
    await this.page.getByRole("button", { name: "Create Record" }).click();
  }

  async expectDefaultTwoRecords() {
    await this.table.expectRowVisible("Example Record 1");
    await this.table.expectRowVisible("Example Record 2");
  }

  async clearRecordSearch() {
    await this.searchBox.clickClear();
  }
}
