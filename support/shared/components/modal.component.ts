import { expect, Locator, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../framework/pom-marker";

export class ModalComponent {
  readonly marker = componentPomMarker("widgets", "modal");

  constructor(private readonly page: Page) {}

  dialog(accessibleName: string): Locator {
    return this.page.getByRole("dialog", { name: accessibleName });
  }

  async openViaButton(buttonName: string): Promise<void> {
    await this.page.getByRole("button", { name: buttonName }).click();
  }

  async expectDialogVisible(accessibleName: string): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
    await expect(this.dialog(accessibleName)).toBeVisible();
  }

  async closeDialog(accessibleName: string, closeButtonName: string = "Close"): Promise<void> {
    await this.dialog(accessibleName).getByRole("button", { name: closeButtonName }).click();
  }
}
