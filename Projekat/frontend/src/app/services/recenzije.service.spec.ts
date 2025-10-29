import { TestBed } from '@angular/core/testing';

import { RecenzijeService } from './recenzije.service';

describe('RecenzijeService', () => {
  let service: RecenzijeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecenzijeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
