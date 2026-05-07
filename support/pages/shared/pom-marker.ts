import { expect, Locator, Page } from "@playwright/test";

export type PomComponentType = "shell" | "widgets";

export function pagePomMarker(screenId: string): string {
  return `pages/${screenId}`;
}

export function componentPomMarker(type: PomComponentType, name: string): string {
  return `components/${type}/${name}`;
}

export function locatorByPom(page: Page, marker: string): Locator {
  return page.locator(`[data-pom="${marker}"]`);
}

export async function expectPomMarkerVisible(page: Page, marker: string): Promise<void> {
  await expect(locatorByPom(page, marker)).toBeVisible();
}
