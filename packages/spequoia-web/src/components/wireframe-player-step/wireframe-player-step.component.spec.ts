import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WireframePlayerStepComponent } from './wireframe-player-step.component';

describe('WireframePlayerStepComponent', () => {
  let component: WireframePlayerStepComponent;
  let fixture: ComponentFixture<WireframePlayerStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WireframePlayerStepComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WireframePlayerStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
