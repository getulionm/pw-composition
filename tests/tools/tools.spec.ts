import { test } from "../../support/fixtures/app.fixture";

test.describe("Tools", () => {
  test.describe("admin", () => {
    test.beforeEach(async ({ adminHomeWorkflow }) => {
      await adminHomeWorkflow.openHome();
    });

    test("sees Create tool in nav unlocked", async ({ createToolWorkflow }) => {
      await createToolWorkflow.assertCreateToolAvailable();
    });

    test("can create tools", async ({ createToolWorkflow }) => {
      await createToolWorkflow.createTool();
    });

    test("can view tools", async ({ viewToolsWorkflow }) => {
      await viewToolsWorkflow.openViewTools();
    });

    test("admin creates a tool then sees it listed in tools", async ({
      createToolWorkflow,
      viewToolsWorkflow,
    }) => {
      await createToolWorkflow.createTool();
      await viewToolsWorkflow.openViewTools();
      await viewToolsWorkflow.expectToolListed("New item #1");
    });

    test("admin creates a tool then user can see it in tools list", async ({
      createToolWorkflow,
      workspaceWorkflow,
      viewToolsWorkflow,
    }) => {
      await createToolWorkflow.createTool();
      await workspaceWorkflow.switchToUser();
      await viewToolsWorkflow.openViewTools();
      await viewToolsWorkflow.expectToolListed("New item #1");
    });
  });

  test.describe("user", () => {
    test.beforeEach(async ({ userHomeWorkflow }) => {
      await userHomeWorkflow.openHome();
    });

    test("sees Create tool in nav disabled with padlock", async ({ createToolWorkflow }) => {
      await createToolWorkflow.assertCreateToolUnavailable();
    });

    test("cannot create tools", async ({ createToolWorkflow }) => {
      await createToolWorkflow.assertCreateToolBlockedForCurrentUser();
    });

    test("can view tools", async ({ viewToolsWorkflow, createToolWorkflow }) => {
      await createToolWorkflow.assertCreateToolUnavailable();
      await viewToolsWorkflow.openViewTools();
    });
  });
});
