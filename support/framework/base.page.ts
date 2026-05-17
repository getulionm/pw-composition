import { expect, Page } from "@playwright/test";
import { expectPomMarkerVisible, pagePomMarker } from "./pom-marker";

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed.length === 0 ? "/" : trimmed;
}

/**
 * Declared once per page class. Used for logs, journey labels, and the
 * standard `expectScreen` (marker + URL + title) assertion.
 */
export type PageScreenMeta = {
  /** Stable key matching the page file stem, e.g. `store.catalog` for `catalog.page.ts`. */
  screenId: string;
  /** Expected URL pathname (leading slash). Trailing slash ignored. */
  pathname: string;
  /** `exact` = pathname equals `pathname`; `descendant` = equals or extends with another segment. */
  urlMatch?: "exact" | "descendant";
  /** If set, `expectDocumentTitle()` asserts `page.title()` (exact string). */
  documentTitle?: string;
};

/**
 * The only inheritable class in the framework. Pages extend BasePage and
 * compose components in their constructor. Workflows are plain classes
 * that compose pages — they do NOT extend anything.
 */
export class BasePage {
  constructor(
    protected readonly page: Page,
    readonly screen: PageScreenMeta
  ) {}

  get marker(): string {
    return pagePomMarker(this.screen.screenId);
  }

  async gotoPath(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async expectUrl(): Promise<void> {
    const want = normalizePathname(this.screen.pathname);
    const mode = this.screen.urlMatch ?? "exact";
    await expect(this.page).toHaveURL((url) => {
      const got = normalizePathname(new URL(url).pathname);
      if (mode === "descendant") {
        return got === want || got.startsWith(`${want}/`);
      }
      return got === want;
    });
  }

  async expectDocumentTitle(): Promise<void> {
    const t = this.screen.documentTitle;
    if (t === undefined) return;
    await expect(this.page).toHaveTitle(t);
  }

  /** Marker + URL + title (when configured). */
  async expectScreen(): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
    await this.expectUrl();
    await this.expectDocumentTitle();
  }
}
