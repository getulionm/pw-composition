import { Page } from "@playwright/test";

export class SearchBoxComponent {
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

  async search(term: string) {
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
