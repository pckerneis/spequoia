import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ParsedStep } from 'spequoia-core/dist';
import { WireframePlayerService } from '../../services/wireframe-player.service';

@Component({
  selector: 'app-wireframe-player-step',
  imports: [],
  templateUrl: './wireframe-player-step.component.html',
  styleUrl: './wireframe-player-step.component.scss',
})
export class WireframePlayerStepComponent {
  @Input() step!: ParsedStep;

  @ViewChild('listItem')
  listItem!: ElementRef<HTMLElement>;

  constructor(public readonly wireframePlayerService: WireframePlayerService) {
    wireframePlayerService.stepChanged$.subscribe(() => {
      if (wireframePlayerService.currentStep() === this.step) {
        this.listItem.nativeElement.focus();
      }
    });
  }
}
