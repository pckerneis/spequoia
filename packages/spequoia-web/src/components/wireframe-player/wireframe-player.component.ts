import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  Input,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { WireframePlayerService } from '../../services/wireframe-player.service';
import { ParsedExample } from 'spequoia-core/dist/model/parsed-document.model';
import { ViewNodeComponent } from '../view-node/view-node.component';

@Component({
  selector: 'app-wireframe-player',
  providers: [WireframePlayerService],
  imports: [ViewNodeComponent],
  templateUrl: './wireframe-player.component.html',
  styleUrl: './wireframe-player.component.scss',
})
export class WireframePlayerComponent implements AfterViewInit {
  @Input() example: ParsedExample | undefined;

  @ViewChild('wireframePlayer', { read: ElementRef, static: false })
  playerRoot: ElementRef | null = null;

  @ViewChild('viewRoot', { read: ElementRef, static: false })
  viewRoot: ElementRef | null = null;

  @ViewChildren('step')
  stepButtons?: QueryList<ElementRef>;

  @ViewChild('viewContainer', { read: ElementRef, static: false })
  viewContainer: ElementRef | null = null;

  @Input() layout: 'large' | 'small' = 'small';

  $viewTransform = signal('translateX(0px) scale(1)');
  $viewHeight = computed(() => (this.layout === 'large' ? 500 : 320));

  constructor(public readonly wireframePlayerService: WireframePlayerService) {}

  ngAfterViewInit(): void {
    if (this.example) {
      this.wireframePlayerService.initialise(this.example);

      this.wireframePlayerService.stepChanged$.subscribe(() => {
        setTimeout(() => this.updateTransform(), 0);
      });
    }

    setTimeout(() => this.updateTransform(), 0);

    this.wireframePlayerService.stepChanged$.subscribe(() => {
      if (!this.stepButtons) {
        return;
      }
      this.stepButtons.forEach((el, index) => {
        if (this.wireframePlayerService.currentStepIndex() == index) {
          el.nativeElement.focus();
        }
      });
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const root = this.playerRoot?.nativeElement as HTMLElement;

    if (!root.contains(event.target as Node)) {
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      this.wireframePlayerService.next();
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      this.wireframePlayerService.previous();
      event.preventDefault();
    }
  }

  private updateTransform() {
    const view = this.viewRoot?.nativeElement as HTMLElement;
    const viewContainer = this.viewContainer?.nativeElement as HTMLElement;

    if (!view && !viewContainer) {
      return;
    }

    const viewHeight = view.scrollHeight;
    const viewWidth = view.scrollWidth;

    const containerHeight = viewContainer.offsetHeight;
    const containerWidth = viewContainer.offsetWidth;

    const scaleX = containerWidth / viewWidth;
    const scaleY = containerHeight / viewHeight;
    const scale = Math.min(scaleX, scaleY);

    this.$viewTransform.set(`scale(${scale})`);
  }
}
