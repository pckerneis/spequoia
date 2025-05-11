import { Component, Input } from '@angular/core';
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

  toggleTag(tagName: string) {
    this.documentService.toggleTagFilter(tagName);
  }

  public removeTagFilter(tagName: string): void {
    this.documentService.removeTagFilter(tagName);
  }
}
