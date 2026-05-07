import { Locator, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../pom-marker";

export class SearchBoxComponent {
  readonly marker = componentPomMarker("widgets", "searchBox");

  constructor(
    private readonly page: Page,
    private readonly placeholder = "Search..."
  ) {}

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
    await expectPomMarkerVisible(this.page, this.marker);
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
