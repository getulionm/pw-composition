import { test as base } from "@playwright/test";
import { MEMBERSHIP_STORAGE_KEY, memberUser, type StoreUser } from "./user.model";
import { UserSession } from "./user-session";

export type UserFixtures = {
  userSession: UserSession;
};

export type UserOptions = {
  /**
   * Override per file or test: `test.use({ user: guestUser })`.
   * Defaults to member to match the mock app's historical default.
   */
  user: StoreUser;
};

/**
 * User injection layer — like a Playwright storageState/session fixture, but
 * backed by localStorage for the mock store. Real apps would swap this for
 * cookie seeding or an auth API helper in the same fixture slot.
 */
export const test = base.extend<UserFixtures, UserOptions>({
  user: [memberUser, { option: true, scope: "worker" }],

  page: async ({ page, user }, use) => {
    await page.addInitScript(
      ({ key, membership }: { key: string; membership: string }) => {
        localStorage.setItem(key, membership);
      },
      { key: MEMBERSHIP_STORAGE_KEY, membership: user.membership }
    );
    await use(page);
  },

  userSession: async ({ page }, use) => use(new UserSession(page)),
});
