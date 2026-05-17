import { expect, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../../framework/pom-marker";

/**
 * Shell-owned toast surface (global chrome, not a page widget). Any module may
 * call `window.mockStore.toast(...)`. DOM: `#toast-root` is fixed top-right below
 * the masthead; tests assert via this component.
 */
export class ToastComponent {
  readonly marker = componentPomMarker("shell", "toast");

  constructor(private readonly page: Page) {}

  async expectVisible(): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
  }

  async expectMessage(message: string | RegExp): Promise<void> {
    const root = this.page.locator(`[data-pom="${this.marker}"]`);
    await expect(root.getByRole("status").filter({ hasText: message })).toBeVisible();
  }
}
