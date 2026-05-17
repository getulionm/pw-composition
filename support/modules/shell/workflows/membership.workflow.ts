import type { Page } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { HeaderComponent, Membership } from "../components/header.component";

/**
 * Switch the active membership entitlement (MEMBER / GUEST) from the shell masthead.
 */
export class MembershipWorkflow {
  readonly home: HomePage;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    this.home = new HomePage(page);
    this.header = new HeaderComponent(page);
  }

  async switchTo(membership: Membership): Promise<void> {
    await this.header.chooseMembership(membership);
    await this.header.expectMembership(membership);
  }

  async switchToMember(): Promise<void> {
    await this.switchTo("MEMBER");
  }

  async switchToGuest(): Promise<void> {
    await this.switchTo("GUEST");
  }
}
