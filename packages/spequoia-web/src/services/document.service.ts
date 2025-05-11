import { Injectable, signal } from '@angular/core';
import {
  ParsedDocument,
} from 'spequoia-core/dist/model/parsed-document.model';
import {
  ExampleWithManifest,
  ProcessedDocument,
  ProcessedView,
} from '../models/processed-document.model';
import { Heading } from '../models/heading.model';
import * as commonmark from 'commonmark';
import {HttpClient} from '@angular/common/http';
import {Manifest} from '../models/manifest.model';
import {map, Observable, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  initialDocument = signal<ProcessedDocument | null>(null);
  document = signal<ProcessedDocument | null>(null);
  tagFilter = signal<string[]>([]);

  private readonly manifestByExampleId = new Map<string, Manifest>();

  constructor(private readonly http: HttpClient) {}

  public setDocument(parsedDocument: ParsedDocument): void {
    const processedDocument = this.processDocument(parsedDocument);
    this.initialDocument.set(processedDocument);
    this.document.set(processedDocument);
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
                isFeature: false,
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
      isFeature: false,
    });

    const processedFeatures = [];

    for (const feature of parsedDocument.features) {
      const featureAnchorId = generateUniqueId(feature.name);
      const featureHeading = {
        id: featureAnchorId,
        text: feature.name,
        level: 2,
        isFeature: true,
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
        isFeature: false,
      });

      for (const view of parsedDocument.views ?? []) {
        const viewAnchorId = generateUniqueId(view.name);
        const viewHeading = {
          id: viewAnchorId,
          text: view.name,
          level: 2,
          isFeature: false,
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

  public getExample(exampleId: any): Observable<ExampleWithManifest | undefined> {
    const document = this.document();

    if (!document) {
      return of(undefined);
    }

    for (const feature of document.features) {
      const example = feature.examples?.find((ex) => ex.id === exampleId);
      if (example) {
        return this.findCorrespondingManifest(example.id).pipe(
          map((manifest) => {
            return {
              ...example,
              manifest,
            };
          })
        );
      }
    }

    return of(undefined);
  }

  private findCorrespondingManifest(exampleId: string): Observable<Manifest | null> {
    const manifest = this.manifestByExampleId.get(exampleId);
    if (manifest) {
      return of(manifest);
    }

    return this.http
      .get<Manifest>(`player-data/${exampleId}/screenshot-manifest.json`)
      .pipe(tap((manifest) => {
        this.manifestByExampleId.set(exampleId, manifest);
      }));
  }

  public setTagFilter(tagName: string): void {
    this.tagFilter.set([tagName]);
    this.applyFilters();
  }

  public removeTagFilter(tagName: string): void {
    const currentTags = this.tagFilter();
    const newTags = currentTags.filter((tag) => tag !== tagName);
    this.tagFilter.set(newTags);
    this.applyFilters();
  }

  private applyFilters(): void {
    const document = this.initialDocument();
    if (!document) {
      return;
    }

    const appliedTags = this.tagFilter();

    if (appliedTags.length === 0) {
      this.document.set(document);
      return;
    }

    const filteredFeatures = document.processedFeatures.filter((feature) =>
      feature.tags?.some((tag) => appliedTags.includes(tag))
    );

    this.document.set({
      ...document,
      processedFeatures: filteredFeatures,
      headings: document.headings.filter((heading) => {
        if (!heading.isFeature) {
          return true;
        }

        const feature = filteredFeatures.find((f) => f.anchorId === heading.id);
        return !!feature;
      })
    });
  }
}

