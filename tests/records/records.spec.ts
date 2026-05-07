import { test } from "../../support/fixtures/app.fixture";

test.describe("Records", () => {
  test.describe("admin", () => {
    test.beforeEach(async ({ adminHomeWorkflow }) => {
      await adminHomeWorkflow.openHome();
    });

    test("can browse the full record list", async ({ recordWorkflow }) => {
      await recordWorkflow.browseDefaultRecordList();
    });

    test("can add a new record", async ({ recordWorkflow }) => {
      await recordWorkflow.addNewRecord();
    });

    test("can search and find a record", async ({ recordWorkflow }) => {
      await recordWorkflow.searchRecordInList("Example Record 1", "Example Record 2");
    });

    test("can clear search and see the full list again", async ({ recordWorkflow }) => {
      await recordWorkflow.clearSearchRestoresFullList("Example Record 1");
    });

    test("can open a record and read its details", async ({ recordWorkflow }) => {
      await recordWorkflow.viewRecordByName("Example Record 1");
    });
  });

  test.describe("user", () => {
    test.beforeEach(async ({ userHomeWorkflow }) => {
      await userHomeWorkflow.openHome();
    });

    test("can browse the full record list", async ({ recordWorkflow }) => {
      await recordWorkflow.browseDefaultRecordListWithoutSearchCheck();
    });

    test("can add a new record", async ({ recordWorkflow }) => {
      await recordWorkflow.addNewRecord();
    });

    test("can search and find a record", async ({ recordWorkflow }) => {
      await recordWorkflow.searchRecordInList("Example Record 2", "Example Record 1");
    });

    test("can clear search and see the full list again", async ({ recordWorkflow }) => {
      await recordWorkflow.clearSearchRestoresFullList("Example Record 2");
    });

    test("can open a record and read its details", async ({ recordWorkflow }) => {
      await recordWorkflow.viewRecordByName("Example Record 2");
    });
  });
});
