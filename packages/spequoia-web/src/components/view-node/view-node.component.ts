import {Component, Input} from '@angular/core';
import {ParsedViewNode} from 'spequoia-core/dist/model/parsed-document.model';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-view-node',
  imports: [
    NgClass
  ],
  templateUrl: './view-node.component.html',
  styleUrl: './view-node.component.scss'
})
export class ViewNodeComponent {
  @Input() name!: string;
  @Input() viewNode!: ParsedViewNode;

  get cssClass(): string {
    if (this.viewNode?.direction === 'row') {
      return 'row';
    } else {
      return 'column';
    }
  }
}
