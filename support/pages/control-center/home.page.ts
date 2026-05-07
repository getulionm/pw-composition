import { expect, Page } from "@playwright/test";
import { BasePage } from "../shared/base.page";
import { ModalComponent } from "../shared/components/widgets/modal.component";
import { MastheadComponent } from "../shared/components/shell/masthead.component";
import { NavigationDrawerComponent } from "../shared/components/shell/navigation-drawer.component";

export class HomePage extends BasePage {
  readonly masthead: MastheadComponent;
  readonly nav: NavigationDrawerComponent;
  readonly modal: ModalComponent;

  constructor(page: Page) {
    super(page, {
      screenId: "controlCenter.home",
      pathname: "/control-center",
      documentTitle: "Home",
    });
    this.masthead = new MastheadComponent(page);
    this.nav = new NavigationDrawerComponent(page);
    this.modal = new ModalComponent(page);
  }

  private async expectHeading(name: string) {
    await expect(this.page.getByRole("heading", { name })).toBeVisible();
  }

  async goto() {
    await this.gotoPath(this.screen.pathname);
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
    await this.masthead.chooseWorkspace(workspace);
  }

  async openHomeExpectingWorkspace(workspace: "ADMIN" | "USER") {
    await this.goto();
    await this.chooseWorkspace(workspace);
    await this.expectWelcomeWorkspace(workspace);
  }

  async openRecords() {
    await this.nav.openLink("Records");
  }

  async openViewToolsFromMenu() {
    await this.nav.openViewToolsFromMenu();
  }

  async openCreateToolFromMenu() {
    await this.nav.openCreateToolFromMenu();
  }

  async expectCreateToolNavLocked() {
    await this.nav.ensureToolsMenuOpen();
    await this.nav.expectCreateToolNavLocked();
  }

  async expectCreateToolNavUnlocked() {
    await this.nav.ensureToolsMenuOpen();
    await this.nav.expectCreateToolNavUnlocked();
  }

  async openWelcomeModalExpectLoaded(workspace: "ADMIN" | "USER") {
    await this.goto();
    await this.chooseWorkspace(workspace);
    const dialogName = "Welcome modal";
    await this.modal.openViaButton("Open welcome modal");
    await this.modal.expectDialogVisible(dialogName);
    await expect(
      this.modal.dialog(dialogName).getByRole("heading", { level: 2, name: `Welcome ${workspace}` })
    ).toBeVisible();
  }
}
