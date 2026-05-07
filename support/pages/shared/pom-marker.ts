import { expect, Locator, Page } from "@playwright/test";

export type PomComponentType = "shared" | "inner";

export function pagePomMarker(screenId: string): string {
  return `page:${screenId}`;
}

export function componentPomMarker(type: PomComponentType, name: string): string {
  return `component:${type}:${name}`;
}

export function locatorByPom(page: Page, marker: string): Locator {
  return page.locator(`[data-pom="${marker}"]`);
}

export async function expectPomMarkerVisible(page: Page, marker: string): Promise<void> {
  await expect(locatorByPom(page, marker)).toBeVisible();
}
