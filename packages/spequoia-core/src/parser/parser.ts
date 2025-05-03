import { ParseError, ParseResult } from "./interfaces";
import { parse } from "yaml";
import Ajv from "ajv";
import { parseRawDocument } from "./document-parser";
import { SPEQUOIA_SCHEMA, SpequoiaDocument } from "@spequoia/model";

export function parseSpec(yamlText: string): ParseResult {
  console.log("Parsing YAML document...");
  const rawDocument = parse(yamlText) as SpequoiaDocument;
  const ajv = new Ajv();
  const validateFn = ajv.compile(SPEQUOIA_SCHEMA);
  const valid = validateFn(rawDocument);

  if (!valid) {
    const errors: ParseError[] =
      validateFn.errors?.map((error) => {
        return {
          message: error.message ?? `Unknown error: ${JSON.stringify(error)}`,
          schemaPath: error.schemaPath,
        } satisfies ParseError;
      }) || [];

    return {
      valid: false,
      rawDocument,
      errors: errors,
    };
  }

  const parsedDocument = parseRawDocument(rawDocument);

  return {
    valid: true,
    rawDocument,
    parsedDocument,
  };
}
