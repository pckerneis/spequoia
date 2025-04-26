export interface ParsedDocument {
  title: string;
  description?: string;
  features: ParsedFeature[];
  views?: ParsedViewNode[];
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
  name?: string;
  description?: string;
  steps?: ParsedStep[];
}

export interface ParsedStep {
  raw: string;
  fragments: ParsedStepFragment[];
}

export type ParsedStepFragmentType = "text" | "variable";

export interface ParsedStepFragment {
  type: ParsedStepFragmentType;
  value: string;
}

export interface ParsedViewNode {
  name: string;
  selector?: string;
  direction?: string;
  text?: string;
  children?: ParsedViewNode[];
  target?: boolean;
}
