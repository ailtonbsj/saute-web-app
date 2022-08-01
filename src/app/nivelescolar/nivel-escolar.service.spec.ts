/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NivelEscolarService } from './nivel-escolar.service';

describe('Service: NivelEscolar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NivelEscolarService]
    });
  });

  it('should ...', inject([NivelEscolarService], (service: NivelEscolarService) => {
    expect(service).toBeTruthy();
  }));
});
