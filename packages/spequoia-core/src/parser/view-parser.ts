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
      uuid: crypto.randomUUID(),
      name,
      selector: rawNode,
    };
  } else if (typeof rawNode === "object") {
    const selector = rawNode["$selector"];
    const direction = rawNode["$direction"];
    const text = rawNode["$text"];
    const route = rawNode["$url"];

    if (selector && typeof selector !== "string") {
      throw new Error(`Invalid selector for node ${name}: ${selector}`);
    }

    if (direction && typeof direction !== "string") {
      throw new Error(`Invalid direction for node ${name}: ${direction}`);
    }

    if (text && typeof text !== "string") {
      throw new Error(`Invalid text for node ${name}: ${text}`);
    }

    if (route && typeof route !== "string") {
      throw new Error(`Invalid route for node ${name}: ${route}`);
    }

    return {
      uuid: crypto.randomUUID(),
      name,
      selector,
      direction,
      text,
      route,
      children: Object.entries(rawNode)
        .filter(([key]) => !key.startsWith("$"))
        .map(([key, value]) => {
          return parseViewNode(value!, key);
        }),
    };
  }

  return {
    uuid: crypto.randomUUID(),
    name,
  };
}
