import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParseErrorComponent } from './parse-error.component';

describe('ParseErrorComponent', () => {
  let component: ParseErrorComponent;
  let fixture: ComponentFixture<ParseErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParseErrorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ParseErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
