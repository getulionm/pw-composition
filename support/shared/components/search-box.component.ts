import { Locator, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../framework/pom-marker";

export class SearchBoxComponent {
  readonly marker = componentPomMarker("widgets", "searchBox");

  constructor(
    private readonly page: Page,
    private readonly placeholder = "Search..."
  ) {}

  get input(): Locator {
    return this.page.getByPlaceholder(this.placeholder);
  }

  get submitButton(): Locator {
    return this.page.getByRole("button", { name: "Search" });
  }

  get clearButton(): Locator {
    return this.page.getByRole("button", { name: "Clear" });
  }

  root(): Locator {
    return this.page.locator(`[data-pom="${this.marker}"]`);
  }

  async search(term: string): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
    await this.input.fill(term);
    await this.submitButton.click();
  }

  async clear(): Promise<void> {
    await this.input.clear();
  }

  async clickClear(): Promise<void> {
    await this.clearButton.click();
  }
}
