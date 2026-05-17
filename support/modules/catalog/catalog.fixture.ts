import { test as base } from "@playwright/test";
import { CatalogPage } from "./pages/catalog.page";
import { ProductDetailPage } from "./pages/product-detail.page";
import { BrowseCatalogWorkflow } from "./workflows/browse-catalog.workflow";

export type CatalogFixtures = {
  catalogPage: CatalogPage;
  productDetailPage: ProductDetailPage;
  browseCatalogWorkflow: BrowseCatalogWorkflow;
};

/**
 * Catalog-team-owned fixture surface. Page fixtures are exposed so simple
 * specs can use them directly; the workflow fixture is the recommended
 * default for journey-style tests.
 */
export const test = base.extend<CatalogFixtures>({
  catalogPage: async ({ page }, use) => use(new CatalogPage(page)),
  productDetailPage: async ({ page }, use) => use(new ProductDetailPage(page)),
  browseCatalogWorkflow: async ({ page }, use) => use(new BrowseCatalogWorkflow(page)),
});
