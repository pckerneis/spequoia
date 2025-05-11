import {Component, Input, signal} from '@angular/core';
import {ProcessedDocument} from '../../models/processed-document.model';
import {RouterLink} from '@angular/router';
import {TagComponent} from '../tag/tag.component';
import {DocumentService} from '../../services/document.service';

@Component({
  selector: 'header',
  imports: [
    RouterLink,
    TagComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input()
  document!: ProcessedDocument;

  constructor(readonly documentService: DocumentService) {}

  public removeTagFilter(tagName: string): void {
    this.documentService.removeTagFilter(tagName);
  }
}
