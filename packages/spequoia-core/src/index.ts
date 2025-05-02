import { parse } from "yaml";
import {
  Action,
  ClickAction,
  ParsedDocument,
  ParsedExample,
  ParsedStep,
  ParsedStepFragment,
  ParsedViewNode,
  PressKeyAction,
  TypeAction,
  VisitAction,
} from "./model/parsed-document.model";
import Ajv from "ajv";
import schema from "spequoia-model/schema/spequoia.json";
import {
  SpequoiaDocument,
  SpequoiaViewNode,
} from "spequoia-model/src/model/spequoia.model";

export function parseSpec(yamlText: string): ParseResult {
  const rawDocument = parse(yamlText) as SpequoiaDocument;
  const ajv = new Ajv();
  const validateFn = ajv.compile(schema);
  const valid = validateFn(rawDocument);

  if (!valid) {
    const errors: ParseError[] =
      validateFn.errors?.map((error) => {
        return {
          message: error.message ?? `Unknown error: ${JSON.stringify(error)}`,
          schemaPath: error.schemaPath,
        } satisfies ParseError;
      }) || [];

    return {
      valid: false,
      rawDocument,
      errors: errors,
    };
  }

  const parsedDocument = parseRawDocument(rawDocument);

  return {
    valid: true,
    rawDocument,
    parsedDocument,
  };
}

function parseRawDocument(rawDocument: SpequoiaDocument): ParsedDocument {
  const views = parseViews(rawDocument.views);

  return {
    title: rawDocument.title,
    description: rawDocument.description,
    features: rawDocument.features.map((feature) => ({
      id: feature.id,
      name: feature.name,
      description: feature.description,
      examples:
        feature.examples?.map(
          (example) =>
            ({
              id: example.id,
              name: example.name,
              description: example.description,
              steps: parseRawSteps(example.steps, views),
              executors: example.executors,
            }) satisfies ParsedExample,
        ) ?? [],
      tags: feature.tags ?? [],
    })),
    views,
    executors: rawDocument.executors,
    defaultExecutor: rawDocument.defaultExecutor,
  };
}

interface ResolvedTarget {
  node: ParsedViewNode;
  path: string[];
}

function resolveTarget(
  currentView: ParsedViewNode | undefined,
  targetName: string | undefined,
  currentTarget: string[],
): ResolvedTarget | null {
  if (!currentView || !targetName) {
    return null;
  }

  // TODO: use currentTarget to find the target node with precedence rules

  const path: string[] = [];
  let node: ParsedViewNode | null = currentView;

  while (node) {
    if (node.name === targetName) {
      return { node, path };
    }

    path.push(node.name);

    for (const child of node.children || []) {
      const result = resolveTarget(child, targetName, currentTarget);

      if (result) {
        return result;
      }
    }

    path.pop();
    node = null;
  }

  return null;
}

