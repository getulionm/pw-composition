import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "../../base.component";
import { componentPomMarker } from "../../pom-marker";

export class SearchBoxComponent extends BaseComponent {
  constructor(
    page: Page,
    private readonly placeholder = "Search..."
  ) {
    super(page, componentPomMarker("inner", "searchBox"));
  }

  get input() {
    return this.page.getByPlaceholder(this.placeholder);
  }

  get submitButton() {
    return this.page.getByRole("button", { name: "Search" });
  }

  get clearButton() {
    return this.page.getByRole("button", { name: "Clear" });
  }

  root(): Locator {
    return this.page.locator(`[data-pom="${this.marker}"]`);
  }

  async search(term: string) {
    await this.expectMarkerVisible();
    await this.input.fill(term);
    await this.submitButton.click();
  }

  async clear() {
    await this.input.clear();
  }

  async clickClear() {
    await this.clearButton.click();
  }
}
