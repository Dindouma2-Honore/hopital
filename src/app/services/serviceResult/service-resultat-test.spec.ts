import { TestBed } from '@angular/core/testing';

import { ServiceResultatTest } from './service-resultat-test';

describe('ServiceResultatTest', () => {
  let service: ServiceResultatTest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceResultatTest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
