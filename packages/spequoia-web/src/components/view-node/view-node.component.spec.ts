import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNodeComponent } from './view-node.component';

describe('ViewNodeComponent', () => {
  let component: ViewNodeComponent;
  let fixture: ComponentFixture<ViewNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewNodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
