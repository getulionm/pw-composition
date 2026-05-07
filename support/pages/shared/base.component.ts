import { Locator, Page } from "@playwright/test";
import { expectPomMarkerVisible, locatorByPom } from "./pom-marker";

export abstract class BaseComponent {
  constructor(
    protected readonly page: Page,
    readonly marker: string
  ) {}

  root(): Locator {
    return locatorByPom(this.page, this.marker);
  }

  async expectMarkerVisible(): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
  }
}
