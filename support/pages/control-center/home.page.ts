import { expect, Page } from "@playwright/test";
import { BasePage } from "../shared/base.page";
import { ModalComponent } from "../shared/components/inner/modal.component";
import { MastheadComponent } from "../shared/components/shared/masthead.component";
import { NavigationDrawerComponent } from "../shared/components/shared/navigation-drawer.component";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.home",
      pathname: "/control-center",
      documentTitle: "Home",
    });
  }

  async goto() {
    await this.gotoPath("./");
    await this.expectScreen();
    const ws = ((await this.page.locator("body").getAttribute("data-workspace")) ?? "ADMIN") as "ADMIN" | "USER";
    await this.expectWelcomeWorkspace(ws);
  }

  async expectWelcomeWorkspace(mode: "ADMIN" | "USER") {
    await expect(this.page.getByRole("heading", { name: `Welcome ${mode}` })).toBeVisible();
  }

  async expectBodyWorkspace(mode: "ADMIN" | "USER") {
    await expect(this.page.locator("body")).toHaveAttribute("data-workspace", mode);
  }

  async chooseWorkspace(workspace: "ADMIN" | "USER") {
    await new MastheadComponent(this.page).chooseWorkspace(workspace);
  }

  async openHomeExpectingWorkspace(workspace: "ADMIN" | "USER") {
    await this.goto();
    await this.chooseWorkspace(workspace);
    await this.expectWelcomeWorkspace(workspace);
  }

  async openRecords() {
    await new NavigationDrawerComponent(this.page).openLink("Records");
  }

  async openViewToolsFromMenu() {
    await new NavigationDrawerComponent(this.page).openViewToolsFromMenu();
  }

  async openCreateToolFromMenu() {
    await new NavigationDrawerComponent(this.page).openCreateToolFromMenu();
  }

  async openWelcomeModalExpectLoaded(workspace: "ADMIN" | "USER") {
    await this.goto();
    await this.chooseWorkspace(workspace);
    const modal = new ModalComponent(this.page);
    const dialogName = "Welcome modal";
    await modal.openViaButton("Open welcome modal");
    await modal.expectDialogVisible(dialogName);
    await expect(
      modal.dialog(dialogName).getByRole("heading", { level: 2, name: `Welcome ${workspace}` })
    ).toBeVisible();
  }
}
