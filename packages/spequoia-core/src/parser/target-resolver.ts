import { ParsedViewNode } from "../model/parsed-document.model";
import { ResolvedTarget } from "./interfaces";

export function resolveTarget(
  currentNode: ParsedViewNode | undefined,
  targetPath: string | undefined,
  viewTemplate?: ParsedViewNode,
): ResolvedTarget | null {
  if (!currentNode || !targetPath) {
    return null;
  }

  const targets = targetPath
    .split(" ")
    .map((name) => name.trim())
    .filter((name) => name !== "");

  let currentScope = currentNode;

  for (const targetName of targets) {
    const resolvedTarget = resolveTargetInNode(
      currentScope,
      targetName,
      viewTemplate,
    );
    if (!resolvedTarget) {
      return null;
    }

    currentScope = resolvedTarget.node;
  }

  return { node: currentScope };
}

function applyParameters(
  baseSelector: string | undefined,
  targetName: string,
): string | null {
  if (!baseSelector) {
    return null;
  }

  const parameters = targetName.match(/\((.*?)\)/);
  if (parameters) {
    const parameter = parameters[1];
    return baseSelector.replace(/\${.*?}/g, parameter);
  }
  return baseSelector;
}

export function resolveTargetInNode(
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
        newNode.selector = applyParameters(child.selector, targetName);
        newNode.name = targetName;
        newNode.uuid = crypto.randomUUID();

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