function parseRawSteps(
  steps: string[] | undefined,
  views: ParsedViewNode[],
): ParsedStep[] {
  if (!steps) {
    return [];
  }

  const parsedSteps: ParsedStep[] = [];
  let currentView: ParsedViewNode | undefined;
  let currentTarget: ParsedViewNode | undefined;
  let currentTargetName: string | undefined;
  let currentTargetPath: string[] = [];

  for (const step of steps) {
    const parsedStep = parseRawStep(step);
    parsedSteps.push(parsedStep);

    if (parsedStep.action?.type === "visit") {
      const viewName = parsedStep.fragments[1].value.trim();
      currentView = JSON.parse(
        JSON.stringify(views.find((view) => view.name === viewName) || null),
      );
      currentTargetPath = [];
      currentTarget = currentView;
      currentTargetName = viewName;
    }

    if (parsedStep.action?.type === "click") {
      const targetName = parsedStep.fragments[1].value.trim();
      currentTargetName = targetName;
      currentView = JSON.parse(JSON.stringify(currentView));
      const resolvedTarget = resolveTarget(
        currentView,
        targetName,
        currentTargetPath,
      );

      if (resolvedTarget) {
        currentTargetPath = resolvedTarget.path;
        currentTarget = resolvedTarget.node;
        currentTarget.target = true;
        currentTarget.clicked = true;
      }
    }

    if (parsedStep.action?.type === "type") {
      currentView = JSON.parse(JSON.stringify(currentView));
      const resolvedTarget = resolveTarget(
        currentView,
        currentTargetName,
        currentTargetPath,
      );
      currentTarget = resolvedTarget?.node;

      if (currentTarget) {
        currentTarget.target = true;
        currentTarget.text = parsedStep.action.text;
      }
    }

    if (parsedStep.action?.type === "press_key") {
      currentView = JSON.parse(JSON.stringify(currentView));

      if (currentTarget) {
        currentTarget.target = true;
      }
    }

    if (
      parsedStep.fragments[0].type === "keyword" &&
      parsedStep.fragments[0].value === "expect"
    ) {
      const targetName = parsedStep.fragments[1].value;
      const assertion = parsedStep.fragments[2].value.trim();
      const resolvedTarget = resolveTarget(
        currentView,
        targetName,
        currentTargetPath,
      );

      if (resolvedTarget) {
        currentTargetPath = resolvedTarget.path;
        resolvedTarget.node.target = true;

        switch (assertion) {
          case "to have text":
            resolvedTarget.node.text =
              parsedStep.fragments[3]?.value?.trim() ?? "";
            break;
          case "to be empty":
            resolvedTarget.node.empty = true;
            break;
          case "not to be empty":
            resolvedTarget.node.empty = false;
            break;
          case "to be hidden":
            resolvedTarget.node.hidden = true;
            break;
          case "to be visible":
            resolvedTarget.node.hidden = false;
            break;
          case "not to be visible":
            resolvedTarget.node.hidden = true;
            break;
          case "to have placeholder":
            resolvedTarget.node.placeholder =
              parsedStep.fragments[3].value.trim();
            break;
          case "not to have text":
            resolvedTarget.node.text = "";
            break;
        }
      }
    }

    parsedStep.computedView = currentView;
  }

  return parsedSteps;
}

const actionOnElementPatterns = [
  // action keyword (click) followed by a variable
  /^(click)\s+([\w\s]+)/,
  /^(visit)\s+([\w\s]+)/,
];

const actionWithQuotedTextPatterns = [
  // action keyword (type) followed by quoted text
  /^(type)\s+"([^"]+)"/,
  /^(press key)\s+"([^"]+)"/,
];

const assertionPatterns = [
  // "expect" keyword followed by a variable and "to have text" keyword
  /expect\s+([\w\s]+)\s+(not to have text)\s+"([^"]*)"/,
  /expect\s+([\w\s]+)\s+(to have text)\s+"([^"]*)"/,
  /expect\s+([\w\s]+)\s+(not to have class)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(to have class)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(not to be visible)/,
  /expect\s+([\w\s]+)\s+(to be visible)/,
  /expect\s+([\w\s]+)\s+(to be hidden)/,
  /expect\s+([\w\s]+)\s+(not to exist)/,
  /expect\s+([\w\s]+)\s+(to exist)/,
  /expect\s+([\w\s]+)\s+(not to be checked)/,
  /expect\s+([\w\s]+)\s+(to be checked)/,
  /expect\s+([\w\s]+)\s+(not to be disabled)/,
  /expect\s+([\w\s]+)\s+(to be disabled)/,
  /expect\s+([\w\s]+)\s+(not to be enabled)/,
  /expect\s+([\w\s]+)\s+(to be enabled)/,
  /expect\s+([\w\s]+)\s+(not to be empty)/,
  /expect\s+([\w\s]+)\s+(to be empty)/,
  /expect\s+([\w\s]+)\s+(not to have placeholder)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(to have placeholder)\s+"([^"]+)"/,
];

