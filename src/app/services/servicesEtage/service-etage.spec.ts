import { TestBed } from '@angular/core/testing';

import { ServiceEtage } from './service-etage';

describe('ServiceEtage', () => {
  let service: ServiceEtage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceEtage);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
