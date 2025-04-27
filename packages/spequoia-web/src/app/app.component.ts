import { Component, signal } from '@angular/core';
import { DocumentRootComponent } from '../components/document-root/document-root.component';
import { HttpClient } from '@angular/common/http';
import { ParseResult, parseSpec } from '@spequoia/core';
import { ParsedDocument } from 'spequoia-core/dist/model/parsed-document.model';
import * as commonmark from 'commonmark';
import { Heading } from '../models/heading.model';
import {ProcessedDocument, ProcessedView} from '../models/processed-document.model';

@Component({
  selector: 'app-root',
  imports: [DocumentRootComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'spequoia-web';

  $parseResult = signal(null as ParseResult | null);
  $processedDocument = signal(null as ProcessedDocument | null);

  constructor(public readonly http: HttpClient) {
    this.http
      .get('example.yaml', { responseType: 'text' })
      .subscribe((data) => {
        const parseResult = parseSpec(data);
        this.$parseResult.set(parseResult);

        if (parseResult.parsedDocument) {
          this.$processedDocument.set(
            this.processDocument(parseResult.parsedDocument),
          );
        }
      });
  }

  processDocument(parsedDocument: ParsedDocument): ProcessedDocument {
    const headings: Heading[] = [];

    const knownHeadingIds = new Set<string>();

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
      id: generateUniqueId('features'),
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
        id: generateUniqueId('views'),
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
}
