import { ParsedViewNode } from "../model/parsed-document.model";
import { ResolvedTarget } from "./interfaces";

export function resolveTarget(
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
    const transformedName = removeParameters(node.name);
    const transformedTargetName = removeParameters(targetName);

    if (transformedName === transformedTargetName) {
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

function removeParameters(name: string): string {
  // Replace all parameters (between parentheses) with an empty string
  return name.replace(/\(.*?\)/g, "").trim();
}
