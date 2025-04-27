import { parse } from "yaml";
import {
  ParsedDocument,
  ParsedStep,
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
        feature.examples?.map((example) => ({
          id: example.id,
          name: example.name,
          description: example.description,
          steps: parseRawSteps(example.steps),
        })) ?? [],
      tags: feature.tags ?? [],
    })),
    views: parseViews(rawDocument.views),
  };
}

function parseRawSteps(steps: string[] | undefined): ParsedStep[] {
  if (!steps) {
    return [];
  }

  return steps.map((step) => parseRawStep(step));
}

function parseRawStep(step: string): ParsedStep {
  return {
    raw: step,
    fragments: step
      .split(" ")
      .filter((step) => step.trim().length > 0)
      .map((step) => {
        if (step.startsWith("$")) {
          return {
            type: "variable",
            value: step.substring(1),
          };
        } else {
          return {
            type: "text",
            value: step,
          };
        }
      }),
  };
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
          return parseViewNode(value, key);
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
