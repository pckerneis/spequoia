export interface ParsedDocument {
  features: ParsedFeature[];
}

export interface ParsedFeature {
  id: string;
  description: string;
  examples?: ParsedExample[];
}

export interface ParsedExample {
  id: string;
  description: string;
  steps: ParsedStep[];
}

export interface ParsedStep {
  operation: string;
  params: Record<string, unknown>;
  fragments: ParsedStepFragment[];
}

export type ParsedStepFragmentType = "text" | "variable";

export interface ParsedStepFragment {
  type: ParsedStepFragmentType;
  value: string;
}
