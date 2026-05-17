import { expect, Locator, Page } from "@playwright/test";
import { componentPomMarker } from "../../framework/pom-marker";

/**
 * Teaser card for a single product (image placeholder + title link).
 * Multiple instances may share this marker on one page (e.g. home featured row).
 */
export class ProductCardComponent {
  readonly marker = componentPomMarker("widgets", "productCard");

  constructor(
    private readonly page: Page,
    private readonly productName: string
  ) {}

  root(): Locator {
    return this.page.locator(`[data-pom="${this.marker}"]`).filter({ hasText: this.productName });
  }

  price(): Locator {
    return this.root().locator(".featured-card__price");
  }

  async expectVisible(): Promise<void> {
    await expect(this.root()).toBeVisible();
    await expect(this.root().getByText(this.productName)).toBeVisible();
  }

  async expectGuestPrice(price: string): Promise<void> {
    await expect(this.price()).toHaveText(price);
  }

  async expectMemberPrice(fullPrice: string, memberPrice: string): Promise<void> {
    const host = this.price();
    await expect(host.locator(".price-was s")).toHaveText(fullPrice);
    await expect(host.locator(".price-now")).toHaveText(memberPrice);
  }

  async open(): Promise<void> {
    await this.root().click();
  }
}
