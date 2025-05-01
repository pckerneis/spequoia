import { TestBed } from '@angular/core/testing';

import { WireframePlayerService } from './wireframe-player.service';

describe('WireframePlayerService', () => {
  let service: WireframePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WireframePlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
