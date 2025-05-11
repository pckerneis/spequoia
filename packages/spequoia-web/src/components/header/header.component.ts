import { Component, Input, signal } from '@angular/core';
import { ProcessedDocument } from '../../models/processed-document.model';
import { RouterLink } from '@angular/router';
import { TagComponent } from '../tag/tag.component';
import { DocumentService } from '../../services/document.service';
import { TagDropdownComponent } from '../tag-dropdown/tag-dropdown.component';

@Component({
  selector: 'header',
  imports: [RouterLink, TagComponent, TagDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input()
  document!: ProcessedDocument;

  constructor(readonly documentService: DocumentService) {}

  availableTags = signal<string[]>([]);

  ngOnInit() {
    // Get unique tags from all features
    const doc = this.documentService.document();
    if (doc) {
      const allTags = doc.features
        .flatMap((feature) => feature.tags || [])
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .sort();
      this.availableTags.set(allTags);
    }
  }

  toggleTag(tagName: string) {
    this.documentService.toggleTagFilter(tagName);
  }

  public removeTagFilter(tagName: string): void {
    this.documentService.removeTagFilter(tagName);
  }
}
