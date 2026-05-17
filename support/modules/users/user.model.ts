/**
 * Store user identity for tests. In production, map this to your auth model
 * (roles, account id, entitlements). Here we only model membership tier.
 */
export type MembershipTier = "MEMBER" | "GUEST";

export type StoreUser = {
  readonly membership: MembershipTier;
};

/** Must match `MEMBERSHIP_KEY` in mock-app/shared/mock-shell.js */
export const MEMBERSHIP_STORAGE_KEY = "mock-store-membership";

export const guestUser: StoreUser = { membership: "GUEST" };
export const memberUser: StoreUser = { membership: "MEMBER" };
