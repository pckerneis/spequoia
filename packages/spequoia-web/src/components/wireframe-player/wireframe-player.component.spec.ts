import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WireframePlayerComponent } from './wireframe-player.component';

describe('WireframePlayerComponent', () => {
  let component: WireframePlayerComponent;
  let fixture: ComponentFixture<WireframePlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WireframePlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WireframePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
