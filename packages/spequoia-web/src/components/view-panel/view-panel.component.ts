import {Component, Input} from '@angular/core';
import {ProcessedView} from '../../models/processed-document.model';
import {ViewNodeComponent} from '../view-node/view-node.component';

@Component({
  selector: 'app-view-panel',
  imports: [
    ViewNodeComponent
  ],
  templateUrl: './view-panel.component.html',
  styleUrl: './view-panel.component.scss'
})
export class ViewPanelComponent {
  @Input() view!: ProcessedView;
}
