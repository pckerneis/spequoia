import { ParsedDocument, ParsedExample } from "../model/parsed-document.model";
import { parseViews } from "./view-parser";
import { parseRawSteps } from "./step-parser";
import { SpequoiaDocument } from "@spequoia/model";

export function parseRawDocument(
  rawDocument: SpequoiaDocument,
): ParsedDocument {
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
              steps: parseRawSteps(example.steps, views, rawDocument.actions),
              executors: example.executors,
            }) satisfies ParsedExample,
        ) ?? [],
      tags: feature.tags ?? [],
    })),
    views,
    executors: rawDocument.executors ?? {},
    defaultExecutor: rawDocument.defaultExecutor,
    actions: [], // TODO
    tags: rawDocument.tags,
  };
}
