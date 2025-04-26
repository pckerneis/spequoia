import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRootComponent } from './document-root.component';

describe('DocumentRootComponent', () => {
  let component: DocumentRootComponent;
  let fixture: ComponentFixture<DocumentRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRootComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
