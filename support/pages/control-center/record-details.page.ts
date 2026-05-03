import { Page, expect } from "@playwright/test";
import { BasePage } from "../shared/base.page";

export class RecordDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.recordDetails",
      pathname: "/control-center/records/example-record",
      urlMatch: "descendant",
      documentTitle: "Record",
    });
  }

  async expectLoaded(recordName: string) {
    await this.expectHeading(recordName);
    await this.expectScreen();
  }

  async expectStatus(status: string) {
    await expect(this.page.getByText(status)).toBeVisible();
  }
}
