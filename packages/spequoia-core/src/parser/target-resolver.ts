import { ParsedViewNode } from "../model/parsed-document.model";
import { ResolvedTarget } from "./interfaces";

export function resolveTarget(
  currentNode: ParsedViewNode | undefined,
  targetName: string | undefined,
  viewTemplate?: ParsedViewNode,
): ResolvedTarget | null {
  if (!currentNode || !targetName) {
    return null;
  }

  if (currentNode.name === targetName) {
    return { node: currentNode };
  }

  for (const child of currentNode.children || []) {
    const result = resolveTarget(
      child,
      targetName,
      viewTemplate?.children?.find((c) => child.name === c.name),
    );

    if (result) {
      return result;
    }
  }

  if (hasParameter(targetName) && viewTemplate) {
    for (const child of viewTemplate.children || []) {
      const transformedName = removeParameters(child.name);
      const transformedTargetName = removeParameters(targetName);

      if (transformedName === transformedTargetName) {
        const newNode = JSON.parse(JSON.stringify(child));
        newNode.name = targetName;

        if (currentNode.children) {
          currentNode.children.push(newNode);
        } else {
          currentNode.children = [newNode];
        }

        return { node: newNode };
      }
    }
  }

  return null;
}

function removeParameters(name: string): string {
  // Replace all parameters (between parentheses) with an empty string
  return name.replace(/\(.*?\)/g, "").trim();
}

function hasParameter(name: string): boolean {
  // Check if the name contains parameters (between parentheses)
  return /\(.*?\)/.test(name);
}
