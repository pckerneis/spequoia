import { parse } from "yaml";
import { ParsedDocument } from "./model/parsed-document.model";
import Ajv from "ajv";
import schema from "spequoia-model/schema/spequoia.json";
import { SpequoiaDocument } from "spequoia-model/src/model/spequoia.model";

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
          schemaPath: error.schemaPath
        } satisfies ParseError;
      }) || [];

    return {
      valid: false,
      rawDocument,
      errors: errors,
    };
  }

  return {
    valid: true,
    rawDocument,
    parsedDocument: rawDocument as unknown as ParsedDocument,
  };
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
