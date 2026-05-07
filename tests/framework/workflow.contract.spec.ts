import { expect, test } from "../../support/fixtures/app.fixture";
import { AdminHomeWorkflow, UserHomeWorkflow } from "../../support/pages/shared/workflows/home.workflow";
import { RecordWorkflow } from "../../support/pages/shared/workflows/record.workflow";
import { CreateToolWorkflow } from "../../support/pages/shared/workflows/create-tool.workflow";
import { ViewToolsWorkflow } from "../../support/pages/shared/workflows/view-tools.workflow";
import { WorkspaceWorkflow } from "../../support/pages/shared/workflows/workspace.workflow";

test.describe("Workflow framework contracts", () => {
  test("workflow metadata declares intended pages and components", async () => {
    expect(AdminHomeWorkflow.meta.pages).toEqual(["homePage"]);
    expect(UserHomeWorkflow.meta.pages).toEqual(["homePage"]);
    expect(RecordWorkflow.meta.pages).toEqual(["recordsPage", "recordDetailsPage"]);
    expect(CreateToolWorkflow.meta.pages).toEqual(["homePage", "createToolPage"]);
    expect(ViewToolsWorkflow.meta.pages).toEqual(["homePage", "viewToolsPage"]);
    expect(WorkspaceWorkflow.meta.pages).toEqual(["homePage"]);
    expect(ViewToolsWorkflow.meta.components.shell).toContain("navigationDrawer");
    expect(RecordWorkflow.meta.components.widgets).toEqual(["searchBox", "table"]);
  });

  test("workflow fixture wiring runs without unrelated dependencies", async ({
    createToolWorkflow,
    recordWorkflow,
    workspaceWorkflow,
  }) => {
    await createToolWorkflow.createTool();
    await recordWorkflow.openExistingRecord("Example Record 1");
    await workspaceWorkflow.switchToUser();
  });
});
