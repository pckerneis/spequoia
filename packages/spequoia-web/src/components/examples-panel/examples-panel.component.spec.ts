import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamplesPanelComponent } from './examples-panel.component';

describe('ExamplesPanelComponent', () => {
  let component: ExamplesPanelComponent;
  let fixture: ComponentFixture<ExamplesPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamplesPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamplesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
