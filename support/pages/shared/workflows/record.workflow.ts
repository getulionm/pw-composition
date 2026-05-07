import type { Page } from "@playwright/test";
import { RecordDetailsPage } from "../../control-center/record-details.page";
import { RecordsPage } from "../../control-center/records.page";
import { defineWorkflowMetadata } from "./workflow-meta";

export class RecordWorkflow {
  static readonly meta = defineWorkflowMetadata({
    id: "recordWorkflow",
    intent: "Run record list journeys (search/open/create) from records page to details.",
    targetPathnames: ["/control-center/records", "/control-center/records/example-record"],
    pages: ["recordsPage", "recordDetailsPage"],
    components: {
      shell: ["navigationDrawer"],
      widgets: ["searchBox", "table"],
    },
  });

  readonly records: RecordsPage;
  readonly recordDetails: RecordDetailsPage;

  constructor(page: Page) {
    this.records = new RecordsPage(page);
    this.recordDetails = new RecordDetailsPage(page);
  }

  async browseDefaultRecordList() {
    await this.records.goto();
    await this.records.expectDefaultTwoRecords();
    await this.records.expectSearchInputEmpty();
  }

  async browseDefaultRecordListWithoutSearchCheck() {
    await this.records.goto();
    await this.records.expectDefaultTwoRecords();
  }

  async addNewRecord() {
    await this.records.goto();
    await this.records.createRecord();
    await this.records.expectRowVisible("New record 100");
  }

  async openExistingRecord(name: string) {
    await this.records.goto();
    await this.records.openRecord(name);
    await this.recordDetails.expectLoaded(name);
  }

  async searchRecordInList(recordName: string, hiddenRecordName: string) {
    await this.records.goto();
    await this.records.searchRecords(recordName);
    await this.records.expectRowVisible(recordName);
    await this.records.expectRowNotVisible(hiddenRecordName);
  }

  async clearSearchRestoresFullList(searchQuery: string) {
    await this.records.goto();
    await this.records.searchRecords(searchQuery);
    await this.records.clearRecordSearch();
    await this.records.expectSearchInputEmpty();
    await this.records.expectDefaultTwoRecords();
  }

  async viewRecordByName(recordName: string) {
    await this.records.goto();
    await this.records.clickViewOnRecord(recordName);
    await this.recordDetails.expectLoaded(recordName);
  }

  async createRecord() {
    await this.records.goto();
    await this.records.createRecord();
    await this.records.expectRowVisible("New record 100");
  }
}
