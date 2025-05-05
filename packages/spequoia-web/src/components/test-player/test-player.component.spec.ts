import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestPlayerComponent } from './test-player.component';

describe('TestPlayerComponent', () => {
  let component: TestPlayerComponent;
  let fixture: ComponentFixture<TestPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestPlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
