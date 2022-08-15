import { TestBed } from '@angular/core/testing';

import { ConfiguracoesService } from './configuracoes.service';

describe('ConfiguracoesService', () => {
  let service: ConfiguracoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
