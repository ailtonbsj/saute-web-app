import { TestBed } from '@angular/core/testing';

import { ProcessoService } from './processo.service';

describe('ProcessoService', () => {
  let service: ProcessoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
