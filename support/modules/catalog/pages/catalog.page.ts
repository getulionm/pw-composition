import { expect, Page } from "@playwright/test";
import { BasePage } from "../../../framework/base.page";
import { SearchBoxComponent } from "../../../shared/components/search-box.component";
import { TableComponent } from "../../../shared/components/table.component";
import { HeaderComponent } from "../../shell/components/header.component";
import { NavDrawerComponent } from "../../shell/components/nav-drawer.component";

export class CatalogPage extends BasePage {
  readonly header: HeaderComponent;
  readonly nav: NavDrawerComponent;
  readonly searchBox: SearchBoxComponent;
  readonly table: TableComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "store.catalog",
      pathname: "/catalog",
      documentTitle: "Catalog",
    });
    this.header = new HeaderComponent(page);
    this.nav = new NavDrawerComponent(page);
    this.searchBox = new SearchBoxComponent(page);
    this.table = new TableComponent(page, page.getByRole("table", { name: "Products" }));
  }

  async goto(): Promise<void> {
    await this.gotoPath(this.screen.pathname + "/");
    await this.expectScreen();
    await this.table.expectVisible();
  }

  async search(query: string): Promise<void> {
    await this.searchBox.search(query);
  }

  async clearSearch(): Promise<void> {
    await this.searchBox.clickClear();
  }

  async expectSearchInputEmpty(): Promise<void> {
    await expect(this.searchBox.input).toHaveValue("");
  }

  async expectProductListed(name: string): Promise<void> {
    await this.table.expectRowVisible(name);
  }

  async expectProductNotListed(name: string): Promise<void> {
    await this.table.expectRowNotVisible(name);
  }

  async expectDefaultProducts(): Promise<void> {
    await this.expectProductListed("Acme Widget");
    await this.expectProductListed("Super Gizmo");
  }

  async openProduct(name: string): Promise<void> {
    await this.table.clickRowAction(name, "View");
  }

  private priceCellFor(productName: string) {
    return this.table.rowByText(productName).locator("td.catalog-price-cell");
  }

  async expectGuestPriceFor(productName: string, price: string): Promise<void> {
    await expect(this.priceCellFor(productName)).toHaveText(price);
  }

  async expectMemberPriceFor(productName: string, fullPrice: string, memberPrice: string): Promise<void> {
    const cell = this.priceCellFor(productName);
    await expect(cell.locator(".price-was s")).toHaveText(fullPrice);
    await expect(cell.locator(".price-now")).toHaveText(memberPrice);
  }
}
