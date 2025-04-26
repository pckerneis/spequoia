export interface ParsedDocument {
  title: string;
  description?: string;
  features: ParsedFeature[];
}

export interface ParsedFeature {
  id: string;
  name: string;
  description?: string;
  examples?: ParsedExample[];
  tags?: string[];
}

export interface ParsedExample {
  id: string;
  name: string;
  description?: string;
  steps?: ParsedStep[];
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
