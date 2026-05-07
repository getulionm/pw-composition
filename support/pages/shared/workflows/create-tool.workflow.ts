import type { Page } from "@playwright/test";
import { CreateToolPage } from "../../control-center/create-tool.page";
import { HomePage } from "../../control-center/home.page";
import { defineWorkflowMetadata } from "./workflow-meta";

export class CreateToolWorkflow {
  static readonly meta = defineWorkflowMetadata({
    id: "createToolWorkflow",
    intent: "Create built tool items from ADMIN home via shell navigation.",
    targetPathnames: ["/control-center", "/control-center/create-tool"],
    pages: ["homePage", "createToolPage"],
    components: {
      shell: ["masthead", "navigationDrawer"],
      widgets: [],
    },
  });

  readonly home: HomePage;
  readonly createToolPage: CreateToolPage;

  constructor(page: Page) {
    this.home = new HomePage(page);
    this.createToolPage = new CreateToolPage(page);
  }

  async createTool() {
    await this.home.openHomeExpectingWorkspace("ADMIN");
    await this.home.openCreateToolFromMenu();
    await this.createToolPage.expectScreen();
    await this.createToolPage.createItem();
    await this.createToolPage.expectItemCreatedMessage();
  }

  async assertCreateToolAvailable() {
    await this.home.openHomeExpectingWorkspace("ADMIN");
    await this.home.expectCreateToolNavUnlocked();
  }

  async assertCreateToolUnavailable() {
    await this.home.openHomeExpectingWorkspace("USER");
    await this.home.expectCreateToolNavLocked();
  }

  async assertCreateToolBlockedForCurrentUser() {
    await this.home.openHomeExpectingWorkspace("USER");
    await this.home.expectCreateToolNavLocked();
    await this.createToolPage.goto();
    await this.createToolPage.expectScreen();
    await this.createToolPage.expectFunctionalityHidden();
  }
}