function parseRawStep(step: string): ParsedStep {
  const fragments = parseStepFragments(step);
  let action: Action | undefined;

  if (fragments[0].type === "keyword") {
    switch (fragments[0].value) {
      case "visit":
        action = {
          type: "visit",
          selector: fragments[1].value,
        } satisfies VisitAction;
        break;
      case "click":
        action = {
          type: "click",
          selector: fragments[1].value,
        } satisfies ClickAction;
        break;
      case "type":
        action = {
          type: "type",
          text: fragments[1].value,
        } satisfies TypeAction;
        break;
      case "press key":
        action = {
          type: "press_key",
          key: fragments[1].value,
        } satisfies PressKeyAction;
        break;
    }
  }

  return {
    raw: step,
    fragments,
    action,
  };
}

function parseStepFragments(step: string): ParsedStepFragment[] {
  // Check for assertion patterns
  const assertionPattern = assertionPatterns.find((pattern) =>
    pattern.test(step),
  );

  if (assertionPattern) {
    const matches = step.match(assertionPattern);
    if (matches) {
      const variable = matches[1];
      const assertion = matches[2];
      const value = matches[3];

      const fragments: ParsedStepFragment[] = [
        { type: "keyword", value: "expect" },
        { type: "variable", value: variable },
        { type: "keyword", value: assertion },
      ];

      if (value) {
        fragments.push({ type: "quoted", value });
      }

      return fragments;
    }
  }

  // Check for action on element patterns
  const actionOnElementPattern = actionOnElementPatterns.find((pattern) =>
    pattern.test(step),
  );

  if (actionOnElementPattern) {
    const matches = step.match(actionOnElementPattern);
    if (matches) {
      const action = matches[1];
      const variable = matches[2];

      return [
        { type: "keyword", value: action },
        { type: "variable", value: variable },
      ];
    }
  }

  // Check for action with quoted text patterns
  const actionWithQuotedTextPattern = actionWithQuotedTextPatterns.find(
    (pattern) => pattern.test(step),
  );

  if (actionWithQuotedTextPattern) {
    const matches = step.match(actionWithQuotedTextPattern);
    if (matches) {
      const action = matches[1];
      const quotedText = matches[2];

      return [
        { type: "keyword", value: action },
        { type: "quoted", value: quotedText },
      ];
    }
  }

  // If no patterns matched, return the step as a text fragment
  return [{ type: "text", value: step }];
}

function parseViews(
  views: Record<string, SpequoiaViewNode> | undefined,
): ParsedViewNode[] {
  if (!views) {
    return [];
  }

  return Object.entries(views).map(([name, rawNode]) =>
    parseViewNode(rawNode, name),
  );
}

function parseViewNode(
  rawNode: SpequoiaViewNode,
  name: string,
): ParsedViewNode {
  if (typeof rawNode === "string") {
    return {
      name,
      selector: rawNode,
    };
  } else if (typeof rawNode === "object") {
    const selector = rawNode["$selector"];
    const direction = rawNode["$direction"];
    const text = rawNode["$text"];

    if (selector && typeof selector !== "string") {
      throw new Error(`Invalid selector for node ${name}: ${selector}`);
    }

    if (direction && typeof direction !== "string") {
      throw new Error(`Invalid direction for node ${name}: ${direction}`);
    }

    if (text && typeof text !== "string") {
      throw new Error(`Invalid text for node ${name}: ${text}`);
    }

    return {
      name,
      selector,
      direction,
      text,
      children: Object.entries(rawNode)
        .filter(([key]) => !key.startsWith("$"))
        .map(([key, value]) => {
          return parseViewNode(value!, key);
        }),
    };
  }

  return { name };
}

export interface ParseError {
  message: string;
  schemaPath?: string;
}

export interface ParseResult {
  valid: boolean;
  errors?: ParseError[];
  rawDocument: SpequoiaDocument;
  parsedDocument?: ParsedDocument;
}
