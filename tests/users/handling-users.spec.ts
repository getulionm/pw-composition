import { test, expect } from "../../support/fixtures/app.fixture";
import { guestUser, memberUser } from "../../support/modules/users/user.model";

/**
 * Teaching spec: every journey should declare *which user* it starts with.
 * Injection runs automatically via the `user` fixture (localStorage seed).
 * Mid-journey tier changes still go through shell UI (membershipWorkflow).
 */
test.use({ user: guestUser });

test.describe("Handling users", () => {
  test("starts as a guest and can become a member", async ({
    user,
    userSession,
    homePage,
    membershipWorkflow,
  }) => {
    expect(user).toEqual(guestUser);

    await homePage.goto();
    await userSession.expectActive(guestUser);
    await userSession.expectPersisted(guestUser);
    await homePage.expectGreeting("GUEST");

    await membershipWorkflow.switchToMember();
    await userSession.expectActive(memberUser);
    await userSession.expectPersisted(memberUser);
    await homePage.expectGreeting("MEMBER");
  });
});
