import { expect, Locator, Page } from "@playwright/test";
import { BaseComponent } from "../../base.component";
import { componentPomMarker } from "../../pom-marker";

type CellLookup = {
  row: string;
  column: string;
};

export class TableComponent extends BaseComponent {
  constructor(
    page: Page,
    private readonly tableRoot: Locator = page.getByRole("table")
  ) {
    super(page, componentPomMarker("inner", "table"));
  }

  rowByText(rowText: string) {
    return this.tableRoot.getByRole("row").filter({ hasText: rowText });
  }

  columnHeader(columnName: string) {
    return this.tableRoot.getByRole("columnheader", { name: columnName });
  }

  async expectVisible() {
    await this.expectMarkerVisible();
    await expect(this.tableRoot).toBeVisible();
  }

  async expectColumnVisible(columnName: string) {
    await expect(this.columnHeader(columnName)).toBeVisible();
  }

  async expectRowVisible(rowText: string) {
    await expect(this.rowByText(rowText)).toBeVisible();
  }

  async expectRowNotVisible(rowText: string) {
    await expect(this.rowByText(rowText)).toHaveCount(0);
  }

  async expectRowContains(rowText: string, expectedValues: string[]) {
    const row = this.rowByText(rowText);
    for (const value of expectedValues) {
      await expect(row).toContainText(value);
    }
  }

  async clickRowAction(rowText: string, actionName: string) {
    await this.rowByText(rowText).getByRole("link", { name: actionName }).click();
  }

  async getCellText({ row, column }: CellLookup): Promise<string> {
    const targetRow = this.rowByText(row);
    const cell = targetRow.getByTestId(`table-cell-${normalise(column)}`);
    return (await cell.textContent())?.trim() ?? "";
  }
}

function normalise(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}
