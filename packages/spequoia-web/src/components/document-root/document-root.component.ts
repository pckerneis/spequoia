import {Component, Input} from '@angular/core';
import {ParsedDocument} from 'spequoia-core/dist/model/parsed-document.model';

@Component({
  selector: 'app-document-root',
  imports: [],
  templateUrl: './document-root.component.html',
  styleUrl: './document-root.component.scss'
})
export class DocumentRootComponent {
  @Input() document!: ParsedDocument | undefined;

}
