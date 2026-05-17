import { expect, Page } from "@playwright/test";
import { BasePage } from "../../../framework/base.page";
import { ModalComponent } from "../../../shared/components/modal.component";
import { HeaderComponent, Membership } from "../components/header.component";
import { NavDrawerComponent } from "../components/nav-drawer.component";
import { FeaturedOffersComponent } from "../components/featured-offers.component";

/**
 * Shell-owned landing page. Composes header + nav + featured offers + welcome modal.
 */
export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly nav: NavDrawerComponent;
  readonly featuredOffers: FeaturedOffersComponent;
  readonly modal: ModalComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "store.home",
      pathname: "/",
      documentTitle: "Home",
    });
    this.header = new HeaderComponent(page);
    this.nav = new NavDrawerComponent(page);
    this.featuredOffers = new FeaturedOffersComponent(page);
    this.modal = new ModalComponent(page);
  }

  async goto(): Promise<void> {
    await this.gotoPath(this.screen.pathname);
    await this.expectScreen();
  }

  async expectGreeting(membership: Membership): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: `Welcome ${membership}` })
    ).toBeVisible();
  }

  async expectFeaturedProductOffers(): Promise<void> {
    await this.featuredOffers.expectVisible();
    await this.featuredOffers.expectProductOffer("Acme Widget");
    await this.featuredOffers.expectProductOffer("Super Gizmo");
  }

  async openWelcomeModal(): Promise<void> {
    await this.modal.openViaButton("Open welcome modal");
    await this.modal.expectDialogVisible("Welcome modal");
  }

  async expectWelcomeModalGreeting(membership: Membership): Promise<void> {
    await expect(
      this.modal
        .dialog("Welcome modal")
        .getByRole("heading", { level: 2, name: `Welcome ${membership}` })
    ).toBeVisible();
  }
}
