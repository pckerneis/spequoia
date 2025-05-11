import {
  ParsedDocument,
  ParsedExample,
  ParsedFeature,
  ParsedViewNode,
} from 'spequoia-core/dist/model/parsed-document.model';
import { Heading } from './heading.model';
import { Manifest } from './manifest.model';

export interface ProcessedDocument extends ParsedDocument {
  processedDescription?: string;
  processedFeatures: ProcessedFeature[];
  processedViews?: ProcessedView[];
  headings: Heading[];
}

export interface ProcessedFeature extends ParsedFeature {
  anchorId: string;
}

export interface ProcessedView extends ParsedViewNode {
  anchorId: string;
}

export interface ExampleWithManifest extends ParsedExample {
  manifest: Manifest | null;
}
