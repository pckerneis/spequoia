import { Injectable, signal } from '@angular/core';
import {
  ParsedDocument,
  ParsedExample,
} from 'spequoia-core/dist/model/parsed-document.model';
import {
  ProcessedDocument,
  ProcessedView,
} from '../models/processed-document.model';
import { Heading } from '../models/heading.model';
import * as commonmark from 'commonmark';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  document = signal<ProcessedDocument | null>(null);

  constructor() {}

  public setDocument(parsedDocument: ParsedDocument): void {
    this.document.set(this.processDocument(parsedDocument));
  }

  private processDocument(parsedDocument: ParsedDocument): ProcessedDocument {
    const headings: Heading[] = [];

    const knownHeadingIds = new Set<string>();
    knownHeadingIds.add('features');
    knownHeadingIds.add('views');

    const generateUniqueId = (text: string) => {
      const baseId = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
      let uniqueId = baseId;
      let counter = 1;

      while (knownHeadingIds.has(uniqueId)) {
        uniqueId = `${baseId}-${counter}`;
        counter++;
      }

      knownHeadingIds.add(uniqueId);
      return uniqueId;
    };

    let processedDescription = '';

    if (parsedDocument.description) {
      const reader = new commonmark.Parser();
      const parsed = reader.parse(parsedDocument.description);

      class CustomHtmlRenderer extends commonmark.HtmlRenderer {
        heading(node: commonmark.Node, entering: boolean): void {
          const tagname = 'h' + node.level;
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const self = this as any;
          const attrs = self.attrs(node);

          if (entering) {
            if (node.firstChild && node.firstChild.literal) {
              const heading = {
                level: node.level,
                text: node.firstChild.literal,
                id: generateUniqueId(node.firstChild.literal),
              };
              headings.push(heading);
              attrs.push(['id', heading.id]);
            }
            self.cr();
            self.tag(tagname, attrs);
          } else {
            self.tag('/' + tagname);
            self.cr();
          }
        }
      }

      const writer = new CustomHtmlRenderer();
      processedDescription = writer.render(parsed);
    }

    headings.push({
      id: 'features',
      text: 'Features',
      level: 1,
    });

    const processedFeatures = [];

    for (const feature of parsedDocument.features) {
      const featureAnchorId = generateUniqueId(feature.name);
      const featureHeading = {
        id: featureAnchorId,
        text: feature.name,
        level: 2,
      };

      headings.push(featureHeading);

      processedFeatures.push({
        ...feature,
        anchorId: featureAnchorId,
      });
    }

    const processedViews: ProcessedView[] = [];

    if (parsedDocument.views) {
      headings.push({
        id: 'views',
        text: 'Views',
        level: 1,
      });

      for (const view of parsedDocument.views ?? []) {
        const viewAnchorId = generateUniqueId(view.name);
        const viewHeading = {
          id: viewAnchorId,
          text: view.name,
          level: 2,
        };

        headings.push(viewHeading);

        processedViews.push({
          ...view,
          anchorId: viewAnchorId,
        });
      }
    }

    return {
      ...parsedDocument,
      processedDescription,
      processedFeatures,
      processedViews,
      headings,
    };
  }

  public getExample(exampleId: any): ParsedExample | undefined {
    const document = this.document();

    console.log(exampleId);

    if (!document) {
      return undefined;
    }

    for (const feature of document.features) {
      const example = feature.examples?.find((ex) => ex.id === exampleId);
      if (example) {
        return example;
      }
    }

    return undefined;
  }
}
