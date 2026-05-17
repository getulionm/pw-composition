import { test } from "../../support/fixtures/app.fixture";

test.describe("Shell", () => {
  test("home shows member greeting, offers, and welcome modal", async ({ homePage }) => {
    await homePage.goto();
    await homePage.expectGreeting("MEMBER");
    await homePage.expectFeaturedProductOffers();
    await homePage.openWelcomeModal();
    await homePage.expectWelcomeModalGreeting("MEMBER");
  });

  test("home product cards show guest full price and member discounted price", async ({
    homePage,
    membershipWorkflow,
  }) => {
    await homePage.goto();
    await membershipWorkflow.switchToGuest();
    await homePage.featuredOffers.expectProductOfferGuestPrice("Acme Widget", "£10");
    await homePage.featuredOffers.expectProductOfferGuestPrice("Super Gizmo", "£6");
    await membershipWorkflow.switchToMember();
    await homePage.featuredOffers.expectProductOfferMemberPrice("Acme Widget", "£10", "£5");
    await homePage.featuredOffers.expectProductOfferMemberPrice("Super Gizmo", "£6", "£3");
  });

  test("collapse and expand the nav drawer", async ({ homePage, navDrawer }) => {
    await homePage.goto();
    await navDrawer.expectDrawerExpanded();
    await navDrawer.toggleDrawer();
    await navDrawer.expectDrawerCollapsed();
    await navDrawer.toggleDrawer();
    await navDrawer.expectDrawerExpanded();
  });
});
