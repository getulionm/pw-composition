import { HomePage } from "../../control-center/home.page";

export type ControlCenterWorkspace = "ADMIN" | "USER";

export class UserHomeWorkflow {
  constructor(readonly home: HomePage) {}

  async openHome() {
    await this.home.openHomeExpectingWorkspace("USER");
  }
}

export class AdminHomeWorkflow {
  constructor(readonly home: HomePage) {}

  async openHome() {
    await this.home.openHomeExpectingWorkspace("ADMIN");
  }
}
