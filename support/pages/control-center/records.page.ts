import { expect, Page } from "@playwright/test";
import { BasePage } from "../shared/base.page";
import { TableComponent } from "../shared/components/table.component";
import { SearchBoxComponent } from "../shared/components/search-box.component";

export class RecordsPage extends BasePage {
  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.records",
      pathname: "/control-center/records",
      documentTitle: "Records",
    });
  }

  private searchBox() {
    return new SearchBoxComponent(this.page);
  }

  private table() {
    return new TableComponent(this.page);
  }

  async goto() {
    await this.gotoPath("records/");
    await this.expectHeading("Records");
    await this.expectScreen();
  }

  async searchRecords(query: string) {
    await this.searchBox().search(query);
  }

  async expectRowVisible(rowText: string) {
    await this.table().expectRowVisible(rowText);
  }

  async expectRowNotVisible(rowText: string) {
    await this.table().expectRowNotVisible(rowText);
  }

  async clickViewOnRecord(recordName: string) {
    await this.table().clickRowAction(recordName, "View");
  }

  async expectSearchInputEmpty() {
    await expect(this.searchBox().input).toHaveValue("");
  }

  async openRecord(name: string) {
    await this.searchBox().search(name);
    await this.table().clickRowAction(name, "View");
  }

  async createRecord() {
    await this.page.getByRole("button", { name: "Create Record" }).click();
  }

  async expectDefaultTwoRecords() {
    await this.table().expectRowVisible("Example Record 1");
    await this.table().expectRowVisible("Example Record 2");
  }

  async clearRecordSearch() {
    await this.searchBox().clickClear();
  }
}
