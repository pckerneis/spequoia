import { Component, Input, signal } from '@angular/core';
import { ProcessedDocument } from '../../models/processed-document.model';
import { RouterLink } from '@angular/router';
import { TagComponent } from '../tag/tag.component';
import { DocumentService } from '../../services/document.service';
import { TagDropdownComponent } from '../tag-dropdown/tag-dropdown.component';
import {SearchService} from '../../services/search.service';

@Component({
  selector: 'header',
  imports: [RouterLink, TagComponent, TagDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input()
  document!: ProcessedDocument;

  constructor(readonly documentService: DocumentService, readonly searchService: SearchService) {}

  toggleTag(tagName: string) {
    this.documentService.toggleTagFilter(tagName);
  }

  public removeTagFilter(tagName: string): void {
    this.documentService.removeTagFilter(tagName);
  }

  searchResults = signal<Array<{ id: string; title: string; matchingDescription?: string }>>([]);

  public handleInput($event: Event): void {
    const input = $event.target as HTMLInputElement;
    const results = this.searchService.search(input.value);

    console.log('Search results:', results);

    this.searchResults.set(results.map(result => ({
      id: result.id,
      title: result['name'],
      matchingDescription: result['description'] ? this.getMatchingSnippet(result['description'], input.value) : undefined
    })));
  }

  public onResultClick(result: { id: string; title: string; matchingDescription?: string }): void {
    // TODO: Navigate to the result
    console.log('Clicked result:', result);
    this.searchResults.set([]);
  }

  private getMatchingSnippet(description: string, query: string): string {
    if (!query) return description.slice(0, 100) + '...';

    const index = description.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return description.slice(0, 100) + '...';

    const start = Math.max(0, index - 50);
    const end = Math.min(description.length, index + query.length + 50);
    const prefix = start > 0 ? '...' : '';
    const suffix = end < description.length ? '...' : '';
    const beforeMatch = description.slice(start, index);
    const match = description.slice(index, index + query.length);
    const afterMatch = description.slice(index + query.length, end);
    
    return prefix + beforeMatch + `<span class="highlight">${match}</span>` + afterMatch + suffix;
  }
}
