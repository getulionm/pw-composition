import { expect, Page } from "@playwright/test";

/**
 * Generic `role="dialog"` helper: locate by accessible name, open via a trigger button, close via an action in the dialog.
 */
export class ModalComponent {
  constructor(private readonly page: Page) {}

  dialog(accessibleName: string) {
    return this.page.getByRole("dialog", { name: accessibleName });
  }

  async openViaButton(buttonName: string) {
    await this.page.getByRole("button", { name: buttonName }).click();
  }

  async expectDialogVisible(accessibleName: string) {
    await expect(this.dialog(accessibleName)).toBeVisible();
  }

  async closeDialog(accessibleName: string, closeButtonName: string = "Close") {
    await this.dialog(accessibleName).getByRole("button", { name: closeButtonName }).click();
  }
}
