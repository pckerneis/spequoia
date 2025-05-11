import { Injectable } from '@angular/core';
import MiniSearch from 'minisearch';
import { ProcessedDocument } from '../models/processed-document.model';
import * as commonmark from 'commonmark';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private miniSearch: MiniSearch | null = null;

  constructor() {}

  public indexDocument(document: ProcessedDocument) {
    const normalizedFeatures = document.processedFeatures.map((feature) => ({
      ...feature,
      description: textify(feature.description),
    }));

    const miniSearch = new MiniSearch({
      fields: ['name', 'description'],
      storeFields: ['id', 'name', 'description', 'anchorId'],
      searchOptions: {
        boost: {
          title: 2,
          description: 1,
          tags: 0.5,
          examples: 0.5,
        },
      },
    });

    miniSearch.addAll(normalizedFeatures);

    this.miniSearch = miniSearch;
  }

  public search(query: string) {
    if (!this.miniSearch) {
      throw new Error('Document not indexed');
    }
    return this.miniSearch.search(query, {
      boost: {
        title: 2,
      },
      fuzzy: 0.2,
      prefix: true,
    });
  }
}

function textify(markdown: string | undefined): string {
  if (!markdown) return '';

  const reader = new commonmark.Parser();
  const writer = new commonmark.HtmlRenderer();
  const parsed = reader.parse(markdown);
  const html = writer.render(parsed);

  const div = document.createElement('div');
  div.innerHTML = html;
  return div.innerText || div.textContent || '';
}
