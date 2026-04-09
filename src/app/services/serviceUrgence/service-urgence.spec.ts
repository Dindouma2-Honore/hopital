import { TestBed } from '@angular/core/testing';

import { ServiceUrgence } from './service-urgence';

describe('ServiceUrgence', () => {
  let service: ServiceUrgence;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceUrgence);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
