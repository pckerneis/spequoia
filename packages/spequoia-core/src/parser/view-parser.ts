import { ParsedViewNode } from "../model/parsed-document.model";
import { SpequoiaViewNode } from "@spequoia/model";

export function parseViews(
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
