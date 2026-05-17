import { expect, Locator, Page } from "@playwright/test";
import { componentPomMarker, expectPomMarkerVisible } from "../../framework/pom-marker";

export type TableCellLookup = {
  row: string;
  column: string;
};

/**
 * Generic table widget. Pass a specific tableRoot Locator when the page has
 * multiple tables (e.g. a labelled cart table vs an unlabelled catalog table).
 */
export class TableComponent {
  readonly marker = componentPomMarker("widgets", "table");

  constructor(
    private readonly page: Page,
    private readonly tableRoot: Locator = page.getByRole("table")
  ) {}

  rowByText(rowText: string): Locator {
    return this.tableRoot.getByRole("row").filter({ hasText: rowText });
  }

  columnHeader(columnName: string): Locator {
    return this.tableRoot.getByRole("columnheader", { name: columnName });
  }

  async expectVisible(): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
    await expect(this.tableRoot).toBeVisible();
  }

  async expectColumnVisible(columnName: string): Promise<void> {
    await expect(this.columnHeader(columnName)).toBeVisible();
  }

  async expectRowVisible(rowText: string): Promise<void> {
    await expect(this.rowByText(rowText)).toBeVisible();
  }

  async expectRowNotVisible(rowText: string): Promise<void> {
    await expect(this.rowByText(rowText)).toHaveCount(0);
  }

  async expectRowContains(rowText: string, expectedValues: string[]): Promise<void> {
    const row = this.rowByText(rowText);
    for (const value of expectedValues) {
      await expect(row).toContainText(value);
    }
  }

  async clickRowAction(rowText: string, actionName: string): Promise<void> {
    await this.rowByText(rowText).getByRole("link", { name: actionName }).click();
  }

  async clickRowButton(rowText: string, buttonName: string): Promise<void> {
    await this.rowByText(rowText).getByRole("button", { name: buttonName }).click();
  }

  cell({ row, column }: TableCellLookup): Locator {
    return this.rowByText(row).getByTestId(`table-cell-${normalise(column)}`);
  }

  async expectCellText({ row, column }: TableCellLookup, text: string): Promise<void> {
    await expect(this.cell({ row, column })).toHaveText(text);
  }

  async getCellText(lookup: TableCellLookup): Promise<string> {
    return (await this.cell(lookup).textContent())?.trim() ?? "";
  }
}

function normalise(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "-");
}
