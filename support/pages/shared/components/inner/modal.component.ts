import { expect, Page } from "@playwright/test";
import { BaseComponent } from "../../base.component";
import { componentPomMarker } from "../../pom-marker";

export class ModalComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, componentPomMarker("inner", "modal"));
  }

  dialog(accessibleName: string) {
    return this.page.getByRole("dialog", { name: accessibleName });
  }

  async openViaButton(buttonName: string) {
    await this.page.getByRole("button", { name: buttonName }).click();
  }

  async expectDialogVisible(accessibleName: string) {
    await this.expectMarkerVisible();
    await expect(this.dialog(accessibleName)).toBeVisible();
  }

  async closeDialog(accessibleName: string, closeButtonName: string = "Close") {
    await this.dialog(accessibleName).getByRole("button", { name: closeButtonName }).click();
  }
}
