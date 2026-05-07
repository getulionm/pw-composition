import { expect, Page } from "@playwright/test";
import { expectPomMarkerVisible, pagePomMarker } from "./pom-marker";

function normalizePathname(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed.length === 0 ? "/" : trimmed;
}

/**
 * Declared once per page class — useful for logs, journey labels, annotations, and guard checks.
 * (Teaching pattern only; keep values aligned with `mock-app/` routes and `<title>`.)
 */
export type PageScreenMeta = {
  /** Stable key, e.g. `controlCenter.records` — safe for metrics / traces */
  screenId: string;
  /**
   * Expected URL pathname (leading slash). Trailing slash is ignored.
   * Use `urlMatch: "descendant"` when this screen lives under a path prefix (e.g. record details).
   */
  pathname: string;
  /** `exact` = pathname equals `pathname`; `descendant` = equals or extends with another segment */
  urlMatch?: "exact" | "descendant";
  /** If set, `expectDocumentTitle()` asserts `page.title()` (exact string; align with mock `<title>`). */
  documentTitle?: string;
};

/**
 * Thin base only — see README (Composition).
 *
 * Every full-route page passes **`screen`** into `super()` so callers can read
 * `screenId`, assert URL/title, or log `currentUrl` without duplicating strings across methods.
 */
export class BasePage {
  constructor(
    protected readonly page: Page,
    readonly screen: PageScreenMeta
  ) {}

  get marker(): string {
    return pagePomMarker(this.screen.screenId);
  }

  /** Live browser URL (after redirects). */
  get currentUrl(): string {
    return this.page.url();
  }

  async gotoPath(path: string) {
    await this.page.goto(path);
  }

  async expectHeading(name: string) {
    await expect(this.page.getByRole("heading", { name })).toBeVisible();
  }

  /** Pathname matches this page’s declared `pathname`. */
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

  /** Optional one-liner after `goto()` + heading: URL + title when configured. */
  async expectScreen(): Promise<void> {
    await expectPomMarkerVisible(this.page, this.marker);
    await this.expectUrl();
    await this.expectDocumentTitle();
  }
}
