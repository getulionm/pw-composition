import type { Page } from "@playwright/test";
import { CatalogPage } from "../pages/catalog.page";
import { ProductDetailPage, ProductSlug } from "../pages/product-detail.page";

/**
 * Catalog-team-owned journeys: browse, search, open product, add to cart.
 * Stays inside the catalog module + reads shell only via composition.
 */
export class BrowseCatalogWorkflow {
  readonly catalog: CatalogPage;
  readonly productDetail: ProductDetailPage;

  constructor(page: Page) {
    this.catalog = new CatalogPage(page);
    this.productDetail = new ProductDetailPage(page);
  }

  async openCatalog(): Promise<void> {
    await this.catalog.goto();
    await this.catalog.expectDefaultProducts();
  }

  async searchForProduct(query: string, expected: string, hidden: string): Promise<void> {
    await this.catalog.goto();
    await this.catalog.search(query);
    await this.catalog.expectProductListed(expected);
    await this.catalog.expectProductNotListed(hidden);
  }

  async clearSearchRestoresFullList(query: string): Promise<void> {
    await this.catalog.goto();
    await this.catalog.search(query);
    await this.catalog.clearSearch();
    await this.catalog.expectSearchInputEmpty();
    await this.catalog.expectDefaultProducts();
  }

  async openProductDetail(name: string, slug: ProductSlug): Promise<void> {
    await this.catalog.goto();
    await this.catalog.openProduct(name);
    await this.productDetail.expectLoaded(slug);
  }

  async addProductToCart(name: string, slug: ProductSlug): Promise<void> {
    await this.catalog.goto();
    await this.catalog.openProduct(name);
    await this.productDetail.expectLoaded(slug);
    await this.productDetail.addToCart();
  }
}
