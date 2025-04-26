import {
  ParsedDocument,
  ParsedFeature,
} from 'spequoia-core/dist/model/parsed-document.model';
import { Heading } from './heading.model';

export interface ProcessedDocument extends ParsedDocument {
  processedDescription?: string;
  processedFeatures: ProcessedFeature[];
  headings: Heading[];
}

export interface ProcessedFeature extends ParsedFeature {
  anchorId: string;
}
