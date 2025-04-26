import { Component, computed, Input, signal } from '@angular/core';
import { FeaturePanelComponent } from '../feature-panel/feature-panel.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ProcessedDocument } from '../../models/processed-document.model';

@Component({
  selector: 'app-document-root',
  imports: [FeaturePanelComponent],
  templateUrl: './document-root.component.html',
  styleUrl: './document-root.component.scss',
})
export class DocumentRootComponent {
  @Input() processedDocument!: ProcessedDocument | null;

  constructor(private readonly domSanitizer: DomSanitizer) {}

  activeHeadingId = signal('');
  safeProcessedDescription = computed(() => {
    const description = this.processedDocument?.processedDescription;

    if (!description) {
      return '';
    }

    return this.domSanitizer.bypassSecurityTrustHtml(description);
  });

  public onHeadingClick(id: string): void {
    this.activeHeadingId.set(id);
  }
}
