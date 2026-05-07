import { Page, expect } from "@playwright/test";
import { BasePage } from "../shared/base.page";
import { MastheadComponent } from "../shared/components/shell/masthead.component";
import { NavigationDrawerComponent } from "../shared/components/shell/navigation-drawer.component";

export class RecordDetailsPage extends BasePage {
  readonly masthead: MastheadComponent;
  readonly nav: NavigationDrawerComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.recordDetails",
      pathname: "/control-center/records/example-record",
      urlMatch: "descendant",
      documentTitle: "Record",
    });
    this.masthead = new MastheadComponent(page);
    this.nav = new NavigationDrawerComponent(page);
  }

  private async expectHeading(name: string) {
    await expect(this.page.getByRole("heading", { name })).toBeVisible();
  }

  async expectLoaded(recordName: string) {
    await this.expectHeading(recordName);
    await this.expectScreen();
  }

  async expectStatus(status: string) {
    await expect(this.page.getByText(status)).toBeVisible();
  }
}
