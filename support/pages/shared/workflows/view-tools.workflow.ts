import type { Page } from "@playwright/test";
import { HomePage } from "../../control-center/home.page";
import { ViewToolsPage } from "../../control-center/view-tools.page";
import { defineWorkflowMetadata } from "./workflow-meta";

export class ViewToolsWorkflow {
  static readonly meta = defineWorkflowMetadata({
    id: "viewToolsWorkflow",
    intent: "Open View tools from home and verify the built tools list.",
    targetPathnames: ["/control-center", "/control-center/view-tools"],
    pages: ["homePage", "viewToolsPage"],
    components: {
      shell: ["masthead", "navigationDrawer"],
      widgets: ["table"],
    },
  });

  readonly home: HomePage;
  readonly viewTools: ViewToolsPage;

  constructor(page: Page) {
    this.home = new HomePage(page);
    this.viewTools = new ViewToolsPage(page);
  }

  async openViewTools() {
    await this.home.openViewToolsFromMenu();
    await this.viewTools.expectScreen();
    await this.viewTools.expectBuiltToolsTableVisible();
  }

  /** Journey outcome: a tool row appears in the built tools table. */
  async expectToolListed(name: string) {
    await this.viewTools.expectToolRowVisible(name);
  }
}
