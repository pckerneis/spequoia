import {AfterViewInit, Component, ElementRef, Input, OnInit, signal, ViewChild} from '@angular/core';
import {WireframePlayerService} from '../../services/wireframe-player.service';
import {ParsedExample} from 'spequoia-core/dist/model/parsed-document.model';
import {ViewNodeComponent} from '../view-node/view-node.component';

@Component({
  selector: 'app-wireframe-player',
  providers: [
    WireframePlayerService
  ],
  imports: [
    ViewNodeComponent
  ],
  templateUrl: './wireframe-player.component.html',
  styleUrl: './wireframe-player.component.scss'
})
export class WireframePlayerComponent implements AfterViewInit {
  @Input() example: ParsedExample | undefined;

  @ViewChild('viewRoot', {read: ElementRef, static: false})
  viewRoot: ElementRef | null = null;

  @ViewChild('viewContainer', {read: ElementRef, static: false})
  viewContainer: ElementRef | null = null;

  $viewTransform = signal('translateX(0px) scale(1)');
  $viewHeight = signal(320);

  constructor(public readonly wireframePlayerService: WireframePlayerService) {
  }

  ngAfterViewInit(): void {
    if (this.example) {
      console.log('initialize')
      this.wireframePlayerService.initialise(this.example);

      if (this.wireframePlayerService.currentView()) {
        setTimeout(() => this.updateTransform(), 100);
      }
    }
  }

  private updateTransform() {
    const view = this.viewRoot?.nativeElement as HTMLElement;
    const viewContainer = this.viewContainer?.nativeElement as HTMLElement;

    if (!view && !viewContainer) {
      return;
    }

    const viewHeight = view.getBoundingClientRect().height;
    const viewWidth = view.getBoundingClientRect().width;

    const containerHeight = viewContainer.clientHeight;
    const containerWidth = viewContainer.clientWidth;

    const scaleX = containerWidth / viewWidth;
    const scaleY = containerHeight / viewHeight;
    const scale = Math.min(scaleX, scaleY);

    this.$viewTransform.set(`scale(${scale})`);
  }
}
