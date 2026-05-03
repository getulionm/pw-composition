import { expect, Locator, Page } from "@playwright/test";

type CellLookup = {
  row: string;
  column: string;
};

/**
 * Generic HTML table helper (rows, column headers, row actions, cells).
 *
 * This is the biggest reuse point for list/table surfaces.
 *
 * It should know table mechanics:
 * - find rows
 * - read columns
 * - click row actions
 * - assert cell values
 *
 * It should NOT know domain language.
 */
export class TableComponent {
  constructor(
    private readonly page: Page,
    private readonly root: Locator = page.getByRole("table")
  ) {}

  rowByText(rowText: string) {
    return this.root.getByRole("row").filter({ hasText: rowText });
  }

  columnHeader(columnName: string) {
    return this.root.getByRole("columnheader", { name: columnName });
  }

  async expectVisible() {
    await expect(this.root).toBeVisible();
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

  /**
   * Prefer accessible roles when the table supports them.
   * Otherwise add stable data-testid attributes to cells, e.g. `data-testid="table-cell-status"`.
   */
  async getCellText({ row, column }: CellLookup): Promise<string> {
    const targetRow = this.rowByText(row);
    const cell = targetRow.getByTestId(`table-cell-${normalise(column)}`);
    return (await cell.textContent())?.trim() ?? "";
  }
}

function normalise(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-");
}
