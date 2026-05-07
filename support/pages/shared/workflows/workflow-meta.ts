export type WorkflowMetadata = {
  id: string;
  intent: string;
  targetPathnames: string[];
  pages: string[];
  components: {
    shell: string[];
    widgets: string[];
  };
};

export function defineWorkflowMetadata(meta: WorkflowMetadata): WorkflowMetadata {
  return meta;
}
