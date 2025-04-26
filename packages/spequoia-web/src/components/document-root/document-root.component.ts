import {Component, Input} from '@angular/core';
import {ParsedDocument} from 'spequoia-core/dist/model/parsed-document.model';
import {MarkdownPipe} from '../../pipes/markdown.pipe';
import {FeaturePanelComponent} from '../feature-panel/feature-panel.component';

@Component({
  selector: 'app-document-root',
  imports: [
    MarkdownPipe,
    FeaturePanelComponent
  ],
  templateUrl: './document-root.component.html',
  styleUrl: './document-root.component.scss'
})
export class DocumentRootComponent {
  @Input() document!: ParsedDocument | undefined;

}
