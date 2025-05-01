import {SpequoiaExecutor} from 'spequoia-model/src/model/spequoia.model';

export interface ParsedDocument {
  title: string;
  description?: string;
  features: ParsedFeature[];
  views?: ParsedViewNode[];
  executors?: Record<string, SpequoiaExecutor>;
  defaultExecutor?: string;
}

export interface ParsedFeature {
  id?: string;
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
  executors?: string[];
}

export interface ParsedStep {
  raw: string;
  fragments: ParsedStepFragment[];
}

export type ParsedStepFragmentType = "text" | "variable" | "quoted" | "keyword";

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
