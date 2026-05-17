import { expect, Page } from "@playwright/test";
import { BasePage } from "../../../framework/base.page";
import { HeaderComponent } from "../../shell/components/header.component";
import { NavDrawerComponent } from "../../shell/components/nav-drawer.component";

export type ProductSlug = "acme-widget" | "super-gizmo";

const PRODUCT_TITLES: Record<ProductSlug, string> = {
  "acme-widget": "Acme Widget",
  "super-gizmo": "Super Gizmo",
};

export class ProductDetailPage extends BasePage {
  readonly header: HeaderComponent;
  readonly nav: NavDrawerComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "store.product-detail",
      pathname: "/catalog/products",
      urlMatch: "descendant",
      documentTitle: "Product detail",
    });
    this.header = new HeaderComponent(page);
    this.nav = new NavDrawerComponent(page);
  }

  async goto(slug: ProductSlug): Promise<void> {
    await this.gotoPath(`/catalog/products/${slug}/`);
    await this.expectLoaded(slug);
  }

  async expectLoaded(slug: ProductSlug): Promise<void> {
    await expect(this.page).toHaveTitle(PRODUCT_TITLES[slug]);
    await expect(this.page.getByRole("heading", { name: PRODUCT_TITLES[slug] })).toBeVisible();
    await this.expectUrl();
  }

  private priceHost() {
    return this.page.getByTestId("product-price");
  }

  async expectGuestPrice(price: string): Promise<void> {
    await expect(this.priceHost()).toHaveText(price);
  }

  async expectMemberPrice(fullPrice: string, memberPrice: string): Promise<void> {
    const host = this.priceHost();
    await expect(host.locator(".price-was s")).toHaveText(fullPrice);
    await expect(host.locator(".price-now")).toHaveText(memberPrice);
  }

  async addToCart(): Promise<void> {
    await this.page.getByRole("button", { name: "Add to cart" }).click();
  }
}
