import { parse } from "yaml";
import { ParsedDocument } from "./model/parsed-document.model";
import Ajv from "ajv";
import schema from "spequoia-model/schema/spequoia.json";
import {SpequoiaDocument} from 'spequoia-model/src/model/spequoia.model';

export function parseSpec(yamlText: string): ParseResult {
  const rawDocument = parse(yamlText) as SpequoiaDocument;
  const ajv = new Ajv();
  const validateFn = ajv.compile(schema);
  const valid = validateFn(rawDocument);

  if (!valid) {
    const errors =
      validateFn.errors?.map((error) => {
        return error.message ?? `Unknown error: ${JSON.stringify(error)}`;
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

interface ParseResult {
  valid: boolean;
  errors?: string[];
  rawDocument: SpequoiaDocument;
  parsedDocument?: ParsedDocument;
}
