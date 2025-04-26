import { parse } from 'yaml';

export interface SpecFeature {
  id: string;
  description: string;
  examples?: SpecExample[];
}

export interface SpecExample {
  id: string;
  description: string;
  operations?: Array<string | Record<string, any>>;
}

export interface SpecDocument {
  features: SpecFeature[];
}

/**
 * Parses a YAML spec string into a typed SpecDocument.
 * @param yamlText The YAML string to parse.
 * @returns A structured SpecDocument object.
 * @throws Error if the YAML is invalid or does not match expected shape.
 */
export function parseSpec(yamlText: string): SpecDocument {
  const parsed = parse(yamlText);

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid spec format: Root is not an object.');
  }

  if (!('features' in parsed) || !Array.isArray((parsed as any).features)) {
    throw new Error('Invalid spec format: Missing "features" array.');
  }

  return parsed as SpecDocument;
}
