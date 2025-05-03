import {ParsedDocument, ParsedViewNode} from '../model/parsed-document.model';
import {SpequoiaDocument} from '@spequoia/model';

export interface ResolvedTarget {
  node: ParsedViewNode;
  path: string[];
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
