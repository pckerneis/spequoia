import { Injectable } from '@angular/core';
import MiniSearch from 'minisearch';
import {ProcessedDocument} from '../models/processed-document.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private miniSearch: MiniSearch | null = null;

  constructor() { }

  public indexDocument(document: ProcessedDocument) {
    const miniSearch = new MiniSearch({
      fields: ['title', 'description', 'tags', 'examples'],
      storeFields: ['id', 'title', 'description', 'tags', 'examples'],
      searchOptions: {
        boost: {
          title: 2,
          description: 1,
          tags: 0.5,
          examples: 0.5
        }
      }
    });

    miniSearch.addAll(document.features);

    this.miniSearch = miniSearch;
  }

  public search(query: string) {
    if (!this.miniSearch) {
      throw new Error('Document not indexed');
    }
    return this.miniSearch.search(query);
  }
}
