import { expect, Locator, Page } from "@playwright/test";
import { componentPomMarker } from "../../framework/pom-marker";

/**
 * +/- quantity stepper. Multiple instances may exist on a page (one per row);
 * scope each instance with a container Locator (e.g. a cart line row).
 */
export class QuantityStepperComponent {
  readonly marker = componentPomMarker("widgets", "quantityStepper");

  constructor(
    private readonly page: Page,
    private readonly container: Locator
  ) {}

  private get root(): Locator {
    return this.container.locator(`[data-pom="${this.marker}"]`);
  }

  private get value(): Locator {
    return this.root.getByTestId("qty-value");
  }

  async expectQuantity(qty: number): Promise<void> {
    await expect(this.value).toHaveText(String(qty));
  }

  async increment(times = 1): Promise<void> {
    const btn = this.root.locator("button.qty-increment");
    for (let i = 0; i < times; i++) await btn.click();
  }

  async decrement(times = 1): Promise<void> {
    const btn = this.root.locator("button.qty-decrement");
    for (let i = 0; i < times; i++) await btn.click();
  }

  async readQuantity(): Promise<number> {
    const text = (await this.value.textContent())?.trim() ?? "0";
    return Number(text);
  }
}
