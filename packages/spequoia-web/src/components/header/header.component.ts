import {Component, Input} from '@angular/core';
import {ProcessedDocument} from '../../models/processed-document.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input()
  document!: ProcessedDocument;
}
