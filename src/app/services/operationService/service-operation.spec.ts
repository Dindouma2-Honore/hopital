import { TestBed } from '@angular/core/testing';

import { ServiceOperation } from './service-operation';

describe('ServiceOperation', () => {
  let service: ServiceOperation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceOperation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
