import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPageComponent } from './document-page.component';

describe('DocumentRootComponent', () => {
  let component: DocumentPageComponent;
  let fixture: ComponentFixture<DocumentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
