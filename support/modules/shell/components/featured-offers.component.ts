import { expect, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../../framework/pom-marker";
import { ProductCardComponent } from "../../../shared/components/product-card.component";

/**
 * Home featured row: a grid of product teaser cards.
 */
export class FeaturedOffersComponent {
  readonly marker = componentPomMarker("widgets", "featuredOffers");

  constructor(private readonly page: Page) {}

  async expectVisible(): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
    await expect(this.page.getByRole("heading", { name: "Product offers: Members only" })).toBeVisible();
  }

  productCard(productName: string): ProductCardComponent {
    return new ProductCardComponent(this.page, productName);
  }

  async expectProductOffer(productName: string): Promise<void> {
    await this.productCard(productName).expectVisible();
  }

  async expectProductOfferGuestPrice(productName: string, price: string): Promise<void> {
    await this.productCard(productName).expectGuestPrice(price);
  }

  async expectProductOfferMemberPrice(
    productName: string,
    fullPrice: string,
    memberPrice: string
  ): Promise<void> {
    await this.productCard(productName).expectMemberPrice(fullPrice, memberPrice);
  }
}
