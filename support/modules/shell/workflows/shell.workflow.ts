import type { Page } from "@playwright/test";
import { HomePage } from "../pages/home.page";

/**
 * Shell-owned journeys: landing, modal, drawer navigation. Cross-module
 * orchestration is composed in tests, not inside this workflow.
 */
export class ShellWorkflow {
  readonly home: HomePage;

  constructor(page: Page) {
    this.home = new HomePage(page);
  }

  async openHome(): Promise<void> {
    await this.home.goto();
  }

  /** Caller should already be on home (e.g. after `openHome()`). */
  async openWelcomeModal(): Promise<void> {
    await this.home.openWelcomeModal();
  }
}
