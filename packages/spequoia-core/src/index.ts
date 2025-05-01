import { parse } from "yaml";
import {
  ParsedDocument,
  ParsedExample,
  ParsedStep,
  ParsedStepFragment,
  ParsedStepFragmentType,
  ParsedViewNode,
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
              steps: parseRawSteps(example.steps),
              executors: example.executors,
            }) satisfies ParsedExample,
        ) ?? [],
      tags: feature.tags ?? [],
    })),
    views: parseViews(rawDocument.views),
    executors: rawDocument.executors,
    defaultExecutor: rawDocument.defaultExecutor,
  };
}

function parseRawSteps(steps: string[] | undefined): ParsedStep[] {
  if (!steps) {
    return [];
  }

  return steps.map((step) => parseRawStep(step));
}

const keywords = ["click", "type", "expect", "wait", "visit"];

const actionOnElementPatterns = [
  // action keyword (click) followed by a variable
  /^(click)\s+([\w\s]+)/,
  /^(visit)\s+([\w\s]+)/,
];

const actionWithQuotedTextPatterns = [
  // action keyword (type) followed by quoted text
  /^(type)\s+"([^"]+)"/,
];

const assertionPatterns = [
  // "expect" keyword followed by a variable and "to have text" keyword
  /expect\s+([\w\s]+)\s+(to have text)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(not to have text)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(to have class)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(not to have class)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(to be visible)/,
  /expect\s+([\w\s]+)\s+(to be hidden)/,
  /expect\s+([\w\s]+)\s+(to exist)/,
  /expect\s+([\w\s]+)\s+(not to exist)/,
  /expect\s+([\w\s]+)\s+(to be checked)/,
  /expect\s+([\w\s]+)\s+(not to be checked)/,
  /expect\s+([\w\s]+)\s+(to be disabled)/,
  /expect\s+([\w\s]+)\s+(not to be disabled)/,
  /expect\s+([\w\s]+)\s+(to be enabled)/,
  /expect\s+([\w\s]+)\s+(not to be enabled)/,
  /expect\s+([\w\s]+)\s+(to be empty)/,
  /expect\s+([\w\s]+)\s+(not to be empty)/,
  /expect\s+([\w\s]+)\s+(to have placeholder)\s+"([^"]+)"/,
  /expect\s+([\w\s]+)\s+(not to have placeholder)\s+"([^"]+)"/,
];

function parseRawStep(step: string): ParsedStep {
  return {
    raw: step,
    fragments: parseStepFragments(step),
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

  let fragments: ParsedStepFragment[] = [];
  let currentValue = "";
  let currentType: ParsedStepFragmentType = "text";

  // Check if the step starts with a keyword
  const keyword = keywords.find((kw) => step.startsWith(kw));

  if (keyword) {
    fragments.push({ type: "keyword", value: keyword });
  }

  const startIndex = keyword ? keyword.length : 0;

  for (let i = startIndex; i < step.length; i++) {
    const char = step[i];

    if (char === "$") {
      if (currentValue) {
        fragments.push({ type: currentType, value: currentValue });
        currentValue = "";
      }
      currentType = "variable";
    } else if (char === '"') {
      if (currentType === "quoted") {
        fragments.push({ type: currentType, value: currentValue });
        currentValue = "";
        currentType = "text";
      } else {
        if (currentValue) {
          fragments.push({ type: currentType, value: currentValue });
          currentValue = "";
        }
        currentType = "quoted";
      }
    } else {
      currentValue += char;
    }
  }

  if (currentValue) {
    fragments.push({ type: currentType, value: currentValue });
  }

  return fragments;
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
