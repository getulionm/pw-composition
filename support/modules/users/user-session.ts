import { expect, type Page } from "@playwright/test";
import { MEMBERSHIP_STORAGE_KEY, type StoreUser } from "./user.model";

/**
 * Assert and inspect the active user in the browser.
 * Bootstrapping (localStorage seed) is handled by the `user` fixture — see users.fixture.ts.
 */
export class UserSession {
  constructor(private readonly page: Page) {}

  async expectActive(user: StoreUser): Promise<void> {
    await expect(this.page.locator("body")).toHaveAttribute(
      "data-membership",
      user.membership
    );
  }

  async expectPersisted(user: StoreUser): Promise<void> {
    const stored = await this.page.evaluate(
      (key) => localStorage.getItem(key),
      MEMBERSHIP_STORAGE_KEY
    );
    expect(stored).toBe(user.membership);
  }
}
