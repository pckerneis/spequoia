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
    const text = rawNode["$text"];
    const route = rawNode["$url"];
    const role = rawNode["$role"];

    if (selector && typeof selector !== "string") {
      throw new Error(`Invalid selector for node ${name}: ${selector}`);
    }

    if (text && typeof text !== "string") {
      throw new Error(`Invalid text for node ${name}: ${text}`);
    }

    if (role && typeof role !== "string") {
      throw new Error(`Invalid role for node ${name}: ${role}`);
    }

    if (route && typeof route !== "string") {
      throw new Error(`Invalid route for node ${name}: ${route}`);
    }

    return {
      uuid: crypto.randomUUID(),
      name,
      selector,
      text,
      role,
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
