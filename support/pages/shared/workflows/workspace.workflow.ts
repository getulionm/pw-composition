import type { Page } from "@playwright/test";
import { HomePage } from "../../control-center/home.page";
import { MastheadComponent } from "../components/shell/masthead.component";
import { defineWorkflowMetadata } from "./workflow-meta";

export class WorkspaceWorkflow {
  static readonly meta = defineWorkflowMetadata({
    id: "workspaceWorkflow",
    intent: "Switch active workspace entitlement in shell (ADMIN/USER).",
    targetPathnames: ["/control-center"],
    pages: ["homePage"],
    components: {
      shell: ["masthead"],
      widgets: [],
    },
  });

  readonly home: HomePage;
  readonly masthead: MastheadComponent;

  constructor(page: Page) {
    this.home = new HomePage(page);
    this.masthead = new MastheadComponent(page);
  }

  async switchToUser() {
    await this.masthead.switchToUser();
    await this.home.expectBodyWorkspace("USER");
  }

  async switchToAdmin() {
    await this.masthead.switchToAdmin();
    await this.home.expectBodyWorkspace("ADMIN");
  }
}
