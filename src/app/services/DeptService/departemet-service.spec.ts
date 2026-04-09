import { TestBed } from '@angular/core/testing';

import { DepartemetService } from './departemet-service';

describe('DepartemetService', () => {
  let service: DepartemetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartemetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
