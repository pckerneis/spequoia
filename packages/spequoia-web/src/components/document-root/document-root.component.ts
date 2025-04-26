import {Component, Input} from '@angular/core';
import {ParsedDocument} from 'spequoia-core/dist/model/parsed-document.model';
import {MarkdownPipe} from '../../pipes/markdown.pipe';

@Component({
  selector: 'app-document-root',
  imports: [
    MarkdownPipe
  ],
  templateUrl: './document-root.component.html',
  styleUrl: './document-root.component.scss'
})
export class DocumentRootComponent {
  @Input() document!: ParsedDocument | undefined;

}
