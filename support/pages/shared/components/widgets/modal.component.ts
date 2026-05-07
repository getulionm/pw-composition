import { expect, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../pom-marker";

export class ModalComponent {
  readonly marker = componentPomMarker("widgets", "modal");

  constructor(private readonly page: Page) {}

  dialog(accessibleName: string) {
    return this.page.getByRole("dialog", { name: accessibleName });
  }

  async openViaButton(buttonName: string) {
    await this.page.getByRole("button", { name: buttonName }).click();
  }

  async expectDialogVisible(accessibleName: string) {
    await expectPomMarkerVisible(this.page, this.marker);
    await expect(this.dialog(accessibleName)).toBeVisible();
  }

  async closeDialog(accessibleName: string, closeButtonName: string = "Close") {
    await this.dialog(accessibleName).getByRole("button", { name: closeButtonName }).click();
  }
}
