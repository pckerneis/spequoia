import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultsPageComponent } from './test-results-page.component';

describe('TestResultsPageComponent', () => {
  let component: TestResultsPageComponent;
  let fixture: ComponentFixture<TestResultsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestResultsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestResultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
