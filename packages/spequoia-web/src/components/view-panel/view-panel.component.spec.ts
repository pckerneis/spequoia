import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPanelComponent } from './view-panel.component';

describe('ViewPanelComponent', () => {
  let component: ViewPanelComponent;
  let fixture: ComponentFixture<ViewPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
