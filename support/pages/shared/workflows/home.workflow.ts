import type { Page } from "@playwright/test";
import { HomePage } from "../../control-center/home.page";
import { defineWorkflowMetadata } from "./workflow-meta";

export type ControlCenterWorkspace = "ADMIN" | "USER";

export class UserHomeWorkflow {
  static readonly meta = defineWorkflowMetadata({
    id: "userHomeWorkflow",
    intent: "Open home in USER workspace and validate USER landing context.",
    targetPathnames: ["/control-center"],
    pages: ["homePage"],
    components: {
      shell: ["masthead", "navigationDrawer"],
      widgets: ["modal"],
    },
  });

  readonly home: HomePage;

  constructor(page: Page) {
    this.home = new HomePage(page);
  }

  async openHome() {
    await this.home.openHomeExpectingWorkspace("USER");
  }

  async openWelcomeModal() {
    await this.home.openWelcomeModalExpectLoaded("USER");
  }
}

export class AdminHomeWorkflow {
  static readonly meta = defineWorkflowMetadata({
    id: "adminHomeWorkflow",
    intent: "Open home in ADMIN workspace and validate ADMIN landing context.",
    targetPathnames: ["/control-center"],
    pages: ["homePage"],
    components: {
      shell: ["masthead", "navigationDrawer"],
      widgets: ["modal"],
    },
  });

  readonly home: HomePage;

  constructor(page: Page) {
    this.home = new HomePage(page);
  }

  async openHome() {
    await this.home.openHomeExpectingWorkspace("ADMIN");
  }

  async openWelcomeModal() {
    await this.home.openWelcomeModalExpectLoaded("ADMIN");
  }
}
