import {
  SpequoiaExampleOverlay,
  SpequoiaExecutor,
  SpequoiaTag,
} from "@spequoia/model";

export interface ParsedDocument {
  title: string;
  version: string;
  description?: string;
  features: ParsedFeature[];
  views: ParsedViewNode[];
  executors: Record<string, SpequoiaExecutor>;
  defaultExecutor?: string;
  actions: ParsedAction[];
  tags?: SpequoiaTag[];
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
  executors?: string[];
}

export interface ParsedStep {
  raw: string;
  fragments: ParsedStepFragment[];
  action?: Action;
  computedViewBefore?: ParsedViewNode;
  computedViewAfter?: ParsedViewNode;
  duration?: number;
  composite?: boolean;
  steps?: ParsedStep[];
  errors: string[];
  overlay?: ParsedOverlay;
}

export interface ParsedOverlay extends SpequoiaExampleOverlay {
  targetUuid: string;
}

export type ParsedStepFragmentType = "text" | "variable" | "quoted" | "keyword";

export type ActionType =
  | "visit"
  | "click"
  | "double_click"
  | "type"
  | "press_key"
  | "hover";

export interface BaseAction {
  type: ActionType;
}

export interface VisitAction extends BaseAction {
  type: "visit";
  view: string;
}

export interface ClickAction extends BaseAction {
  type: "click";
  target: string;
}

export interface DoubleClickAction extends BaseAction {
  type: "double_click";
  target: string;
}

export interface TypeAction extends BaseAction {
  type: "type";
  text: string;
}

export interface PressKeyAction extends BaseAction {
  type: "press_key";
  key: string;
}

export interface HoverAction extends BaseAction {
  type: "hover";
  target: string;
}

export type Action =
  | VisitAction
  | ClickAction
  | DoubleClickAction
  | TypeAction
  | PressKeyAction
  | HoverAction;

export interface ParsedStepFragment {
  type: ParsedStepFragmentType;
  value: string;
}

export interface ParsedViewNode {
  uuid: string;
  name: string;
  selector?: string;
  route?: string;
  text?: string;
  role?: string;
  children?: ParsedViewNode[];
  target?: boolean;
  hovered?: boolean;
  clicked?: boolean;
  hidden?: boolean;
  placeholder?: string;
  typing?: boolean;
  checked?: boolean;
}

export interface ParsedAction {
  name: string;
  description?: string;
  steps: ParsedStep[];
}
